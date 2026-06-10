# Performance — Recyclable Lists & Images

## Lists: FlashList over FlatList
- `FlatList` keeps all items in memory — use `@shopify/flash-list` for any scrollable list
- FlashList v2 handles item sizing internally; do not add v1-only sizing props that fail TypeScript

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderRow}
  keyExtractor={(item) => item.id}
/>
```

## Images: expo-image over <Image>
- `expo-image` provides disk caching, fallback states, WebP/AVIF, and hardware-accelerated transitions
- Standard `<Image>` lacks reliable disk caching

## Rules
- Every scrollable list uses FlashList
- Every remote image uses `expo-image`
- Keep FlashList props aligned with the installed major version
