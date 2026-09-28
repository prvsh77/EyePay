export interface HealthScoreInput {
  /** Average AI risk score (0-100) across the relevant transactions. */
  avgRiskScore: number;
  /** Whether any relevant transaction has a risk score >= 70. */
  hasHighRiskTransactions: boolean;
  /** Count of fraud alerts still awaiting review. */
  pendingAlertsCount: number;
  /** Whether any relevant transaction targeted a high-risk country. */
  hasHighRiskCountryActivity: boolean;
}

/**
 * AI Security & Health Score: starts at 100 and is docked for risk signals,
 * clamped to [12, 100].
 */
export function computeHealthScore({
  avgRiskScore,
  hasHighRiskTransactions,
  pendingAlertsCount,
  hasHighRiskCountryActivity,
}: HealthScoreInput): number {
  let score = 100;
  // Deduct average risk score factor
  score -= avgRiskScore * 0.4;
  // Deduct high risk transactions penalty
  if (hasHighRiskTransactions) score -= 15;
  // Deduct pending alerts penalty
  if (pendingAlertsCount > 0) score -= 20;
  // Deduct high-risk country penalty
  if (hasHighRiskCountryActivity) score -= 15;
  // Clamp score
  return Math.max(12, Math.min(100, Math.round(score)));
}
