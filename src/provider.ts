import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import type { BattleNetConfig, BattleNetProfile } from "./types.js";
import { OAUTH_BASE_URL } from "./regions.js";
import { buildScopeString, DEFAULT_SCOPES, validateScopes } from "./scopes.js";

/**
 * Battle.net OAuth provider for Convex Auth
 *
 * @example
 * ```ts
 * import { convexAuth } from "@convex-dev/auth/server";
 * import { BattleNet } from "convex-auth-battlenet";
 *
 * export const { auth, signIn, signOut, store } = convexAuth({
 *   providers: [BattleNet()],
 * });
 * ```
 *
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
export function BattleNet(
  config?: BattleNetConfig & Partial<OAuthUserConfig<BattleNetProfile>>
): OAuthConfig<BattleNetProfile> {
  const scopes = config?.scopes ?? [...DEFAULT_SCOPES];
  if (config?.scopes) {
    validateScopes(config.scopes);
  }

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oidc",
    issuer: OAUTH_BASE_URL,
    authorization: {
      url: `${OAUTH_BASE_URL}/authorize`,
      params: { scope: buildScopeString(scopes) },
    },
    token: `${OAUTH_BASE_URL}/token`,
    userinfo: `${OAUTH_BASE_URL}/userinfo`,
    checks: ["pkce", "state"],
    clientId: config?.clientId ?? process.env.AUTH_BATTLENET_ID,
    clientSecret: config?.clientSecret ?? process.env.AUTH_BATTLENET_SECRET,
    profile(profile: BattleNetProfile) {
      return {
        id: profile.sub,
        name: profile.battletag,
        email: null,
        image: null,
      };
    },
    style: {
      bg: "#148eff",
      text: "#fff",
      logo: "https://cdn.worldvectorlogo.com/logos/battlenet.svg",
    },
    ...config,
  };
}
