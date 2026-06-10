import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { CompanyProfile } from "../components/company-profile";
import { StockEarningsChart } from "../components/stock-earnings-chart";
import { StockPriceChart } from "../components/stock-price-chart";
import { useStockChart } from "../hooks/use-stock-chart";
import { useStockDetail } from "../hooks/use-stock-detail";
import { useStockEarnings } from "../hooks/use-stock-earnings";

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
  const {
    chartData,
    isError: isChartError,
    isPending: isChartPending,
    range,
    rangeOptions,
    setRange,
    summary,
    xLabels,
  } = useStockChart(symbol);
  const {
    data: earningsData,
    isError: isEarningsError,
    isPending: isEarningsPending,
  } = useStockEarnings(symbol);
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
            <View style={styles.priceRow}>
              <View style={styles.priceRowLeft}>
                <Text style={[styles.symbol, { color: theme.text }]}>
                  {data.symbol}
                </Text>
                <Text style={[styles.name, { color: theme.textSecondary }]}>
                  {data.name}
                </Text>
                <Text style={[styles.exchange, { color: theme.textTertiary }]}>
                  {data.exchange}
                </Text>
              </View>
              <View style={styles.priceRowRight}>
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
                  {data.changePercent.toFixed(2)}%
                </Text>
              </View>
            </View>

            <StockPriceChart
              chartData={chartData}
              isError={isChartError}
              isPending={isChartPending}
              onSelectRange={setRange}
              range={range}
              rangeOptions={rangeOptions}
              summary={summary}
              xLabels={xLabels}
            />

            <StockEarningsChart
              data={earningsData}
              isError={isEarningsError}
              isPending={isEarningsPending}
            />

            <CompanyProfile
              country={data.country}
              industry={data.industry}
              ipo={data.ipo}
              shareOutstanding={data.shareOutstanding}
              website={data.website}
            />

            <View
              style={[
                styles.statsSection,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <Text style={[styles.statsTitle, { color: theme.text }]}>
                Trading overview
              </Text>
              <Text
                style={[
                  styles.statsDescription,
                  { color: theme.textSecondary },
                ]}
              >
                Key price points and company fundamentals for the latest
                session.
              </Text>
              {[
                ["Open", formatCurrency(data.open, data.currency)],
                ["High", formatCurrency(data.high, data.currency)],
                ["Low", formatCurrency(data.low, data.currency)],
                [
                  "Prev Close",
                  formatCurrency(data.previousClose, data.currency),
                ],
                ["Market Cap", formatMarketCap(data.marketCap)],
                ["Industry", data.industry || "N/A"],
                ["IPO", data.ipo || "N/A"],
              ].map(([label, value]) => (
                <View key={label} style={styles.statRow}>
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
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  priceRowLeft: {
    flexShrink: 1,
  },
  priceRowRight: {
    alignItems: "flex-end",
  },
  symbol: {
    fontSize: 26,
    fontWeight: "800",
  },
  name: {
    fontSize: FIN_DATA_THEME.typography.body,
    marginTop: 4,
  },
  exchange: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    marginTop: 6,
    textTransform: "uppercase",
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
  },
  changeText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  statsSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  statsDescription: {
    fontSize: FIN_DATA_THEME.typography.caption,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 12,
  },
  statRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "700",
    textAlign: "right",
    marginLeft: 16,
    flexShrink: 1,
  },
});
