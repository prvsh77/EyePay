import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db, users, wallets, recipients } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { JWT_SECRET } from "../env";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUsers.length > 0) {
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx.insert(users).values({
        email,
        password: hashedPassword,
        name,
      }).returning();

      // Create default wallet
      const [newWallet] = await tx.insert(wallets).values({
        userId: newUser.id,
        balance: "0.00",
        currency: "USD",
      }).returning();

      // Backfill: recipients other users already saved under this email now
      // link to the new account, so future transfers to them credit this wallet.
      await tx.update(recipients)
        .set({ linkedUserId: newUser.id })
        .where(and(eq(recipients.email, email), isNull(recipients.linkedUserId)));

      return { user: newUser, wallet: newWallet };
    });

    const token = jwt.sign({ userId: result.user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      wallet: result.wallet,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      wallet: wallet || null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
