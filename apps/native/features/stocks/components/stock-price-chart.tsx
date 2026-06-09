import { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LineChart } from "react-native-gifted-charts";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import type { StockChartRange } from "../types";

interface StockPriceChartProps {
  chartData: Array<{
    dataPointText?: string;
    label?: string;
    value: number;
  }>;
  isError: boolean;
  isPending: boolean;
  onSelectRange: (range: StockChartRange) => void;
  range: StockChartRange;
  rangeOptions: Array<{
    label: string;
    value: StockChartRange;
  }>;
  summary: {
    change: number;
    changePercent: number;
    high: number;
    low: number;
  } | null;
  xLabels: Array<{ id: string; label: string }>;
}

function formatSignedCurrency(value: number) {
  return `${value >= 0 ? "+" : ""}${new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value)}`;
}

export const StockPriceChart = memo(function StockPriceChart({
  chartData,
  isError,
  isPending,
  onSelectRange,
  range,
  rangeOptions,
  summary,
  xLabels,
}: StockPriceChartProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(width - 112, 220);
  const isUp = (summary?.change ?? 0) >= 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Price chart</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track the symbol trend across common timeframes.
          </Text>
        </View>

        {summary ? (
          <Text
            style={[
              styles.changeText,
              { color: isUp ? theme.primary : theme.error },
            ]}
          >
            {formatSignedCurrency(summary.change)}
          </Text>
        ) : null}
      </View>

      <View style={styles.filters}>
        {rangeOptions.map((option) => {
          const isActive = option.value === range;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelectRange(option.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? theme.primary : theme.surface,
                  borderColor: isActive ? theme.primary : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: isActive ? theme.onPrimaryContainer : theme.text },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isPending ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Loading chart data...
          </Text>
        </View>
      ) : null}

      {isError ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.error }]}>
            Unable to load chart data.
          </Text>
        </View>
      ) : null}

      {!isPending && !isError && chartData.length === 0 ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            No chart data available for this range.
          </Text>
        </View>
      ) : null}

      {!isPending && !isError && chartData.length > 0 ? (
        <>
          <LineChart
            adjustToWidth
            areaChart
            color={theme.primary}
            curved
            data={chartData}
            disableScroll
            endFillColor={theme.surface}
            endOpacity={0.05}
            hideDataPoints
            initialSpacing={0}
            noOfSections={4}
            parentWidth={chartWidth}
            rulesColor={theme.surfaceVariant}
            showVerticalLines={false}
            startFillColor={theme.primary}
            startOpacity={0.18}
            thickness={3}
            xAxisColor={theme.surfaceVariant}
            xAxisLabelTextStyle={{
              color: "transparent",
              fontSize: 0.1,
              height: 0,
            }}
            yAxisColor={theme.surfaceVariant}
            yAxisTextStyle={[styles.axisLabel, { color: theme.textTertiary }]}
          />

          {xLabels.length > 0 ? (
            <View style={styles.xAxisRow}>
              {xLabels.map((item) => (
                <Text
                  key={item.id}
                  numberOfLines={1}
                  style={[
                    styles.axisLabel,
                    styles.xAxisLabel,
                    { color: theme.textTertiary },
                  ]}
                >
                  {item.label}
                </Text>
              ))}
            </View>
          ) : null}

          {summary ? (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.textTertiary }]}
                >
                  Range
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  {summary.changePercent >= 0 ? "+" : ""}
                  {summary.changePercent.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.textTertiary }]}
                >
                  High
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  ${summary.high.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text
                  style={[styles.summaryLabel, { color: theme.textTertiary }]}
                >
                  Low
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  ${summary.low.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    padding: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: FIN_DATA_THEME.typography.caption,
    marginTop: 4,
    maxWidth: 220,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "700",
    paddingTop: 2,
  },
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
    marginTop: 18,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
  },
  stateBlock: {
    minHeight: 220,
    paddingTop: 36,
  },
  stateText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
  axisLabel: {
    fontSize: FIN_DATA_THEME.typography.micro,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  xAxisLabel: {
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "700",
  },
});
