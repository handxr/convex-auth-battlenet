/**
 * Battle.net OAuth issuer URLs
 * - Global: https://oauth.battle.net
 * - China: https://oauth.battlenet.com.cn
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
  /** BattleTag (e.g., "Player#1234") */
  battletag?: string;
  /** Alternative BattleTag field name */
  battle_tag?: string;
}

/**
 * Configuration options for the BattleNet provider
 */
export interface BattleNetConfig {
  /**
   * OAuth issuer URL
   * @default "https://oauth.battle.net"
   */
  issuer?: BattleNetIssuer;
  /**
   * OAuth client ID (falls back to AUTH_BATTLENET_ID env var)
   */
  clientId?: string;
  /**
   * OAuth client secret (falls back to AUTH_BATTLENET_SECRET env var)
   */
  clientSecret?: string;
}
