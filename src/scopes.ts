import type { BattleNetScope } from "./types.js";

/**
 * All valid Battle.net OAuth scopes
 */
export const VALID_SCOPES: readonly BattleNetScope[] = [
  "openid",
  "wow.profile",
  "sc2.profile",
  "d3.profile",
];

/**
 * Default scopes - openid is required for authentication
 */
export const DEFAULT_SCOPES: readonly BattleNetScope[] = ["openid"];

/**
 * Build a space-separated scope string for OAuth requests
 * Always includes openid as it's required for authentication
 */
export function buildScopeString(scopes: BattleNetScope[]): string {
  if (scopes.includes("openid")) {
    return scopes.join(" ");
  }
  return ["openid", ...scopes].join(" ");
}

/**
 * Validate that all provided scopes are valid Battle.net scopes
 * @throws Error if any scope is invalid
 */
export function validateScopes(scopes: readonly string[]): void {
  const invalidScopes = scopes.filter(
    (scope) => !VALID_SCOPES.includes(scope as BattleNetScope)
  );

  if (invalidScopes.length > 0) {
    throw new Error(
      `Invalid Battle.net scopes: ${invalidScopes.join(", ")}. Valid scopes are: ${VALID_SCOPES.join(", ")}`
    );
  }
}
