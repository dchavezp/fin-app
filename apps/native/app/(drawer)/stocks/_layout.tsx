import { Stack } from "expo-router";

export default function StocksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[symbol]" />
    </Stack>
  );
}
