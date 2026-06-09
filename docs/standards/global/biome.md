# Biome Configuration

## Lint & Format
- Tab indentation, double quotes
- Organize imports on assist (`organizeImports: "on"`)
- `clsx`/`cva`/`cn` sorted classes (`useSortedClasses`)

## Rules
```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": { "useExhaustiveDependencies": "info" },
      "style": {
        "noParameterAssign": "error",
        "useAsConstAssertion": "error",
        "useDefaultParameterLast": "error",
        "useEnumInitializers": "error",
        "useSelfClosingElements": "error",
        "useSingleVarDeclarator": "error",
        "noUnusedTemplateLiteral": "error",
        "useNumberNamespace": "error",
        "noInferrableTypes": "error",
        "noUselessElse": "error"
      }
    }
  }
}
```

## Running
```sh
pnpm check    # biome check --write .
```

## Key Conventions
- `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
- Biome replaces Prettier + ESLint entirely
