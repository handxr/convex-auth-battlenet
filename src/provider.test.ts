import { describe, expect, test } from "bun:test";
import { BattleNet } from "./provider";
import type { BattleNetProfile } from "./types";

type ProfileResult = { id: string; name?: string; email: string };

describe("BattleNet provider", () => {
  describe("default configuration", () => {
    test("returns correct provider id and name", () => {
      const provider = BattleNet();

      expect(provider.id).toBe("battlenet");
      expect(provider.name).toBe("Battle.net");
      expect(provider.type).toBe("oauth");
    });

    test("uses global OAuth URL by default", () => {
      const provider = BattleNet();

      expect(provider.authorization).toEqual({
        url: "https://oauth.battle.net/authorize",
        params: { scope: "openid" },
      });
      expect(provider.userinfo?.url).toBe("https://oauth.battle.net/userinfo");
    });

    test("includes state and pkce checks", () => {
      const provider = BattleNet();

      expect(provider.checks).toContain("state");
      expect(provider.checks).toContain("pkce");
    });

    test("uses client_secret_post auth method", () => {
      const provider = BattleNet();

      expect(provider.client?.token_endpoint_auth_method).toBe(
        "client_secret_post"
      );
    });

    test("has correct style", () => {
      const provider = BattleNet();

      expect(provider.style).toEqual({ bg: "#148eff", text: "#fff" });
    });
  });

  describe("custom configuration", () => {
    test("accepts custom issuer for China region", () => {
      const provider = BattleNet({
        issuer: "https://oauth.battlenet.com.cn",
      });

      expect(provider.authorization).toEqual({
        url: "https://oauth.battlenet.com.cn/authorize",
        params: { scope: "openid" },
      });
      expect(provider.userinfo?.url).toBe(
        "https://oauth.battlenet.com.cn/userinfo"
      );
    });

    test("accepts custom clientId and clientSecret", () => {
      const provider = BattleNet({
        clientId: "custom-id",
        clientSecret: "custom-secret",
      });

      expect(provider.clientId).toBe("custom-id");
      expect(provider.clientSecret).toBe("custom-secret");
    });

    test("allows extending with additional OAuth config", () => {
      const provider = BattleNet({
        allowDangerousEmailAccountLinking: true,
      });

      expect((provider as any).allowDangerousEmailAccountLinking).toBe(true);
    });
  });

  describe("profile mapping", () => {
    test("maps profile with battletag", () => {
      const provider = BattleNet();
      const profile: BattleNetProfile = {
        sub: "12345",
        battletag: "Player#1234",
      };

      const profileFn = provider.profile as (
        profile: BattleNetProfile,
        tokens: unknown
      ) => ProfileResult;
      const result = profileFn(profile, {});

      expect(result.id).toBe("12345");
      expect(result.name).toBe("Player#1234");
      expect(result.email).toBe("12345@battlenet.oauth");
    });

    test("maps profile with battle_tag (alternative field)", () => {
      const provider = BattleNet();
      const profile: BattleNetProfile = {
        sub: "67890",
        battle_tag: "Warrior#5678",
      };

      const profileFn = provider.profile as (
        profile: BattleNetProfile,
        tokens: unknown
      ) => ProfileResult;
      const result = profileFn(profile, {});

      expect(result.id).toBe("67890");
      expect(result.name).toBe("Warrior#5678");
      expect(result.email).toBe("67890@battlenet.oauth");
    });

    test("prefers battletag over battle_tag", () => {
      const provider = BattleNet();
      const profile: BattleNetProfile = {
        sub: "11111",
        battletag: "Primary#1111",
        battle_tag: "Secondary#2222",
      };

      const profileFn = provider.profile as (
        profile: BattleNetProfile,
        tokens: unknown
      ) => ProfileResult;
      const result = profileFn(profile, {});

      expect(result.name).toBe("Primary#1111");
    });

    test("handles profile without battletag", () => {
      const provider = BattleNet();
      const profile: BattleNetProfile = {
        sub: "99999",
      };

      const profileFn = provider.profile as (
        profile: BattleNetProfile,
        tokens: unknown
      ) => ProfileResult;
      const result = profileFn(profile, {});

      expect(result.id).toBe("99999");
      expect(result.name).toBeUndefined();
      expect(result.email).toBe("99999@battlenet.oauth");
    });
  });

  describe("token conform function", () => {
    test("strips id_token from response", async () => {
      const provider = BattleNet();
      const tokenConfig = provider.token as {
        url: string;
        conform: (response: Response) => Promise<Response>;
      };

      const mockResponse = new Response(
        JSON.stringify({
          access_token: "test-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          id_token: "should-be-removed",
        }),
        { status: 200 }
      );

      const result = await tokenConfig.conform(mockResponse);
      const data = await result.json();

      expect(data.access_token).toBe("test-access-token");
      expect(data.token_type).toBe("Bearer");
      expect(data.expires_in).toBe(3600);
      expect(data.id_token).toBeUndefined();
    });

    test("preserves response status", async () => {
      const provider = BattleNet();
      const tokenConfig = provider.token as {
        url: string;
        conform: (response: Response) => Promise<Response>;
      };

      const mockResponse = new Response(
        JSON.stringify({ access_token: "test" }),
        { status: 201 }
      );

      const result = await tokenConfig.conform(mockResponse);

      expect(result.status).toBe(201);
    });
  });

  describe("userinfo request", () => {
    test("throws error on failed userinfo request", async () => {
      const provider = BattleNet();
      const userinfoConfig = provider.userinfo as {
        url: string;
        request: (opts: {
          tokens: { access_token?: string };
        }) => Promise<unknown>;
      };

      // Mock fetch to return error
      const originalFetch = globalThis.fetch;
      (globalThis as any).fetch = async () =>
        new Response("Unauthorized", { status: 401 });

      try {
        await expect(
          userinfoConfig.request({ tokens: { access_token: "invalid" } })
        ).rejects.toThrow("Userinfo request failed: 401");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
