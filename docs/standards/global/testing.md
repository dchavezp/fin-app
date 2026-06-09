# Testing Strategy (Three-Tier)

```
Unit Tests          Component Tests           E2E Tests
(Vitest)            (RNTL + Vitest)           (Maestro)
```

## A. Unit Tests
- **Scope:** Pure functions, Zod schemas, state logic, utilities
- **Tool:** Vitest (faster than Jest in monorepo, uses ESBuild)

## B. Component & Hook Tests
- **Scope:** Interactive hooks, UI rendering, user interactions
- **Tool:** React Native Testing Library + Vitest
- **Query by accessibility:** Use `getByRole`, `getByLabelText` — not `testID`
  - Keeps UI accessible and tests resilient to markup changes

```ts
screen.getByRole("button", { name: /confirm/i });
```

## C. E2E Tests
- **Scope:** Full user journeys (registration, token refresh, deep links)
- **Tool:** Maestro (YAML-based, runs on native layout hierarchy)

```yaml
appId: com.finnapp.app
---
- clearState
- launchApp
- assertVisible: "Sign In"
- tapOn: "Email"
- inputText: "user@example.com"
```

## Rules
- Unit test all Zod schemas and pure transformation functions
- Component tests prefer accessibility queries over testID
- E2E covers critical paths only (auth flow, core screens)
