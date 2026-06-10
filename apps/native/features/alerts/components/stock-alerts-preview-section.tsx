import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useStockAlerts } from "../stock-alerts-context";
import { StockAlertCard } from "./stock-alert-card";
import { StockAlertEmptyState } from "./stock-alert-empty-state";

export const StockAlertsPreviewSection = memo(
  function StockAlertsPreviewSection() {
    const router = useRouter();
    const { alerts } = useStockAlerts();
    const { colorScheme } = useColorScheme();
    const theme = getFinDataMode(colorScheme);
    const previewAlerts = alerts.slice(0, 4);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: theme.text }]}>
              Stock alerts
            </Text>
            <Text style={[styles.subtitle, { color: theme.textTertiary }]}>
              Track up to four alerts from the home screen.
            </Text>
          </View>
          <Pressable
            style={styles.reviewLink}
            onPress={() => router.push("/alerts")}
          >
            <Text style={[styles.seeAll, { color: theme.primary }]}>
              Review all
            </Text>
          </Pressable>
        </View>

        {previewAlerts.length === 0 ? (
          <StockAlertEmptyState
            actionLabel="Create alert"
            description="Add your first stock alert so it appears here and in the alerts hub."
            onAction={() => router.push("/alerts/new")}
            title="No alerts yet"
          />
        ) : (
          <View style={styles.grid}>
            {previewAlerts.map((alert) => (
              <StockAlertCard
                key={alert.id}
                alert={alert}
                compact
                onPress={() => router.push(`/alerts/${alert.id}`)}
              />
            ))}
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerCopy: {
    flexShrink: 1,
    maxWidth: "68%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FIN_DATA_THEME.typography.body,
    marginTop: 2,
  },
  reviewLink: {
    flexShrink: 0,
  },
  seeAll: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
});
