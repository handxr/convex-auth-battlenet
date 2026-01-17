import type { BattleNetRegion } from "./types.js";

/**
 * OAuth issuer URLs by region
 * @see https://authjs.dev/reference/core/providers/battlenet
 */
const REGION_ISSUERS: Record<BattleNetRegion, string> = {
  us: "https://us.battle.net/oauth",
  eu: "https://eu.battle.net/oauth",
  apac: "https://apac.battle.net/oauth",
};

/**
 * Get the OAuth issuer URL for a region
 */
export function getIssuer(region: BattleNetRegion): string {
  return REGION_ISSUERS[region];
}

export const DEFAULT_REGION: BattleNetRegion = "us";
