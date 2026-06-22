import { db, transactions, recipients, fraudAlerts } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";

const HIGH_RISK_COUNTRIES = ["KP", "IR", "SY", "RU"];

export interface FraudAnalysisResult {
  riskScore: number;
  reasons: string[];
  isFlagged: boolean;
}

/**
 * Analyzes a transaction for fraud risk score (0-100)
 */
export async function analyzeTransaction(params: {
  walletId: number;
  amount: number;
  recipientId: number;
  destinationCountry: string;
}): Promise<FraudAnalysisResult> {
  const { walletId, amount, recipientId, destinationCountry } = params;
  let score = 0;
  const reasons: string[] = [];

  // 1. Amount Risk Check
  if (amount > 5000) {
    score += 50;
    reasons.push(`High transfer amount ($${amount.toFixed(2)}) exceeds limit for quick processing`);
  } else if (amount > 1000) {
    score += 25;
    reasons.push(`Medium-high transfer amount ($${amount.toFixed(2)})`);
  }

  // 2. Frequency Check (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [freqRes] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, walletId),
        gte(transactions.createdAt, oneDayAgo)
      )
    );
  
  const txCount = freqRes ? Number(freqRes.count) : 0;
  if (txCount > 7) {
    score += 35;
    reasons.push(`High transaction frequency (${txCount} transactions in the last 24h)`);
  } else if (txCount > 3) {
    score += 15;
    reasons.push(`Elevated transaction frequency (${txCount} transactions in the last 24h)`);
  }

  // 3. Recipient Age Check
  const [recipient] = await db
    .select()
    .from(recipients)
    .where(eq(recipients.id, recipientId))
    .limit(1);

  if (recipient) {
    const ageMs = Date.now() - new Date(recipient.createdAt).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    
    if (ageHours < 1) {
      score += 30;
      reasons.push("Recipient account registered less than 1 hour ago");
    } else if (ageHours < 24) {
      score += 10;
      reasons.push("Recipient account registered less than 24 hours ago");
    }
  } else {
    // If recipient is missing (unlikely since we validate it), default to some risk
    score += 10;
    reasons.push("Unknown or newly initialized recipient data");
  }

  // 4. Country Risk Check
  const upperCountry = (destinationCountry || "US").toUpperCase();
  if (HIGH_RISK_COUNTRIES.includes(upperCountry)) {
    score += 40;
    reasons.push(`High-risk destination country (${upperCountry})`);
  }

  // Cap final score
  const finalScore = Math.min(100, Math.max(0, score));
  const isFlagged = finalScore >= 70;

  return {
    riskScore: finalScore,
    reasons,
    isFlagged,
  };
}
