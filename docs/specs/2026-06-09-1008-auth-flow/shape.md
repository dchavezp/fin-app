# Auth Flow — Shaping Notes

## Scope

Build a dedicated authentication flow for the Expo app that supports email/password authentication and Google OAuth using Better Auth. The flow should be visually inspired by the Stitch `Login - FinData Pro (High-Precision)` screen and should protect the existing drawer/tabs app shell behind a session.

## Decisions

- Email/password remains the MVP baseline from the product roadmap.
- Google OAuth is included in scope.
- Password recovery is out of scope for this pass.
- The current inline `SignIn` and `SignUp` widgets on the drawer home screen should become a dedicated auth route/flow.
- Auth routing should align with the existing Expo Router hierarchy: root stack first, protected drawer/tabs shell second.
- Google OAuth requires server-side secret env vars and native client sign-in wiring.

## Product Alignment

- Product mission: mobile-first real-time stock monitoring for investors and trading enthusiasts.
- MVP roadmap: user authentication is Phase 1, before stock alerts, listings, charts, and notifications.
- Tech stack: Expo SDK 54, Expo Router v6, Better Auth with `expo-secure-store`, TanStack Form with Zod, and React Native `StyleSheet.create` styling.

## Context

- **Visuals:** Stitch screen `Login - FinData Pro (High-Precision)`, stored in `visuals/stitch-login.png` and `visuals/stitch-login.html`.
- **References:** Existing native auth components, native auth client, Better Auth server config, and route layouts.
- **Constraints:** Keep server secrets out of the native bundle; use public `EXPO_PUBLIC_` vars only for native config.

## Standards Applied

- `auth/better-auth` — Better Auth cookie, trusted origin, and Expo plugin settings.
- `native/expo-router` — auth route and protected shell placement.
- `native/theme-tokens` — theme-driven mobile UI colors.
- `native/ui-constraints` — React Native-safe layout and component patterns.
- `global/env-validation` — OAuth env vars and native/server env separation.
- `global/quality-controls` — type checks and Biome compliance.
- `global/testing` — auth journey testing expectations and current gaps.
