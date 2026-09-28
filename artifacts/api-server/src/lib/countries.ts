export const COUNTRY_NAMES: Record<string, string> = {
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

/**
 * Resolves an ISO country code to its display name, falling back to the
 * code itself when unknown.
 */
export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code.toUpperCase()] || code;
}

/**
 * Countries treated as high-risk destinations for compliance/health-score
 * purposes and for per-transaction fraud scoring (fraudService). Single
 * source of truth for both.
 */
export const HIGH_RISK_COUNTRIES = ["KP", "IR", "SY", "RU"];

export function isHighRiskCountry(code: string): boolean {
  return HIGH_RISK_COUNTRIES.includes(code.toUpperCase());
}
