import { Router } from "express";
import { z } from "zod";
import { db, wallets, transactions, recipients, fraudAlerts } from "@workspace/db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { analyzeTransaction } from "../lib/fraudService";
import { creditLinkedRecipient } from "../lib/transfers";

const router = Router();

const transferSchema = z.object({
  recipientId: z.number(),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  destinationCountry: z.string().default("US"),
});

// GET /api/transactions
router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;

    // Get user's wallet first
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
    if (!wallet) {
      res.json([]);
      return;
    }

    // Get all transactions for this wallet ordered by date desc
    const walletTransactions = await db.select()
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .orderBy(desc(transactions.createdAt));

    res.json(walletTransactions);
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions/transfer
router.post("/transfer", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { recipientId, amount, currency, description, destinationCountry } = transferSchema.parse(req.body);

    // Get user's wallet first to pass its ID to fraud service
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
    if (!wallet) {
      res.status(400).json({ error: "Wallet not found" });
      return;
    }

    // Run AI fraud risk score assessment
    const analysis = await analyzeTransaction({
      walletId: wallet.id,
      amount,
      recipientId,
      destinationCountry,
    });

    const result = await db.transaction(async (tx) => {
      // 1. Verify recipient exists and belongs to this user
      const [recipient] = await tx.select()
        .from(recipients)
        .where(and(eq(recipients.id, recipientId), eq(recipients.userId, userId)))
        .limit(1);

      if (!recipient) {
        throw new Error("Recipient not found or unauthorized");
      }
      if (recipient.linkedUserId === userId) {
        throw new Error("Cannot send to your own account");
      }

      // 2. Resolve the receiving wallet if the recipient is a linked EyePay user,
      // then lock every wallet involved FOR UPDATE in a single statement ordered
      // by id. Consistent lock order means two users transferring to each other
      // at the same time can't deadlock.
      let receiverWalletId: number | null = null;
      if (recipient.linkedUserId !== null) {
        const [receiverWallet] = await tx.select({ id: wallets.id })
          .from(wallets)
          .where(eq(wallets.userId, recipient.linkedUserId))
          .limit(1);
        if (!receiverWallet) {
          throw new Error("Recipient wallet not found");
        }
        receiverWalletId = receiverWallet.id;
      }

      const walletIdsToLock = receiverWalletId === null ? [wallet.id] : [wallet.id, receiverWalletId];
      const lockedWallets = await tx.select({ id: wallets.id })
        .from(wallets)
        .where(inArray(wallets.id, walletIdsToLock))
        .orderBy(wallets.id)
        .for("update");
      if (!lockedWallets.some((w) => w.id === wallet.id)) {
        throw new Error("Wallet not found");
      }

      // 3-4. Deduct amount via an atomic, exact-decimal conditional update:
      // only succeeds if the locked balance still covers the transfer. No
      // JS float parsing or comparison of the balance is involved.
      const [debitedWallet] = await tx.update(wallets)
        .set({ balance: sql`${wallets.balance} - ${amount.toFixed(2)}::numeric` })
        .where(and(eq(wallets.id, wallet.id), sql`${wallets.balance} >= ${amount.toFixed(2)}::numeric`))
        .returning();

      if (!debitedWallet) {
        throw new Error("Insufficient funds");
      }

      const status = analysis.isFlagged ? "pending" : "completed";

      // 5. Create transaction log
      const [transaction] = await tx.insert(transactions).values({
        walletId: wallet.id,
        type: "send",
        amount: amount.toFixed(2),
        currency,
        status,
        description: description || `Sent to ${recipient.name}`,
        recipientId: recipient.id,
        riskScore: analysis.riskScore,
        destinationCountry: destinationCountry.toUpperCase(),
        // Snapshot who gets credited; approval reads this, not the recipient row.
        creditUserId: recipient.linkedUserId,
      }).returning();

      // 6. If transaction is flagged as high-risk, insert into fraudAlerts
      if (analysis.isFlagged) {
        await tx.insert(fraudAlerts).values({
          transactionId: transaction.id,
          riskScore: analysis.riskScore,
          status: "pending",
          reasons: JSON.stringify(analysis.reasons),
        });
      }

      // 7. Credit a linked recipient's wallet now, but only for clean transfers.
      // Flagged transfers stay pending and are credited on admin approval
      // (see fraud.ts); a rejected one only refunds the sender.
      if (!analysis.isFlagged && transaction.creditUserId !== null) {
        await creditLinkedRecipient(tx, transaction, transaction.creditUserId);
      }

      return transaction;
    });

    res.status(201).json(result);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "Recipient not found or unauthorized" ||
        err.message === "Cannot send to your own account" ||
        err.message === "Wallet not found" ||
        err.message === "Recipient wallet not found" ||
        err.message === "Insufficient funds")
    ) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

export default router;
