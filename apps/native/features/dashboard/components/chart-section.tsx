import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useChartData } from "../hooks/use-chart-data";

export const ChartSection = memo(function ChartSection() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data } = useChartData();

  const pieData = data.map((item, index) => ({
    value: item.value,
    color: index === 0 ? theme.chartGreen : theme.chartNavy,
    text: `${item.value}%`,
  }));

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          donut
          showText
          textColor={theme.text}
          textSize={14}
          fontWeight="700"
          radius={50}
          innerRadius={36}
          strokeColor={theme.background}
          strokeWidth={2}
          centerLabelComponent={() => (
            <Text style={[styles.centerLabel, { color: theme.text }]}>32%</Text>
          )}
        />

        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === 0 ? theme.chartGreen : theme.chartNavy,
                  },
                ]}
              />
              <Text style={[styles.legendLabel, { color: theme.text }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  centerLabel: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "700",
  },
  legend: {
    gap: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
});
