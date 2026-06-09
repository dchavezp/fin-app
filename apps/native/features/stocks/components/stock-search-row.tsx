import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import type { StockListItem } from "../types";

interface StockSearchRowProps {
  onPress: () => void;
  stock: StockListItem;
}

export const StockSearchRow = memo(function StockSearchRow({
  onPress,
  stock,
}: StockSearchRowProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const isUp = stock.changePercent >= 0;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.cardLeft}>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.surfaceContainerHigh },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {stock.initials}
          </Text>
        </View>
        <View style={styles.labelBlock}>
          <Text
            numberOfLines={1}
            style={[styles.symbol, { color: theme.text }]}
          >
            {stock.symbol}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.name, { color: theme.textTertiary }]}
          >
            {stock.name}
          </Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={[styles.price, { color: theme.text }]}>
          ${stock.price.toFixed(2)}
        </Text>
        <Text
          style={[
            styles.changeText,
            { color: isUp ? theme.primary : theme.error },
          ]}
        >
          {isUp ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 16,
  },
  cardLeft: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 12,
  },
  badge: {
    alignItems: "center",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  badgeText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "800",
  },
  labelBlock: {
    flexShrink: 1,
    gap: 2,
  },
  symbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  name: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "400",
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  changeText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "600",
  },
});
