import { Router } from "express";
import { db, wallets, transactions, recipients, fraudAlerts, users, copilotConversations } from "@workspace/db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";
import { generateChatResponse, type ChatMessage } from "../services/aiProvider";

const router = Router();

// GET /api/copilot/history - retrieve message history
router.get("/history", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const history = await db
      .select()
      .from(copilotConversations)
      .where(eq(copilotConversations.userId, userId))
      .orderBy(asc(copilotConversations.createdAt));
      
    res.json(history);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/copilot/history - clear chat logs
router.delete("/history", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    await db
      .delete(copilotConversations)
      .where(eq(copilotConversations.userId, userId));
      
    res.json({ message: "Conversation history cleared successfully." });
  } catch (err) {
    next(err);
  }
});

// POST /api/copilot/chat - send query to copilot
router.post("/chat", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { message } = req.body;
    
    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message content is required" });
      return;
    }

    // 1. Gather Context from DB
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);

    if (!user || !wallet) {
      res.status(400).json({ error: "Account or wallet not found" });
      return;
    }

    const userRecipients = await db.select().from(recipients).where(eq(recipients.userId, userId));
    const recipientMap = new Map(userRecipients.map(r => [r.id, r]));

    const allTxs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .orderBy(desc(transactions.createdAt));

    // Aggregates for database context
    const volumeByTypeRaw = await db
      .select({
        type: transactions.type,
        totalAmount: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .groupBy(transactions.type);

    const volumeByType = volumeByTypeRaw.map(v => ({
      type: v.type,
      totalAmount: parseFloat(v.totalAmount),
      count: v.count,
    }));

    const totalVolume = volumeByType.reduce((sum, item) => sum + item.totalAmount, 0);

    const countryDistributionRaw = await db
      .select({
        country: transactions.destinationCountry,
        volume: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .where(and(eq(transactions.walletId, wallet.id), eq(transactions.type, "send")))
      .groupBy(transactions.destinationCountry);

    const countryDistribution = countryDistributionRaw.map(c => ({
      country: c.country,
      volume: parseFloat(c.volume),
      count: c.count,
    }));

    const [avgRiskRow] = await db
      .select({
        avgScore: sql<number>`COALESCE(AVG(${transactions.riskScore}), 0)`,
        totalFlagged: sql<number>`CAST(COUNT(CASE WHEN ${transactions.riskScore} >= 70 THEN 1 END) AS INTEGER)`,
      })
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id));

    const alerts = await db
      .select({
        status: fraudAlerts.status,
        riskScore: fraudAlerts.riskScore,
        transactionId: fraudAlerts.transactionId,
      })
      .from(fraudAlerts)
      .innerJoin(transactions, eq(transactions.id, fraudAlerts.transactionId))
      .where(eq(transactions.walletId, wallet.id));

    const pendingAlertsCount = alerts.filter(a => a.status === "pending").length;

    // Security score calculation
    let healthScore = 100;
    const avgRisk = Number(avgRiskRow?.avgScore || 0);
    healthScore -= avgRisk * 0.4;
    if (allTxs.some(t => t.riskScore >= 70)) healthScore -= 15;
    if (pendingAlertsCount > 0) healthScore -= 20;
    const hasSanctioned = countryDistribution.some(c => 
      c.country === "KP" || c.country === "IR" || c.country === "SY" || c.country === "RU"
    );
    if (hasSanctioned) healthScore -= 15;
    healthScore = Math.max(12, Math.min(100, Math.round(healthScore)));

    // Top recipient calculation
    const recipientCounts: Record<number, number> = {};
    const recipientSums: Record<number, number> = {};
    allTxs.filter(t => t.type === "send" && t.recipientId).forEach(t => {
      const rId = t.recipientId!;
      recipientCounts[rId] = (recipientCounts[rId] || 0) + 1;
      recipientSums[rId] = (recipientSums[rId] || 0) + parseFloat(t.amount);
    });

    let topRecipientId = 0;
    let maxRecipientVolume = 0;
    Object.entries(recipientSums).forEach(([rId, vol]) => {
      if (vol > maxRecipientVolume) {
        maxRecipientVolume = vol;
        topRecipientId = parseInt(rId);
      }
    });

    const topRec = topRecipientId ? recipientMap.get(topRecipientId) : null;
    const topRecipient = topRec ? {
      name: topRec.name,
      email: topRec.email,
      volume: maxRecipientVolume,
      count: recipientCounts[topRecipientId] || 0,
    } : null;

    // Assemble DB context bundle for the AI Provider / Offline fallback
    const dbContext = {
      userName: user.name,
      balance: parseFloat(wallet.balance).toFixed(2),
      currency: wallet.currency,
      totalVolume,
      healthScore,
      pendingAlertsCount,
      topRecipient,
      countryDistribution,
      transactions: allTxs.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        recipientId: t.recipientId,
        riskScore: t.riskScore,
        destinationCountry: t.destinationCountry,
      })),
    };

    // 2. Fetch Conversation History from DB (last 15 messages)
    const dbHistory = await db
      .select()
      .from(copilotConversations)
      .where(eq(copilotConversations.userId, userId))
      .orderBy(desc(copilotConversations.createdAt))
      .limit(15);
      
    // Order history ascending
    const sortedHistory = [...dbHistory].reverse();

    // 3. Assemble chat message history for the AI Model
    const messages: ChatMessage[] = [];
    
    // Add system prompt template with dynamic parameters
    messages.push({
      role: "system",
      content: `You are the EyePay AI Copilot, a conversational financial assistant inside the EyePay platform.
You help the user analyze their account, wallet, transactions, recipients, and security flags.

Here is the current, real-time context of the logged-in user:
[USER PROFILE]
- Name: ${user.name}
- Email: ${user.email}

[WALLET]
- Balance: $${parseFloat(wallet.balance).toFixed(2)} ${wallet.currency}

[RECIPIENTS]
${userRecipients.map(r => `- Name: ${r.name}, Email: ${r.email}, Address: ${r.walletAddress}`).join("\n")}

[RECENT TRANSACTIONS]
${allTxs.slice(0, 15).map(t => `- TX${t.id}: type=${t.type}, amount=$${parseFloat(t.amount).toFixed(2)}, status=${t.status}, country=${t.destinationCountry}, riskScore=${t.riskScore}, date=${t.createdAt}`).join("\n")}

[FRAUD ALERTS & RISKS]
- Security Health Score: ${healthScore}/100
- Total Flagged count: ${avgRiskRow?.totalFlagged || 0}
- Pending alerts count: ${pendingAlertsCount}
${alerts.map(a => `- Alert for TX${a.transactionId}: riskScore=${a.riskScore}, status=${a.status}`).join("\n")}

[ANALYTICS SUMMARY]
- Total Volume transacted this month: $${totalVolume.toFixed(2)}
- Top Destination Countries: ${countryDistribution.map(c => `${c.country} ($${c.volume.toFixed(2)})`).join(", ") || "None"}
- Top Recipient Profile: ${topRecipient ? `${topRecipient.name} (sent $${topRecipient.volume.toFixed(2)} across ${topRecipient.count} transfers)` : "None"}

Rules:
1. Answer questions concisely and professionally based ONLY on the context provided above.
2. Bold key metrics, names, and numbers using markdown syntax.
3. If asked about Kenyan transfers, refer to Kenya or code KE in the transacted list.
4. Keep replies friendly and conversational.`,
    });

    // Append sorted conversation logs
    sortedHistory.forEach(h => {
      messages.push({
        role: h.role as "user" | "assistant",
        content: h.message,
      });
    });

    // Append the current user query
    messages.push({
      role: "user",
      content: message,
    });

    // 4. Invoke the AI provider pipeline
    const reply = await generateChatResponse(messages, dbContext);

    // 5. Store both user query and assistant response in copilotConversations
    await db.insert(copilotConversations).values([
      { userId, role: "user", message },
      { userId, role: "assistant", message: reply },
    ]);

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

export default router;
