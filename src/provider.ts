import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import type { BattleNetConfig, BattleNetProfile } from "./types.js";
import { getRegionEndpoints, DEFAULT_REGION } from "./regions.js";
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
 *   providers: [BattleNet({ region: "us" })],
 * });
 * ```
 *
 * @param config - Optional configuration options
 * @returns OAuth provider configuration
 *
 * @see https://develop.battle.net/documentation/guides/using-oauth
 */
export function BattleNet(
  config?: BattleNetConfig & Partial<OAuthUserConfig<BattleNetProfile>>
): OAuthConfig<BattleNetProfile> {
  const region = config?.region ?? DEFAULT_REGION;
  const endpoints = getRegionEndpoints(region);

  // Validate and build scopes
  const scopes = config?.scopes ?? [...DEFAULT_SCOPES];
  if (config?.scopes) {
    validateScopes(config.scopes);
  }
  const scopeString = buildScopeString(scopes);

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oidc",

    // OIDC configuration
    issuer: endpoints.issuer,

    // OAuth endpoints
    authorization: {
      url: endpoints.authorization,
      params: {
        scope: scopeString,
      },
    },
    token: endpoints.token,
    userinfo: endpoints.userinfo,

    // Security: enable PKCE and state checks
    checks: ["pkce", "state"],

    // Client credentials from config or environment variables
    clientId: config?.clientId ?? process.env.AUTH_BATTLENET_ID,
    clientSecret: config?.clientSecret ?? process.env.AUTH_BATTLENET_SECRET,

    // Profile mapping
    profile(profile: BattleNetProfile) {
      return {
        id: profile.sub,
        name: profile.battletag,
        // Battle.net doesn't provide email or image by default
        email: null,
        image: null,
      };
    },

    // Style for UI components (optional)
    style: {
      bg: "#148eff",
      text: "#fff",
      logo: "https://cdn.worldvectorlogo.com/logos/battlenet.svg",
    },

    // Allow additional options to be passed through
    ...config,
  };
}
