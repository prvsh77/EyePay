import { Router } from "express";
import { z } from "zod";
import { db, wallets, transactions } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

const fundingSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
});

// GET /api/wallets
router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    let [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
    
    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      [wallet] = await db.insert(wallets).values({
        userId,
        balance: "0.00",
        currency: "USD",
      }).returning();
    }
    
    res.json(wallet);
  } catch (err) {
    next(err);
  }
});

// POST /api/wallets/deposit
router.post("/deposit", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { amount, currency } = fundingSchema.parse(req.body);

    const result = await db.transaction(async (tx) => {
      let [wallet] = await tx.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
      
      if (!wallet) {
        [wallet] = await tx.insert(wallets).values({
          userId,
          balance: "0.00",
          currency,
        }).returning();
      }

      const currentBalance = parseFloat(wallet.balance);
      const newBalance = (currentBalance + amount).toFixed(2);

      // Update wallet balance
      const [updatedWallet] = await tx.update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, wallet.id))
        .returning();

      // Log transaction
      await tx.insert(transactions).values({
        walletId: wallet.id,
        type: "deposit",
        amount: amount.toFixed(2),
        currency,
        status: "completed",
        description: `Deposited ${currency} ${amount.toFixed(2)}`,
      });

      return updatedWallet;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/wallets/withdraw
router.post("/withdraw", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { amount, currency } = fundingSchema.parse(req.body);

    const result = await db.transaction(async (tx) => {
      const [wallet] = await tx.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
      
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const currentBalance = parseFloat(wallet.balance);
      if (currentBalance < amount) {
        throw new Error("Insufficient funds");
      }

      const newBalance = (currentBalance - amount).toFixed(2);

      // Update wallet balance
      const [updatedWallet] = await tx.update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, wallet.id))
        .returning();

      // Log transaction
      await tx.insert(transactions).values({
        walletId: wallet.id,
        type: "withdrawal",
        amount: amount.toFixed(2),
        currency,
        status: "completed",
        description: `Withdrew ${currency} ${amount.toFixed(2)}`,
      });

      return updatedWallet;
    });

    res.json(result);
  } catch (err) {
    if (err instanceof Error && (err.message === "Insufficient funds" || err.message === "Wallet not found")) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
});

export default router;
