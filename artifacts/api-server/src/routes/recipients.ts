import { Router } from "express";
import { z } from "zod";
import { db, recipients, users } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

/** If the recipient's email belongs to a registered EyePay user, return that user's id. */
async function findLinkedUserId(email: string): Promise<number | null> {
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  return user?.id ?? null;
}

const recipientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  walletAddress: z.string().min(10),
});

// GET /api/recipients
router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const userRecipients = await db.select().from(recipients).where(eq(recipients.userId, userId));
    res.json(userRecipients);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipients
router.post("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { name, email, walletAddress } = recipientSchema.parse(req.body);

    const [newRecipient] = await db.insert(recipients).values({
      userId,
      name,
      email,
      walletAddress,
      linkedUserId: await findLinkedUserId(email),
    }).returning();

    res.status(201).json(newRecipient);
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipients/:id
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const recipientId = Number(req.params.id);
    if (isNaN(recipientId)) {
      res.status(400).json({ error: "Invalid recipient ID" });
      return;
    }

    const { name, email, walletAddress } = recipientSchema.parse(req.body);

    // Verify ownership
    const [existing] = await db.select().from(recipients).where(and(eq(recipients.id, recipientId), eq(recipients.userId, userId))).limit(1);
    if (!existing) {
      res.status(404).json({ error: "Recipient not found or unauthorized" });
      return;
    }

    const [updated] = await db.update(recipients).set({
      name,
      email,
      walletAddress,
      // Re-resolve on every update so an email change can't leave a stale link.
      linkedUserId: await findLinkedUserId(email),
    }).where(eq(recipients.id, recipientId)).returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipients/:id
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const recipientId = Number(req.params.id);
    if (isNaN(recipientId)) {
      res.status(400).json({ error: "Invalid recipient ID" });
      return;
    }

    // Verify ownership
    const [existing] = await db.select().from(recipients).where(and(eq(recipients.id, recipientId), eq(recipients.userId, userId))).limit(1);
    if (!existing) {
      res.status(404).json({ error: "Recipient not found or unauthorized" });
      return;
    }

    await db.delete(recipients).where(eq(recipients.id, recipientId));
    res.json({ message: "Recipient deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
