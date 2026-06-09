# Environment Variable Validation

Use `@t3-oss/env-core` with Zod schemas for type-safe env vars.

## Split Exports
- `@finn-app/env/server` — Server-only vars (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
- `@finn-app/env/native` — Public client vars (EXPO_PUBLIC_SERVER_URL)
- Prevents server secrets from leaking into the mobile bundle

## Configuration
- `emptyStringAsUndefined: true` — Empty strings trigger min-length validation
- Zod schemas use `.min(1)` for required fields
- Server module loads `.env` via `import "dotenv/config"`
- Native does not load dotenv (handled by Expo)
