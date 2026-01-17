import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import type { BattleNetConfig, BattleNetProfile } from "./types.js";
import { getIssuer, DEFAULT_REGION } from "./regions.js";
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
 *   providers: [BattleNet({ region: "eu" })],
 * });
 * ```
 *
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
export function BattleNet(
  config?: BattleNetConfig & Partial<OAuthUserConfig<BattleNetProfile>>
): OAuthConfig<BattleNetProfile> {
  const region = config?.region ?? DEFAULT_REGION;
  const issuer = getIssuer(region);
  const scopes = config?.scopes ?? [...DEFAULT_SCOPES];

  if (config?.scopes) {
    validateScopes(config.scopes);
  }

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oidc",
    issuer,
    authorization: {
      url: `${issuer}/authorize`,
      params: { scope: buildScopeString(scopes) },
    },
    token: `${issuer}/token`,
    userinfo: `${issuer}/userinfo`,
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
