import { Router } from "express";
import { db, wallets, transactions, recipients, fraudAlerts } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

function getCountryName(code: string): string {
  const map: Record<string, string> = {
    US: "United States",
    KE: "Kenya",
    GB: "United Kingdom",
    DE: "Germany",
    IN: "India",
    JP: "Japan",
    FR: "France",
    CA: "Canada",
    AU: "Australia",
    KP: "North Korea",
    IR: "Iran",
    SY: "Syria",
    RU: "Russia",
  };
  return map[code.toUpperCase()] || code;
}

router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;

    // 1. Fetch user's wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      res.json({
        healthScore: 100,
        insights: [],
        unusualActivity: [],
        recommendations: [],
      });
      return;
    }

    // 2. Fetch all transaction history for this wallet
    const allTxs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .orderBy(desc(transactions.createdAt));

    // 3. Fetch user's recipients
    const userRecipients = await db
      .select()
      .from(recipients)
      .where(eq(recipients.userId, userId));
    const recipientMap = new Map(userRecipients.map(r => [r.id, r]));

    // 4. Fetch fraud alerts
    const alerts = await db
      .select({
        status: fraudAlerts.status,
        riskScore: fraudAlerts.riskScore,
        transactionId: fraudAlerts.transactionId,
      })
      .from(fraudAlerts)
      .innerJoin(transactions, eq(transactions.id, fraudAlerts.transactionId))
      .where(eq(transactions.walletId, wallet.id));

    if (allTxs.length === 0) {
      res.json({
        healthScore: 100,
        insights: [
          {
            type: "trend",
            title: "No transacted trends",
            description: "Start transacting to compile spending analysis.",
            metric: "N/A",
            impact: "neutral",
          },
        ],
        unusualActivity: [],
        recommendations: [
          {
            title: "Secure Ledger Wallet",
            description: "Always verify recipient wallet addresses before committing transfers.",
            severity: "info",
          },
          {
            title: "Enable 2FA Authentication",
            description: "Go to your account settings to lock up security protocols.",
            severity: "info",
          },
        ],
      });
      return;
    }

    // --- In-Memory Date Segregations ---
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthTxs = allTxs.filter(t => new Date(t.createdAt) >= startOfThisMonth);
    const prevMonthTxs = allTxs.filter(t => {
      const d = new Date(t.createdAt);
      return d >= startOfPrevMonth && d < startOfThisMonth;
    });

    const insights: any[] = [];
    const unusualActivity: any[] = [];
    const recommendations: any[] = [];

    // A. Spending Trends (Send type only)
    const thisMonthSend = thisMonthTxs
      .filter(t => t.type === "send" && t.status !== "failed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const prevMonthSend = prevMonthTxs
      .filter(t => t.type === "send" && t.status !== "failed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (prevMonthSend > 0) {
      const percentChange = ((thisMonthSend - prevMonthSend) / prevMonthSend) * 100;
      const displayPercent = Math.abs(Math.round(percentChange));
      insights.push({
        type: "trend",
        title: "Spending Trend",
        description: `You sent ${displayPercent}% ${percentChange >= 0 ? "more" : "less"} this month.`,
        metric: `${displayPercent}%`,
        impact: percentChange > 25 ? "negative" : percentChange > 0 ? "neutral" : "positive",
      });
    } else if (thisMonthSend > 0) {
      insights.push({
        type: "trend",
        title: "Spending Trend",
        description: `You started sending transfers this month, totaling $${thisMonthSend.toFixed(2)}.`,
        metric: "New",
        impact: "neutral",
      });
    }

    // B. Country Distribution / Transfer Growth
    const sendTxs = allTxs.filter(t => t.type === "send" && t.status !== "failed");
    const countryCounts: Record<string, number> = {};
    const countryVolumes: Record<string, number> = {};
    let totalSendAmount = 0;

    sendTxs.forEach(t => {
      const country = t.destinationCountry || "US";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
      const amt = parseFloat(t.amount);
      countryVolumes[country] = (countryVolumes[country] || 0) + amt;
      totalSendAmount += amt;
    });

    let topCountry = "";
    let maxCountryVolume = 0;
    Object.entries(countryVolumes).forEach(([c, v]) => {
      if (v > maxCountryVolume) {
        maxCountryVolume = v;
        topCountry = c;
      }
    });

    if (topCountry && totalSendAmount > 0) {
      const ratio = (maxCountryVolume / totalSendAmount) * 100;
      insights.push({
        type: "growth",
        title: "Transfer Distribution",
        description: `${getCountryName(topCountry)} receives ${Math.round(ratio)}% of your transfers.`,
        metric: `${Math.round(ratio)}%`,
        impact: topCountry === "KP" || topCountry === "IR" || topCountry === "SY" || topCountry === "RU" ? "negative" : "neutral",
      });
    }

    // C. Recipient Activity
    const recipientCounts: Record<number, number> = {};
    sendTxs.forEach(t => {
      if (t.recipientId) {
        recipientCounts[t.recipientId] = (recipientCounts[t.recipientId] || 0) + 1;
      }
    });

    let topRecipientId = 0;
    let maxRecipientCount = 0;
    Object.entries(recipientCounts).forEach(([rId, count]) => {
      if (count > maxRecipientCount) {
        maxRecipientCount = count;
        topRecipientId = parseInt(rId);
      }
    });

    const topRec = topRecipientId ? recipientMap.get(topRecipientId) : null;
    if (topRec) {
      insights.push({
        type: "recipient",
        title: "Top Recipient",
        description: `Recipient ${topRec.name} received funds ${maxRecipientCount} times.`,
        metric: `${maxRecipientCount}x`,
        impact: "neutral",
      });

      if (maxRecipientCount > 5) {
        recommendations.push({
          title: "Audit High-Frequency Recipient",
          description: `Review recipient ${topRec.name} as you transacted ${maxRecipientCount} times with them recently.`,
          severity: "info",
        });
      }
    }

    // D. Average Risk Score Trend
    const thisMonthRiskTxs = thisMonthTxs.filter(t => t.type === "send");
    const prevMonthRiskTxs = prevMonthTxs.filter(t => t.type === "send");

    const avgRiskThis = thisMonthRiskTxs.length > 0 
      ? thisMonthRiskTxs.reduce((sum, t) => sum + t.riskScore, 0) / thisMonthRiskTxs.length
      : 0;

    const avgRiskPrev = prevMonthRiskTxs.length > 0
      ? prevMonthRiskTxs.reduce((sum, t) => sum + t.riskScore, 0) / prevMonthRiskTxs.length
      : 0;

    if (avgRiskPrev > 0) {
      const riskChange = ((avgRiskThis - avgRiskPrev) / avgRiskPrev) * 100;
      if (Math.abs(riskChange) > 1) {
        const displayRiskChange = Math.abs(Math.round(riskChange));
        insights.push({
          type: "risk",
          title: "Compliance Risk Trend",
          description: `Your average risk score ${riskChange >= 0 ? "increased" : "decreased"} ${displayRiskChange}%.`,
          metric: `${riskChange >= 0 ? "+" : "-"}${displayRiskChange}%`,
          impact: riskChange > 10 ? "negative" : riskChange < -10 ? "positive" : "neutral",
        });
      }
    } else {
      insights.push({
        type: "risk",
        title: "Compliance Risk Trend",
        description: `Your average transaction risk score is ${Math.round(avgRiskThis)}% this month.`,
        metric: `${Math.round(avgRiskThis)}%`,
        impact: avgRiskThis >= 50 ? "warning" : "positive",
      });
    }

    // E. Unusual Activity (Transactions with risk >= 70 or amounts > 2.5x standard average)
    const allSendAmounts = sendTxs.map(t => parseFloat(t.amount));
    const avgSendAmount = allSendAmounts.length > 0 
      ? allSendAmounts.reduce((sum, val) => sum + val, 0) / allSendAmounts.length 
      : 0;

    sendTxs.forEach(t => {
      const r = recipientMap.get(t.recipientId || 0);
      const recipientName = r ? r.name : "Unknown Recipient";
      
      if (t.riskScore >= 70) {
        unusualActivity.push({
          id: t.id,
          amount: parseFloat(t.amount),
          recipient: recipientName,
          riskScore: t.riskScore,
          reason: `High risk score of ${t.riskScore} flagged by AI Compliance Engine.`,
          date: t.createdAt,
        });
      } else if (parseFloat(t.amount) > avgSendAmount * 2.5 && avgSendAmount > 50) {
        unusualActivity.push({
          id: t.id,
          amount: parseFloat(t.amount),
          recipient: recipientName,
          riskScore: t.riskScore,
          reason: `Volume anomaly: Transfer of $${parseFloat(t.amount).toLocaleString()} is 2.5x larger than user average.`,
          date: t.createdAt,
        });
      }
    });

    // F. Recommendations List Assembly
    // Add default security recommendation
    recommendations.push({
      title: "Enable 2-Factor Authentication",
      description: "Secure your wallet transactions by activating multi-factor verification keys.",
      severity: "info",
    });

    // High risk checks
    const hasHighRiskTxs = allTxs.some(t => t.riskScore >= 70);
    if (hasHighRiskTxs) {
      recommendations.push({
        title: "Review Suspicious Transfers",
        description: "Multiple transactions triggered elevated compliance flags. Inspect recipients.",
        severity: "critical",
      });
    }

    // Active pending review alerts
    const pendingAlerts = alerts.filter(a => a.status === "pending");
    if (pendingAlerts.length > 0) {
      recommendations.push({
        title: "Audit Locked Escrow Pending Alerts",
        description: `You have ${pendingAlerts.length} transactions locked by AI Fraud detection pending clearance.`,
        severity: "warning",
      });
    }

    // Destination country risks
    const hasSanctionedCountry = Object.keys(countryCounts).some(c => 
      c === "KP" || c === "IR" || c === "SY" || c === "RU"
    );
    if (hasSanctionedCountry) {
      recommendations.push({
        title: "Enhanced Due Diligence Required",
        description: "Transfers detected to high-risk international locations. Ensure strict KYC compliance.",
        severity: "critical",
      });
    }

    // Calculate AI Security & Health Score (Base 100)
    let score = 100;
    // Deduct average risk score factor
    score -= avgRiskThis * 0.4;
    // Deduct high risk transactions penalty
    if (hasHighRiskTxs) score -= 15;
    // Deduct pending alerts penalty
    if (pendingAlerts.length > 0) score -= 20;
    // Deduct sanctioned country penalty
    if (hasSanctionedCountry) score -= 15;
    // Clamp score
    score = Math.max(12, Math.min(100, Math.round(score)));

    res.json({
      healthScore: score,
      insights,
      unusualActivity,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
