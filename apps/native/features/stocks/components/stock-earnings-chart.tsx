import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BarChart } from "react-native-gifted-charts";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import type { EarningSurprise } from "../types";

interface StockEarningsChartProps {
  data: EarningSurprise[] | undefined;
  isError: boolean;
  isPending: boolean;
}

export const StockEarningsChart = memo(function StockEarningsChart({
  data,
  isError,
  isPending,
}: StockEarningsChartProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  const barData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return [...data]
      .reverse()
      .slice(0, 8)
      .map((item) => {
        const isPositive = item.surprisePercent >= 0;

        return {
          frontColor: isPositive ? theme.primary : theme.error,
          label: `Q${item.quarter} ${item.year}`,
          value: item.surprisePercent,
        };
      });
  }, [data, theme.primary, theme.error]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            Earnings surprises
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Quarterly EPS actual vs estimate.
          </Text>
        </View>
      </View>

      {isPending ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Loading earnings data...
          </Text>
        </View>
      ) : null}

      {isError ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.error }]}>
            Unable to load earnings data.
          </Text>
        </View>
      ) : null}

      {!isPending && !isError && barData.length === 0 ? (
        <View style={styles.stateBlock}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            No earnings data available.
          </Text>
        </View>
      ) : null}

      {!isPending && !isError && barData.length > 0 ? (
        <>
          <BarChart
            barWidth={22}
            data={barData}
            disableScroll
            frontColor={theme.primary}
            isAnimated
            noOfSections={3}
            rulesColor={theme.surfaceVariant}
            showValuesAsTopLabel
            spacing={24}
            topLabelTextStyle={[
              styles.topLabel,
              { color: theme.textSecondary },
            ]}
            xAxisColor={theme.surfaceVariant}
            xAxisLabelTextStyle={[
              styles.axisLabel,
              { color: theme.textTertiary },
            ]}
            yAxisColor={theme.surfaceVariant}
            yAxisTextStyle={[styles.axisLabel, { color: theme.textTertiary }]}
          />

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: theme.primary }]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                Beat
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: theme.error }]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                Miss
              </Text>
            </View>
          </View>
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
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: FIN_DATA_THEME.typography.caption,
    marginTop: 4,
    maxWidth: 260,
  },
  stateBlock: {
    paddingTop: 36,
    paddingBottom: 36,
  },
  stateText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
  axisLabel: {
    fontSize: FIN_DATA_THEME.typography.micro,
  },
  topLabel: {
    fontSize: FIN_DATA_THEME.typography.micro,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  legendDot: {
    borderRadius: 4,
    height: 10,
    width: 10,
  },
  legendText: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "500",
  },
});
