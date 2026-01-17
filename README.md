# convex-auth-battlenet

Battle.net OAuth provider for [Convex Auth](https://labs.convex.dev/auth).

## Installation

```bash
npm install convex-auth-battlenet
# or
bun add convex-auth-battlenet
```

## Setup

### 1. Create a Battle.net Application

1. Go to the [Battle.net Developer Portal](https://develop.battle.net/)
2. Create a new application
3. Set the redirect URI to `https://your-convex-site.convex.site/api/auth/callback/battlenet`
4. Copy the Client ID and Client Secret

### 2. Configure Environment Variables

Add to your Convex environment (via dashboard or CLI):

```bash
AUTH_BATTLENET_ID=your_client_id
AUTH_BATTLENET_SECRET=your_client_secret
```

### 3. Add to Convex Auth

```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
import { BattleNet } from "convex-auth-battlenet";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [BattleNet()],
});
```

## Configuration Options

```typescript
BattleNet({
  // Battle.net region: "us" | "eu" | "apac"
  // Default: "us"
  region: "eu",

  // OAuth scopes to request
  // Default: ["openid"]
  scopes: ["openid", "wow.profile"],

  // Override client credentials (optional, reads from env vars by default)
  clientId: "your_client_id",
  clientSecret: "your_client_secret",
});
```

## Available Scopes

| Scope | Description |
|-------|-------------|
| `openid` | Required. Basic profile info (BattleTag) |
| `wow.profile` | World of Warcraft profile data |
| `sc2.profile` | StarCraft II profile data |
| `d3.profile` | Diablo III profile data |

## Regions

| Region | Code |
|--------|------|
| United States | `us` |
| Europe | `eu` |
| Asia Pacific | `apac` |

> **Note:** China region is not supported due to different API requirements.

## Frontend Usage

```tsx
import { useAuthActions } from "@convex-dev/auth/react";

function LoginButton() {
  const { signIn } = useAuthActions();

  return (
    <button onClick={() => signIn("battlenet")}>
      Sign in with Battle.net
    </button>
  );
}
```

## User Profile

The provider maps the Battle.net profile to:

| Field | Source |
|-------|--------|
| `id` | `sub` (unique identifier) |
| `name` | `battletag` (e.g., "Player#1234") |

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  BattleNetConfig,
  BattleNetProfile,
  BattleNetRegion,
  BattleNetScope,
} from "convex-auth-battlenet";
```

## License

MIT
