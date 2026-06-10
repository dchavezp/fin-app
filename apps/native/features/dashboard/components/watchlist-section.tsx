import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useWatchlist } from "../hooks/use-watchlist";

export const WatchlistSection = memo(function WatchlistSection() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data: watchlist, isError, isPending, refetch } = useWatchlist();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Watchlist</Text>
        <Pressable
          accessibilityLabel="See all stocks"
          accessibilityRole="button"
          onPress={() => router.push("/stocks")}
        >
          <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
        </Pressable>
      </View>

      {isPending ? (
        <View
          style={[
            styles.stateCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Loading watchlist...
          </Text>
          <Text style={[styles.stateBody, { color: theme.textTertiary }]}>
            Fetching the latest market prices.
          </Text>
        </View>
      ) : isError ? (
        <View
          style={[
            styles.stateCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            Unable to load watchlist
          </Text>
          <Text style={[styles.stateBody, { color: theme.textTertiary }]}>
            Check your connection and try again.
          </Text>
          <Pressable
            accessibilityLabel="Retry loading watchlist"
            accessibilityRole="button"
            onPress={() => refetch()}
          >
            <Text style={[styles.retryText, { color: theme.primary }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : watchlist.length === 0 ? (
        <View
          style={[
            styles.stateCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.stateTitle, { color: theme.text }]}>
            No watchlist items yet
          </Text>
          <Text style={[styles.stateBody, { color: theme.textTertiary }]}>
            Followed market symbols will appear here.
          </Text>
        </View>
      ) : (
        watchlist.map((item) => {
          const isUp = item.change >= 0;

          return (
            <Pressable
              accessibilityLabel={`${item.symbol} ${item.name} at ${item.price.toFixed(2)}, ${isUp ? "up" : "down"} ${Math.abs(item.changePercent).toFixed(2)} percent`}
              accessibilityRole="button"
              key={item.symbol}
              onPress={() =>
                router.push({
                  pathname: "/stocks/[symbol]",
                  params: { symbol: item.symbol },
                })
              }
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
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
                    {item.initials}
                  </Text>
                </View>
                <View style={styles.cardCopy}>
                  <Text style={[styles.symbol, { color: theme.text }]}>
                    {item.symbol}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.name, { color: theme.textTertiary }]}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Text style={[styles.price, { color: theme.text }]}>
                  ${item.price.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.changeText,
                    { color: isUp ? theme.primary : theme.error },
                  ]}
                >
                  {isUp ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  stateCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  stateTitle: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  stateBody: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
  retryText: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    minWidth: 0,
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
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
  symbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  name: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "400",
    marginTop: 1,
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
