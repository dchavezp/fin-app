import { DrawerToggleButton } from "@react-navigation/drawer";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NotificationSettingsCard } from "@/features/notifications/components/notification-settings-card";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useSession } from "@/lib/use-session";

export function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data: session } = useSession();

  return (
    <Container includeBottomInset={false}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <DrawerToggleButton tintColor={theme.primary} />
          <Text style={[styles.title, { color: theme.primary }]}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.label, { color: theme.textTertiary }]}>
              Name
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {session?.user.name || "No data"}
            </Text>

            <Text
              style={[
                styles.label,
                styles.sectionGap,
                { color: theme.textTertiary },
              ]}
            >
              Email
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {session?.user.email || "No data"}
            </Text>
          </View>

          <NotificationSettingsCard />
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
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionGap: {
    marginTop: 20,
  },
});
