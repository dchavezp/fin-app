# References for Auth Flow

## Similar Implementations

### Native Sign In Component

- **Location:** `apps/native/components/sign-in.tsx`
- **Relevance:** Current email/password sign-in implementation using TanStack Form, Zod, Better Auth client, validation, loading state, and server errors.
- **Key patterns:** Reuse form validation and Better Auth `signIn.email` wiring; improve presentation and route-level integration.

### Native Sign Up Component

- **Location:** `apps/native/components/sign-up.tsx`
- **Relevance:** Current account creation implementation using TanStack Form, Zod, and Better Auth `signUp.email`.
- **Key patterns:** Reuse name/email/password validation and submit behavior; consolidate with auth flow UI.

### Native Auth Client

- **Location:** `apps/native/lib/auth-client.ts`
- **Relevance:** Better Auth React client configured with the Expo plugin and SecureStore.
- **Key patterns:** Preserve `expoClient`, app scheme, storage prefix, and `EXPO_PUBLIC_SERVER_URL` base URL.

### Better Auth Server Config

- **Location:** `packages/auth/src/index.ts`
- **Relevance:** Server-side Better Auth setup with Drizzle adapter, email/password, Expo plugin, trusted origins, and secure cookies.
- **Key patterns:** Add Google `socialProviders` without regressing native cross-origin behavior.

### Root Stack Layout

- **Location:** `apps/native/app/_layout.tsx`
- **Relevance:** Root stack placement for drawer shell, modal, and new auth route.
- **Key patterns:** Keep auth outside drawer/tabs and hide headers where appropriate.

### Drawer Layout

- **Location:** `apps/native/app/(drawer)/_layout.tsx`
- **Relevance:** Protected app shell candidate.
- **Key patterns:** Gate drawer rendering behind session state and redirect unauthenticated users.

### Tabs Layout

- **Location:** `apps/native/app/(drawer)/(tabs)/_layout.tsx`
- **Relevance:** Primary authenticated app navigation.
- **Key patterns:** Leave tab hierarchy intact under protected drawer.

## Visual Reference

### Stitch Login - FinData Pro (High-Precision)

- **Project:** `projects/15073954078646574423`
- **Screen:** `projects/15073954078646574423/screens/2cf0eecb33434e85b4f558cd7c351baf`
- **Local screenshot:** `visuals/stitch-login.png`
- **Local HTML:** `visuals/stitch-login.html`
- **Relevance:** Provides FinData Pro branding, high-precision finance mood, Google sign-in affordance, email/password fields, remember-me cue, and sign-up link.
- **Key patterns:** Use the visual direction, not the generated web markup directly; implement with React Native primitives.
