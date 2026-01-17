import type { BattleNetScope } from "./types.js";

/**
 * All valid Battle.net OAuth scopes
 */
export const VALID_SCOPES: readonly BattleNetScope[] = [
  "openid",
  "wow.profile",
  "sc2.profile",
  "d3.profile",
] as const;

/**
 * Default scopes if none specified
 * OpenID is required for authentication
 */
export const DEFAULT_SCOPES: readonly BattleNetScope[] = ["openid"] as const;

/**
 * Build a space-separated scope string for OAuth requests
 *
 * @param scopes - Array of scopes to include
 * @returns Space-separated scope string
 */
export function buildScopeString(scopes: BattleNetScope[]): string {
  // Always include openid as it's required for authentication
  const scopeSet = new Set<BattleNetScope>(["openid", ...scopes]);
  return Array.from(scopeSet).join(" ");
}

/**
 * Validate that all provided scopes are valid Battle.net scopes
 *
 * @param scopes - Array of scopes to validate
 * @returns True if all scopes are valid
 * @throws Error if any scope is invalid
 */
export function validateScopes(scopes: string[]): scopes is BattleNetScope[] {
  const invalidScopes = scopes.filter(
    (scope) => !VALID_SCOPES.includes(scope as BattleNetScope)
  );

  if (invalidScopes.length > 0) {
    throw new Error(
      `Invalid Battle.net scopes: ${invalidScopes.join(", ")}. Valid scopes are: ${VALID_SCOPES.join(", ")}`
    );
  }

  return true;
}

/**
 * Check if a scope is valid
 *
 * @param scope - The scope to check
 * @returns True if the scope is valid
 */
export function isValidScope(scope: string): scope is BattleNetScope {
  return VALID_SCOPES.includes(scope as BattleNetScope);
}
