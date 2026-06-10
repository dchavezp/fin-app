import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import type { StockAlert } from "../types";

type StockAlertCardProps = {
  alert: StockAlert;
  compact?: boolean;
  onPress?: () => void;
};

export function StockAlertCard({
  alert,
  compact = false,
  onPress,
}: StockAlertCardProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const isAbove = alert.direction === "above";

  return (
    <Pressable
      accessibilityLabel={`${alert.symbol} alert for ${isAbove ? "above" : "below"} ${alert.targetPrice.toFixed(2)}`}
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact ? styles.compactCard : styles.listCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
          opacity: pressed && onPress ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.symbolBlock}>
          <Text style={[styles.symbol, { color: theme.text }]}>
            {alert.symbol}
          </Text>
          <Text style={[styles.target, { color: theme.textTertiary }]}>
            {isAbove ? "Above" : "Below"} ${alert.targetPrice.toFixed(2)}
          </Text>
        </View>
        <View
          style={[styles.badge, { backgroundColor: theme.surfaceContainerLow }]}
        >
          <Ionicons
            name={isAbove ? "trending-up" : "trending-down"}
            size={14}
            color={isAbove ? theme.primary : theme.error}
          />
        </View>
      </View>

      {alert.label ? (
        <Text
          style={[styles.label, { color: theme.textTertiary }]}
          numberOfLines={compact ? 2 : 1}
        >
          {alert.label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  compactCard: {
    padding: 14,
    width: "48%",
  },
  listCard: {
    padding: 16,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  symbolBlock: {
    flex: 1,
    gap: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },
  target: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
  },
  badge: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    padding: 8,
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 18,
  },
});
