import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useStockDetail } from "../hooks/use-stock-detail";

function formatCurrency(value: number, currency?: string | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMarketCap(value: number | null) {
  if (!value) {
    return "N/A";
  }

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `$${(value / 1_000_000).toFixed(2)}M`;
}

export function StockDetailScreen({ symbol }: { symbol: string }) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data, error, isError, isPending } = useStockDetail(symbol);
  const isUp = (data?.changePercent || 0) >= 0;

  return (
    <Container includeBottomInset={false}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.surfaceVariant,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="arrow-back" size={22} color={theme.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {symbol}
        </Text>
        <View style={styles.headerAction} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isPending ? (
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Loading stock details...
          </Text>
        ) : null}

        {isError ? (
          <Text style={[styles.stateText, { color: theme.error }]}>
            {error instanceof Error
              ? error.message
              : "Unable to load stock details."}
          </Text>
        ) : null}

        {data ? (
          <>
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.surfaceContainerHigh },
                ]}
              >
                <Text style={[styles.badgeText, { color: theme.primary }]}>
                  {data.initials}
                </Text>
              </View>
              <Text style={[styles.symbol, { color: theme.text }]}>
                {data.symbol}
              </Text>
              <Text style={[styles.name, { color: theme.textSecondary }]}>
                {data.name}
              </Text>
              <Text style={[styles.price, { color: theme.text }]}>
                {formatCurrency(data.price, data.currency)}
              </Text>
              <Text
                style={[
                  styles.changeText,
                  { color: isUp ? theme.primary : theme.error },
                ]}
              >
                {isUp ? "+" : ""}
                {data.changePercent.toFixed(2)}% today
              </Text>
            </View>

            <View style={styles.statGrid}>
              {[
                ["Open", formatCurrency(data.open, data.currency)],
                ["High", formatCurrency(data.high, data.currency)],
                ["Low", formatCurrency(data.low, data.currency)],
                [
                  "Prev Close",
                  formatCurrency(data.previousClose, data.currency),
                ],
                ["Market Cap", formatMarketCap(data.marketCap)],
                ["Exchange", data.exchange],
                ["Industry", data.industry || "N/A"],
                ["IPO", data.ipo || "N/A"],
              ].map(([label, value]) => (
                <View
                  key={label}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[styles.statLabel, { color: theme.textTertiary }]}
                  >
                    {label}
                  </Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  stateText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
  heroCard: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 24,
  },
  badge: {
    alignItems: "center",
    borderRadius: 20,
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
    width: 56,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "800",
  },
  symbol: {
    fontSize: 24,
    fontWeight: "800",
  },
  name: {
    fontSize: FIN_DATA_THEME.typography.body,
    marginTop: 4,
  },
  price: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 18,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 160,
    padding: 16,
  },
  statLabel: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "700",
  },
});
