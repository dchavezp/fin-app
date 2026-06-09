import type React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export function Container({
  children,
  includeBottomInset = true,
}: {
  children: React.ReactNode;
  includeBottomInset?: boolean;
}) {
  const { colorScheme } = useColorScheme();
  const backgroundColor = getFinDataMode(colorScheme).background;

  return (
    <SafeAreaView
      edges={
        includeBottomInset
          ? ["top", "left", "right", "bottom"]
          : ["top", "left", "right"]
      }
      style={[styles.container, { backgroundColor }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
