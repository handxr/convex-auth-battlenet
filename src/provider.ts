import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import type { BattleNetConfig, BattleNetProfile } from "./types.js";

const OAUTH_BASE = "https://oauth.battle.net";

/**
 * Battle.net OAuth provider for Convex Auth
 *
 * Works out-of-the-box with Convex Auth's default schema. Since Battle.net
 * doesn't provide email addresses, a synthetic email is generated using
 * the user's unique ID (e.g., "12345@battlenet.oauth").
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
  const { issuer, clientId, clientSecret, ...rest } = config ?? {};
  const base = issuer ?? OAUTH_BASE;

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
    clientId: clientId ?? process.env.AUTH_BATTLENET_ID,
    clientSecret: clientSecret ?? process.env.AUTH_BATTLENET_SECRET,
    authorization: {
      url: `${base}/authorize`,
      params: { scope: "openid" },
    },
    token: {
      url: `${base}/token`,
      async conform(response: Response) {
        // Strip id_token to avoid nonce validation issues with oauth4webapi
        const data = await response.json();
        delete data.id_token;
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
    userinfo: {
      url: `${base}/userinfo`,
      async request({ tokens }: { tokens: { access_token?: string } }) {
        const response = await fetch(`${base}/userinfo`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Userinfo request failed: ${response.status}`);
        }
        return response.json();
      },
    },
    checks: ["state"],
    client: { token_endpoint_auth_method: "client_secret_post" },
    profile(profile: BattleNetProfile) {
      return {
        id: profile.sub,
        name: profile.battletag ?? profile.battle_tag,
        // Synthetic email for Convex Auth compatibility (Battle.net doesn't provide emails)
        email: `${profile.sub}@battlenet.oauth`,
      };
    },
    style: { bg: "#148eff", text: "#fff" },
    ...rest,
  } as OAuthConfig<BattleNetProfile>;
}
