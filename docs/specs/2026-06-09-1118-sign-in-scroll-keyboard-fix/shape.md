# Sign-In Scroll Keyboard Fix — Shaping Notes

## Scope

Fix a UI bug in the sign-in experience where the auth screen uses scroll behavior that feels awkward, and typing into fields can leave the user unable to see what they are changing. The expected outcome is a keyboard-aware auth screen where focused fields remain visible while typing.

## Decisions

- Treat this as an MVP auth usability fix aligned with email/password authentication.
- Use the rendered `AuthFlow` screen as the implementation target.
- Preserve existing auth submission, mode switching, error clearing, Google sign-in, and post-auth navigation behavior.
- Use React Native primitives rather than adding a keyboard-aware scroll dependency.
- Preserve existing `FIN_DATA_THEME` tokens and `StyleSheet.create` patterns.

## Context

- **Visuals:** None.
- **References:** `apps/native/components/auth-flow.tsx`, `apps/native/app/auth.tsx`, `apps/native/components/sign-in.tsx`, `apps/native/components/sign-up.tsx`.
- **Product alignment:** MVP includes email/password authentication. This fix supports mobile-first auth usability.

## Standards Applied

- `native/ui-constraints` — applies to React Native layout, StyleSheet, and component constraints.
- `native/theme-tokens` — applies to spacing/color changes in product UI surfaces.
- `native/expo-router` — applies to preserving auth route/navigation behavior.
- `global/quality-controls` — applies to type checking and Biome verification.
