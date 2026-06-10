import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

type StockAlertEmptyStateProps = {
  actionLabel: string;
  onAction: () => void;
  description: string;
  title: string;
};

export function StockAlertEmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: StockAlertEmptyStateProps) {
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
          size={22}
          color={theme.primary}
        />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textTertiary }]}>
        {description}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.surface }]}>
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
});
