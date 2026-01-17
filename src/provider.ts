import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";
import type { BattleNetConfig, BattleNetProfile } from "./types.js";

const OAUTH_BASE = "https://oauth.battle.net";

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
  const { issuer, clientId, clientSecret, ...rest } = config ?? {};
  const base = issuer ?? OAUTH_BASE;
  const id = clientId ?? process.env.AUTH_BATTLENET_ID;
  const secret = clientSecret ?? process.env.AUTH_BATTLENET_SECRET;

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
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
        const res = await fetch(`${base}/userinfo`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Userinfo request failed: ${res.status}`);
        }
        return res.json();
      },
    },
    checks: ["state"],
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    clientId: id,
    clientSecret: secret,
    profile(profile: BattleNetProfile) {
      return {
        id: profile.sub,
        name: profile.battletag ?? profile.battle_tag,
      };
    },
    style: {
      bg: "#148eff",
      text: "#fff",
    },
    ...rest,
  } as OAuthConfig<BattleNetProfile>;
}
