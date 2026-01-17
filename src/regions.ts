import type { BattleNetRegion, RegionEndpoints } from "./types.js";

/**
 * OAuth endpoint configurations for each Battle.net region
 *
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
const REGION_ENDPOINTS: Record<BattleNetRegion, RegionEndpoints> = {
  us: {
    authorization: "https://oauth.battle.net/authorize",
    token: "https://oauth.battle.net/token",
    userinfo: "https://oauth.battle.net/userinfo",
    issuer: "https://oauth.battle.net",
  },
  eu: {
    authorization: "https://oauth.battle.net/authorize",
    token: "https://oauth.battle.net/token",
    userinfo: "https://oauth.battle.net/userinfo",
    issuer: "https://oauth.battle.net",
  },
  apac: {
    authorization: "https://oauth.battle.net/authorize",
    token: "https://oauth.battle.net/token",
    userinfo: "https://oauth.battle.net/userinfo",
    issuer: "https://oauth.battle.net",
  },
};

/**
 * Get OAuth endpoints for a specific Battle.net region
 *
 * @param region - The Battle.net region
 * @returns The OAuth endpoints for that region
 */
export function getRegionEndpoints(region: BattleNetRegion): RegionEndpoints {
  return REGION_ENDPOINTS[region];
}

/**
 * Check if a string is a valid Battle.net region
 *
 * @param region - The string to check
 * @returns True if the string is a valid region
 */
export function isValidRegion(region: string): region is BattleNetRegion {
  return region === "us" || region === "eu" || region === "apac";
}

/**
 * Default region if none specified
 */
export const DEFAULT_REGION: BattleNetRegion = "us";
