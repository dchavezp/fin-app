# Auth Flow Implementation Plan

## Goal

Build a full-stack authentication flow for the mobile stock-monitor app. The flow should provide a polished FinData Pro login experience, support email/password and Google sign-in, and protect the drawer/tab app shell behind a valid Better Auth session.

## Task 1: Save Spec Documentation

Create `docs/specs/2026-06-09-1008-auth-flow/` with:

- `plan.md` — this full plan
- `shape.md` — shaping notes, decisions, and product context
- `standards.md` — standards that apply to this work
- `references.md` — implementation references studied
- `visuals/` — Stitch screenshot and HTML reference

## Task 2: Configure Google OAuth Support

- Add server env validation for Google OAuth credentials.
- Configure Better Auth `socialProviders.google` in `packages/auth/src/index.ts`.
- Preserve existing Expo plugin, trusted origins, and secure cross-origin cookie settings.
- Note that Better Auth schema/plugin changes may require a schema generation or migration check before production deployment.

## Task 3: Build Dedicated Auth Route

- Add an Expo Router auth route outside the protected drawer/tabs shell.
- Move unauthenticated entry away from inline auth widgets in the drawer home screen.
- Use Better Auth session state to redirect authenticated users into the app shell.

## Task 4: Implement Stitch-Inspired Auth UI

- Refactor auth UI into a FinData Pro-branded mobile auth experience based on the Stitch reference.
- Support sign-in and sign-up modes in one focused flow.
- Include email/password fields, a Google sign-in button, loading states, validation errors, server errors, and accessible labels.
- Use React Native-safe layout: `StyleSheet.create`, `Pressable`, no raw text nodes, and theme-driven colors.

## Task 5: Add Auth Actions And Navigation

- Wire `authClient.signIn.email` and `authClient.signUp.email`.
- Wire `authClient.signIn.social` for Google OAuth.
- Keep sign-out available in the authenticated shell.
- Redirect after successful auth and after sign-out.
- Surface form and server failures clearly.

## Task 6: Protect App Shell

- Gate drawer/tab routes behind a Better Auth session.
- Redirect unauthenticated users to `/auth`.
- Redirect authenticated users away from `/auth` into `/(drawer)`.
- Avoid rendering protected screens while session state is still loading.

## Task 7: Verify Quality

- Run `pnpm check-types`.
- Run repo checks where feasible.
- Document any remaining testing gaps, since the repo has testing standards but no installed test framework yet.
