import { Ionicons } from "@expo/vector-icons";
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
  const { data: watchlist } = useWatchlist();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Watchlist</Text>
        <Pressable onPress={() => router.push("/stocks")}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
        </Pressable>
      </View>

      {watchlist.map((item) => {
        const isUp = item.change >= 0;

        return (
          <Pressable
            key={item.symbol}
            onPress={() =>
              router.push(`/stocks/${encodeURIComponent(item.symbol)}`)
            }
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surfaceContainerLow },
                ]}
              >
                <Ionicons
                  name={isUp ? "apps" : "car-sport-outline"}
                  size={18}
                  color={isUp ? theme.primary : theme.chartNavy}
                />
              </View>
              <View>
                <Text style={[styles.symbol, { color: theme.text }]}>
                  {item.symbol}
                </Text>
                <Text style={[styles.name, { color: theme.textTertiary }]}>
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
      })}
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
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
