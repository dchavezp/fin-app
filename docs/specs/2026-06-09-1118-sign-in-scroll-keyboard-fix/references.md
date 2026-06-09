# References for Sign-In Scroll Keyboard Fix

## Similar Implementations

### AuthFlow

- **Location:** `apps/native/components/auth-flow.tsx`
- **Relevance:** This is the auth UI rendered by `apps/native/app/auth.tsx`.
- **Key patterns:** Uses `ScrollView`, `Pressable`, `TextInput`, `StyleSheet.create`, `FIN_DATA_THEME`, TanStack form, Better Auth, and Expo Router navigation.
- **Issue observed:** Root `ScrollView` uses `contentContainerStyle` with `flexGrow: 1` and `justifyContent: "center"`, but no keyboard avoidance. This likely causes awkward recentering and hidden fields while typing.

### Auth Route

- **Location:** `apps/native/app/auth.tsx`
- **Relevance:** Confirms the active auth screen renders `<AuthFlow />` and redirects authenticated users to `/(drawer)`.
- **Key patterns:** Preserve route behavior and loading state.

### Legacy/Simple Sign-In And Sign-Up Components

- **Location:** `apps/native/components/sign-in.tsx`, `apps/native/components/sign-up.tsx`
- **Relevance:** Older/simple form components exist, but they are not rendered by the auth route.
- **Key patterns:** They use similar Better Auth and TanStack form handling, but should not be the primary target for this bug.
