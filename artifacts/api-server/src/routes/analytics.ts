import { Router } from "express";
import { db, wallets, transactions, recipients, fraudAlerts } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;

    // 1. Get user's wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      res.json({
        totalVolume: 0,
        volumeByType: [],
        monthlyTrends: [],
        countryDistribution: [],
        fraudStats: {
          totalFlagged: 0,
          avgRiskScore: 0,
          pendingAlertsCount: 0,
          statusCounts: [],
        },
        topRecipients: [],
      });
      return;
    }

    const walletId = wallet.id;

    // 2. Aggregate volume by type
    const volumeByTypeRaw = await db
      .select({
        type: transactions.type,
        totalAmount: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .where(eq(transactions.walletId, walletId))
      .groupBy(transactions.type);

    const volumeByType = volumeByTypeRaw.map(v => ({
      type: v.type,
      totalAmount: parseFloat(v.totalAmount),
      count: v.count,
    }));

    // Calculate overall total volume
    const totalVolume = volumeByType.reduce((sum, item) => sum + item.totalAmount, 0);

    // 3. Aggregate Monthly trends
    const monthlyTrendsRaw = await db
      .select({
        month: sql<string>`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`,
        volume: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .where(eq(transactions.walletId, walletId))
      .groupBy(sql`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${transactions.createdAt}, 'YYYY-MM')`);

    const monthlyTrends = monthlyTrendsRaw.map(m => ({
      month: m.month,
      volume: parseFloat(m.volume),
      count: m.count,
    }));

    // 4. Aggregate Country Distribution (outward transactions where type = 'send')
    const countryDistributionRaw = await db
      .select({
        country: transactions.destinationCountry,
        volume: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .where(and(eq(transactions.walletId, walletId), eq(transactions.type, "send")))
      .groupBy(transactions.destinationCountry)
      .orderBy(desc(sql`SUM(${transactions.amount})`));

    const countryDistribution = countryDistributionRaw.map(c => ({
      country: c.country,
      volume: parseFloat(c.volume),
      count: c.count,
    }));

    // 5. Fraud Statistics
    const [avgRiskRow] = await db
      .select({
        avgScore: sql<number>`COALESCE(AVG(${transactions.riskScore}), 0)`,
        totalFlagged: sql<number>`CAST(COUNT(CASE WHEN ${transactions.riskScore} >= 70 THEN 1 END) AS INTEGER)`,
      })
      .from(transactions)
      .where(eq(transactions.walletId, walletId));

    const alertStatusCountsRaw = await db
      .select({
        status: fraudAlerts.status,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(fraudAlerts)
      .innerJoin(transactions, eq(transactions.id, fraudAlerts.transactionId))
      .where(eq(transactions.walletId, walletId))
      .groupBy(fraudAlerts.status);

    const statusCounts = alertStatusCountsRaw.map(s => ({
      status: s.status,
      count: s.count,
    }));

    const pendingAlertsCount = statusCounts.find(s => s.status === "pending")?.count || 0;

    const fraudStats = {
      totalFlagged: avgRiskRow?.totalFlagged || 0,
      avgRiskScore: Math.round(Number(avgRiskRow?.avgScore || 0) * 10) / 10,
      pendingAlertsCount,
      statusCounts,
    };

    // 6. Top Recipients
    const topRecipientsRaw = await db
      .select({
        recipientId: transactions.recipientId,
        name: recipients.name,
        email: recipients.email,
        volume: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(transactions)
      .innerJoin(recipients, eq(transactions.recipientId, recipients.id))
      .where(eq(transactions.walletId, walletId))
      .groupBy(transactions.recipientId, recipients.name, recipients.email)
      .orderBy(desc(sql`SUM(${transactions.amount})`))
      .limit(5);

    const topRecipients = topRecipientsRaw.map(tr => ({
      recipientId: tr.recipientId,
      name: tr.name,
      email: tr.email,
      volume: parseFloat(tr.volume),
      count: tr.count,
    }));

    res.json({
      totalVolume,
      volumeByType,
      monthlyTrends,
      countryDistribution,
      fraudStats,
      topRecipients,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
