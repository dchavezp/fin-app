import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export function NotificationEmptyState() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.surfaceContainerLow },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={20}
          color={theme.primary}
        />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>No hits yet</Text>
        <Text style={[styles.description, { color: theme.textTertiary }]}>
          Triggered rules will appear here as in-app history.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  description: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
});
