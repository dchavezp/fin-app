import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import type { NotificationEvent } from "../types";

type NotificationEventCardProps = {
  event: NotificationEvent;
  onPress?: () => void;
};

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function NotificationEventCard({
  event,
  onPress,
}: NotificationEventCardProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const isAbove = event.direction === "above";

  return (
    <Pressable
      accessibilityLabel={`${event.symbol} notification triggered ${isAbove ? "above" : "below"} ${event.targetPrice.toFixed(2)}`}
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: event.read ? theme.cardBorder : theme.primary,
          opacity: pressed && onPress ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={isAbove ? "trending-up" : "trending-down"}
          size={18}
          color={isAbove ? theme.primary : theme.error}
        />
      </View>
      <View style={styles.copy}>
        <View style={styles.headerRow}>
          <Text style={[styles.symbol, { color: theme.text }]}>
            {event.symbol}
          </Text>
          <Text style={[styles.time, { color: theme.textTertiary }]}>
            {formatEventTime(event.occurredAt)}
          </Text>
        </View>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Hit ${event.triggerPrice.toFixed(2)} against{" "}
          {isAbove ? "above" : "below"} ${event.targetPrice.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    width: 36,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  symbol: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  time: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
  },
  body: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
});
