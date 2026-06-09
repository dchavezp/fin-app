# References for Stock Search Screen

## Similar Implementations

### Root Navigation

- **Location:** `apps/native/app/_layout.tsx`
- **Relevance:** Defines the root stack and where standalone screens can be registered.
- **Key patterns:** Add top-level stack entries without putting logic in route files.

### Authenticated Drawer Shell

- **Location:** `apps/native/app/(drawer)/_layout.tsx`
- **Relevance:** Shows how authenticated screens are wrapped and where standalone drawer-level screens belong.
- **Key patterns:** `headerShown: false`, authenticated gating, drawer-level screen registration.

### Tabs Layout

- **Location:** `apps/native/app/(drawer)/(tabs)/_layout.tsx`
- **Relevance:** Confirms what should stay inside tabs and what must remain outside.
- **Key patterns:** Primary section tabs only.

### Home Screen Header

- **Location:** `apps/native/features/dashboard/screens/home-screen.tsx`
- **Relevance:** Contains the current search affordance that should open the new flow.
- **Key patterns:** Custom FinData header and screen composition inside `Container`.

### Stock List Card Pattern

- **Location:** `apps/native/features/dashboard/components/watchlist-section.tsx`
- **Relevance:** Closest existing stock row layout for search results.
- **Key patterns:** Symbol/name/price/change row, left visual badge area, themed cards.

### Shared Safe-Area Container

- **Location:** `apps/native/components/container.tsx`
- **Relevance:** Standard screen wrapper for native views.
- **Key patterns:** Shared safe area edges and theme background behavior.
