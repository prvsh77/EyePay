import { Router } from "express";
import { z } from "zod";
import { db, wallets, transactions, recipients, fraudAlerts } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { analyzeTransaction } from "../lib/fraudService";

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

      // 2. Fetch user's wallet again to lock and check balance
      const [txWallet] = await tx.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
      if (!txWallet) {
        throw new Error("Wallet not found");
      }

      // 3. Verify balance
      const currentBalance = parseFloat(txWallet.balance);
      if (currentBalance < amount) {
        throw new Error("Insufficient funds");
      }

      // 4. Deduct amount
      const newBalance = (currentBalance - amount).toFixed(2);
      await tx.update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, txWallet.id));

      const status = analysis.isFlagged ? "pending" : "completed";

      // 5. Create transaction log
      const [transaction] = await tx.insert(transactions).values({
        walletId: txWallet.id,
        type: "send",
        amount: amount.toFixed(2),
        currency,
        status,
        description: description || `Sent to ${recipient.name}`,
        recipientId: recipient.id,
        riskScore: analysis.riskScore,
        destinationCountry: destinationCountry.toUpperCase(),
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

      return transaction;
    });

    res.status(201).json(result);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "Recipient not found or unauthorized" ||
        err.message === "Wallet not found" ||
        err.message === "Insufficient funds")
    ) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

export default router;
