import { Router } from "express";
import { db, fraudAlerts, transactions, wallets, users } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/requireAdmin";
import { creditLinkedRecipient } from "../lib/transfers";

const router = Router();

// GET /api/admin/fraud-alerts - Lists all flagged fraud alerts
router.get("/fraud-alerts", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const alerts = await db.select({
      id: fraudAlerts.id,
      transactionId: fraudAlerts.transactionId,
      riskScore: fraudAlerts.riskScore,
      status: fraudAlerts.status,
      reasons: fraudAlerts.reasons,
      createdAt: fraudAlerts.createdAt,
      transaction: {
        id: transactions.id,
        amount: transactions.amount,
        currency: transactions.currency,
        status: transactions.status,
        description: transactions.description,
        createdAt: transactions.createdAt,
        destinationCountry: transactions.destinationCountry,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
    .from(fraudAlerts)
    .innerJoin(transactions, eq(fraudAlerts.transactionId, transactions.id))
    .innerJoin(wallets, eq(transactions.walletId, wallets.id))
    .innerJoin(users, eq(wallets.userId, users.id))
    .orderBy(desc(fraudAlerts.createdAt));

    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/fraud-alerts/:id/action - Approve or reject a flagged transaction
router.post("/fraud-alerts/:id/action", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const alertId = parseInt(req.params.id as string);
    const { action } = req.body; // 'approve' | 'reject'

    if (action !== "approve" && action !== "reject") {
      res.status(400).json({ error: "Invalid action. Must be 'approve' or 'reject'" });
      return;
    }

    const result = await db.transaction(async (tx) => {
      // 1. Fetch the alert
      const [alert] = await tx.select()
        .from(fraudAlerts)
        .where(eq(fraudAlerts.id, alertId))
        .limit(1);

      if (!alert) {
        throw new Error("Fraud alert not found");
      }

      if (alert.status !== "pending") {
        throw new Error("Fraud alert is already resolved");
      }

      // 2. Fetch the associated transaction
      const [transaction] = await tx.select()
        .from(transactions)
        .where(eq(transactions.id, alert.transactionId))
        .limit(1);

      if (!transaction) {
        throw new Error("Associated transaction not found");
      }

      if (action === "approve") {
        // Mark transaction as completed and alert as approved
        await tx.update(transactions)
          .set({ status: "completed" })
          .where(eq(transactions.id, transaction.id));

        await tx.update(fraudAlerts)
          .set({ status: "approved" })
          .where(eq(fraudAlerts.id, alert.id));

        // The sender was debited at initiation; the linked recipient is only
        // credited now that the transfer is approved. credit_user_id was
        // snapshotted at initiation, so this works even if the recipient row
        // has since been deleted.
        if (transaction.creditUserId !== null) {
          await creditLinkedRecipient(tx, transaction, transaction.creditUserId);
        }
      } else {
        // Mark transaction as failed and alert as rejected
        await tx.update(transactions)
          .set({ status: "failed" })
          .where(eq(transactions.id, transaction.id));

        await tx.update(fraudAlerts)
          .set({ status: "rejected" })
          .where(eq(fraudAlerts.id, alert.id));

        // Refund the amount to the sender's wallet balance.
        // Lock the wallet row for the duration of the transaction so
        // concurrent deposits/withdrawals/transfers can't read a stale
        // balance (matches the pattern in wallets.ts / transactions.ts).
        const [wallet] = await tx.select()
          .from(wallets)
          .where(eq(wallets.id, transaction.walletId))
          .for("update")
          .limit(1);

        if (!wallet) {
          throw new Error("Sender's wallet not found");
        }

        // Let Postgres do exact decimal arithmetic on the numeric column
        // instead of parseFloat'ing the balance and refund amount in JS.
        await tx.update(wallets)
          .set({ balance: sql`${wallets.balance} + ${transaction.amount}::numeric` })
          .where(eq(wallets.id, wallet.id));
      }

      return {
        id: alert.id,
        transactionId: transaction.id,
        action,
        status: action === "approve" ? "approved" : "rejected",
      };
    });

    res.json(result);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "Fraud alert not found" ||
        err.message === "Fraud alert is already resolved" ||
        err.message === "Associated transaction not found" ||
        err.message === "Sender's wallet not found" ||
        err.message === "Recipient wallet not found")
    ) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

export default router;
