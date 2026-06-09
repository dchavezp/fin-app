# Sign-In Scroll Keyboard Fix — Plan

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-09-1118-sign-in-scroll-keyboard-fix/` with:

- `plan.md` containing this execution plan.
- `shape.md` capturing scope, decisions, visuals, product alignment, and references.
- `standards.md` including `native/ui-constraints`, `native/theme-tokens`, `native/expo-router`, and `global/quality-controls`.
- `references.md` documenting `apps/native/components/auth-flow.tsx`, `apps/native/app/auth.tsx`, and older/simple auth form components studied.
- No `visuals/` content unless visuals are later provided.

## Task 2: Fix Keyboard-Aware Auth Layout

Update `apps/native/components/auth-flow.tsx` to make the auth screen keyboard-aware:

- Wrap or restructure the auth screen with React Native keyboard avoidance primitives, likely `KeyboardAvoidingView` plus the existing `ScrollView`.
- Use platform-aware behavior so iOS and Android both keep the focused input visible.
- Keep `keyboardShouldPersistTaps="handled"` so taps on submit and mode-switch controls continue to work while the keyboard is open.
- Add bottom spacing/content inset behavior so password entry and submit controls are not covered by the keyboard.

## Task 3: Reduce Awkward Scroll Feel

Refine the current centered scroll layout:

- Revisit `scrollContent` using `flexGrow: 1` and `justifyContent: "center"`, which likely causes the odd scroll/centering behavior.
- Keep the screen visually stable when the keyboard is closed, but allow natural top-to-bottom scrolling when the keyboard opens or on smaller screens.
- Preserve the existing FinData Pro visual language and `FIN_DATA_THEME` tokens.

## Task 4: Preserve Auth Behavior

Confirm the UI change does not alter auth behavior:

- Sign-in email/password submission still calls `authClient.signIn.email`.
- Sign-up still works through the shared `AuthFlow` mode switch.
- Google sign-in button still submits and displays loading state.
- Validation and API errors still clear when typing.
- Successful auth still routes with `router.replace("/(drawer)")`.

## Task 5: Verify

Run feasible checks after implementation:

- `pnpm --filter native check-types` or the repo's equivalent filtered Turbo command.
- `pnpm check-types` if the targeted check is insufficient or unavailable.
- `pnpm check` if formatting/linting needs verification, noting that it writes formatting changes by design.
- Manual behavior checklist for keyboard visibility on sign-in email/password and sign-up name/email/password fields, since no test framework is installed.

## Key Decisions

- Scope is an MVP auth usability fix.
- No visuals were provided.
- No external reference implementation was provided; repo references are the current auth files.
- Standards to include: native UI constraints, theme tokens, Expo Router hierarchy, and quality controls.
- Likely implementation target is `apps/native/components/auth-flow.tsx`, not the older/simple `SignIn` component, because `app/auth.tsx` renders `AuthFlow`.
