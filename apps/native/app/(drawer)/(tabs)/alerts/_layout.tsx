import { Stack } from "expo-router";

export default function AlertsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="[alertId]" />
    </Stack>
  );
}
