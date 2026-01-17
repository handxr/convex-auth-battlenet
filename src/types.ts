/**
 * Battle.net supported regions
 * Note: China (cn) region is not supported due to different API requirements
 */
export type BattleNetRegion = "us" | "eu" | "apac";

/**
 * Battle.net OAuth scopes
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
export type BattleNetScope =
  | "openid"
  | "wow.profile"
  | "sc2.profile"
  | "d3.profile";

/**
 * Battle.net user profile returned from the userinfo endpoint
 */
export interface BattleNetProfile {
  /** Unique identifier for the user */
  sub: string;
  /** Battle.net ID (numeric) */
  id: number;
  /** BattleTag (e.g., "Player#1234") */
  battletag: string;
}

/**
 * Configuration options for the BattleNet provider
 */
export interface BattleNetConfig {
  /**
   * Battle.net region
   * @default "us"
   */
  region?: BattleNetRegion;

  /**
   * OAuth scopes to request
   * @default ["openid"]
   */
  scopes?: BattleNetScope[];

  /**
   * OAuth client ID
   * If not provided, reads from AUTH_BATTLENET_ID environment variable
   */
  clientId?: string;

  /**
   * OAuth client secret
   * If not provided, reads from AUTH_BATTLENET_SECRET environment variable
   */
  clientSecret?: string;
}

/**
 * OAuth endpoints for a Battle.net region
 */
export interface RegionEndpoints {
  /** Authorization endpoint URL */
  authorization: string;
  /** Token endpoint URL */
  token: string;
  /** Userinfo endpoint URL */
  userinfo: string;
  /** Issuer URL for OIDC */
  issuer: string;
}
