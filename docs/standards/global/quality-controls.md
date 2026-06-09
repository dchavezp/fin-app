# Monorepo Quality Controls

## Commit Hooks (Husky + lint-staged)
```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json,jsonc}": ["biome check --write ."]
  }
}
```

Pre-commit hook runs Biome on staged files — non-compliant code is blocked from commit.

## Biome Enforcement
Biome replaces Prettier + ESLint entirely. See `global/biome.md` for full config.

## Type Checking
```sh
pnpm check-types   # turbo check-types (all packages)
```

- `verbatimModuleSyntax` enforced — must use `import type` for type-only imports
- `noUnusedLocals`, `noUnusedParameters` — strict

## Build Pipeline
```sh
pnpm build         # turbo build
```

Package dependency order: `server → auth → db → env` (turbo handles automatically).

## Rules
- Never skip lint-staged or commit hooks
- Fix all Biome errors before committing
- Fix all type errors before merging
