import { useRouter } from "expo-router";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useNotificationHistory } from "../notification-history-context";
import { NotificationEmptyState } from "./notification-empty-state";
import { NotificationEventCard } from "./notification-event-card";

const PREVIEW_LIMIT = 3;

export const NotificationHistoryPreviewSection = memo(
  function NotificationHistoryPreviewSection() {
    const { events, markRead } = useNotificationHistory();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const theme = getFinDataMode(colorScheme);
    const previewEvents = events.slice(0, PREVIEW_LIMIT);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: theme.text }]}>
              Recent notifications
            </Text>
            <Text style={[styles.subtitle, { color: theme.textTertiary }]}>
              Price rule hits will show here after they trigger.
            </Text>
          </View>
        </View>

        {previewEvents.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <View style={styles.list}>
            {previewEvents.map((event) => (
              <NotificationEventCard
                key={event.id}
                event={event}
                onPress={() => {
                  markRead(event.id);

                  if (event.ruleId) {
                    router.push(`/alerts/${event.ruleId}`);
                  }
                }}
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FIN_DATA_THEME.typography.body,
    marginTop: 2,
  },
  list: {
    gap: 8,
  },
});
