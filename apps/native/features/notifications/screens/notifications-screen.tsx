import { DrawerToggleButton } from "@react-navigation/drawer";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { NotificationEmptyState } from "../components/notification-empty-state";
import { NotificationEventCard } from "../components/notification-event-card";
import { useNotificationHistory } from "../notification-history-context";
import type { NotificationEvent } from "../types";

export function NotificationsScreen() {
  const router = useRouter();
  const { events, markRead } = useNotificationHistory();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  function handleNotificationPress(event: NotificationEvent) {
    markRead(event.id);

    if (event.ruleId) {
      router.push({
        pathname: "/alerts/[alertId]",
        params: { alertId: event.ruleId },
      });
    }
  }

  return (
    <Container includeBottomInset={false}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <DrawerToggleButton tintColor={theme.primary} />
          <Text style={[styles.title, { color: theme.primary }]}>
            Notifications
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlashList
          contentContainerStyle={styles.content}
          data={events}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(event) => event.id}
          ListEmptyComponent={NotificationEmptyState}
          ListHeaderComponent={
            <View style={styles.summary}>
              <Text style={[styles.summaryTitle, { color: theme.text }]}>
                Rule hits
              </Text>
              <Text style={[styles.summaryBody, { color: theme.textTertiary }]}>
                Triggered price rules appear here as in-app notification
                history.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <NotificationEventCard
              event={item}
              onPress={() => handleNotificationPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
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
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    paddingBottom: 120,
    paddingTop: 16,
  },
  summary: {
    gap: 4,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryBody: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
  separator: {
    height: 8,
  },
});
