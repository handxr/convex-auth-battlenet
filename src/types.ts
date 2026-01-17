/**
 * Battle.net OAuth issuer URLs
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
export type BattleNetIssuer =
  | "https://oauth.battle.net"
  | "https://oauth.battlenet.com.cn";

/**
 * Battle.net user profile from the userinfo endpoint
 */
export interface BattleNetProfile extends Record<string, unknown> {
  /** Unique user identifier */
  sub: string;
  /** BattleTag (e.g., "Player#1234") - field name varies by response */
  battletag?: string;
  battle_tag?: string;
}

/**
 * Configuration options for the BattleNet provider
 */
export interface BattleNetConfig {
  /**
   * OIDC issuer URL (region-specific)
   * @default "https://oauth.battle.net"
   */
  issuer?: BattleNetIssuer;

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
