import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db, users, wallets } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "eyepay_super_secret_key_123456";

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
