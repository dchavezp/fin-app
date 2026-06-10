import { DrawerToggleButton } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import { StockAlertCard } from "../components/stock-alert-card";
import { StockAlertEmptyState } from "../components/stock-alert-empty-state";
import { useStockAlerts } from "../stock-alerts-context";

export function AlertsScreen() {
  const router = useRouter();
  const { alerts } = useStockAlerts();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <Container includeBottomInset={false}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <DrawerToggleButton tintColor={theme.primary} />
          <Text style={[styles.title, { color: theme.primary }]}>Rules</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/alerts/new")}
          >
            <Text style={[styles.addText, { color: theme.primary }]}>Add</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summary}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              Manage price rules
            </Text>
            <Text style={[styles.summaryBody, { color: theme.textTertiary }]}>
              Create, edit, or remove price rules that can trigger
              notifications.
            </Text>
          </View>

          {alerts.length === 0 ? (
            <StockAlertEmptyState
              actionLabel="Create rule"
              description="Set up your first price rule so it can appear on Home and trigger notifications."
              onAction={() => router.push("/alerts/new")}
              title="No price rules yet"
            />
          ) : (
            <View style={styles.list}>
              {alerts.map((alert) => (
                <StockAlertCard
                  key={alert.id}
                  alert={alert}
                  onPress={() => router.push(`/alerts/${alert.id}`)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingBottom: 16,
  },
  addText: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    paddingBottom: 120,
    gap: 16,
  },
  summary: {
    gap: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryBody: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
  list: {
    gap: 8,
  },
});
