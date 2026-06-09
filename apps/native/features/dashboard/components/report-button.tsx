import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export const ReportButton = memo(function ReportButton() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <Pressable
      style={[styles.button, { backgroundColor: theme.primaryContainer }]}
    >
      <Ionicons
        name="download-outline"
        size={18}
        color={theme.onPrimaryContainer}
      />
      <Text style={[styles.label, { color: theme.onPrimaryContainer }]}>
        Download Comprehensive Report
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
