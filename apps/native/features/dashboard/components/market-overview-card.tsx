import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { formatChange, formatCurrency, formatPercent } from "../constants";
import { useMarketOverview } from "../hooks/use-market-overview";

export const MarketOverviewCard = memo(function MarketOverviewCard() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data } = useMarketOverview();
  const isPositive = data.changePercent >= 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>
        Market Overview
      </Text>

      <View style={styles.summaryRow}>
        <View style={styles.valueBlock}>
          <Text style={[styles.value, { color: theme.text }]}>
            {formatCurrency(data.totalValue)}
          </Text>
        </View>

        <View style={styles.deltaBlock}>
          <View style={styles.changeRow}>
            <Ionicons
              name={isPositive ? "arrow-up" : "arrow-down"}
              size={14}
              color={isPositive ? theme.success : theme.error}
            />
            <Text
              style={[
                styles.changePercent,
                { color: isPositive ? theme.success : theme.error },
              ]}
            >
              {formatPercent(data.changePercent)}
            </Text>
          </View>

          <Text style={[styles.openPrice, { color: theme.textTertiary }]}>
            {formatChange(data.change)} open
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.chartCard,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        ]}
      >
        <Svg height={160} width="100%" viewBox="0 0 400 160">
          <Defs>
            <LinearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.primary} stopOpacity="0.35" />
              <Stop offset="1" stopColor={theme.primary} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <Path
            d="M0 120 Q50 40 100 80 T200 55 T300 118 T400 42 L400 160 L0 160 Z"
            fill="url(#sparklineFill)"
          />
          <Path
            d="M0 120 Q50 40 100 80 T200 55 T300 118 T400 42"
            fill="none"
            stroke={theme.primary}
            strokeLinecap="round"
            strokeWidth={3}
          />
          <Circle cx="400" cy="42" fill={theme.primary} r="4" />
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  valueBlock: {
    flex: 1,
  },
  deltaBlock: {
    alignItems: "flex-end",
  },
  value: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  changePercent: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "700",
  },
  openPrice: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "400",
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
