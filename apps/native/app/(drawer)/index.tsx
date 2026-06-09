import { Redirect } from "expo-router";

export default function DrawerRoot() {
  return <Redirect href="/(drawer)/(tabs)" />;
}
