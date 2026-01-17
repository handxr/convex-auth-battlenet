// Main export
export { BattleNet } from "./provider.js";

// Types
export type {
  BattleNetConfig,
  BattleNetProfile,
  BattleNetRegion,
  BattleNetScope,
  RegionEndpoints,
} from "./types.js";

// Utilities (optional, for advanced use cases)
export { getRegionEndpoints, isValidRegion, DEFAULT_REGION } from "./regions.js";
export {
  buildScopeString,
  validateScopes,
  isValidScope,
  DEFAULT_SCOPES,
  VALID_SCOPES,
} from "./scopes.js";
