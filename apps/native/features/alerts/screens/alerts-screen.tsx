import { DrawerToggleButton } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export function AlertsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <Container includeBottomInset={false}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <DrawerToggleButton tintColor={theme.primary} />
          <Text style={[styles.title, { color: theme.primary }]}>
            Price Alerts
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>Alerts</Text>
          <Text style={[styles.cardBody, { color: theme.textTertiary }]}>
            Your active stock alerts will appear here once you create them.
          </Text>
        </View>
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
    fontSize: 28,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardBody: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
});
