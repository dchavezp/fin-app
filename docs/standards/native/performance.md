# Performance — Recyclable Lists & Images

## Lists: FlashList over FlatList
- `FlatList` keeps all items in memory — use `@shopify/flash-list` for any scrollable list
- Always set `estimatedItemSize` to prevent layout shifts

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderRow}
  estimatedItemSize={64}
  keyExtractor={(item) => item.id}
/>
```

## Images: expo-image over <Image>
- `expo-image` provides disk caching, fallback states, WebP/AVIF, and hardware-accelerated transitions
- Standard `<Image>` lacks reliable disk caching

## Rules
- Every scrollable list uses FlashList
- Every remote image uses `expo-image`
- Set `estimatedItemSize` explicitly on all FlashList instances
