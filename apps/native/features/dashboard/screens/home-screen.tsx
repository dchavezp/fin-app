import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StockAlertsPreviewSection } from "@/features/alerts/components/stock-alerts-preview-section";
import { getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import { ChartSection } from "../components/chart-section";
import { MarketOverviewCard } from "../components/market-overview-card";
import { ReportButton } from "../components/report-button";
import { WatchlistSection } from "../components/watchlist-section";

export function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <Container includeBottomInset={false}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.surfaceVariant,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <DrawerToggleButton tintColor={theme.primary} />
        </View>
        <Text style={[styles.brand, { color: theme.primary }]}>
          FinData Pro
        </Text>
        <Pressable
          onPress={() => router.push("/stocks")}
          style={styles.headerRight}
        >
          <Ionicons name="search-outline" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <MarketOverviewCard />
        <StockAlertsPreviewSection />
        <WatchlistSection />
        <ChartSection />
        <ReportButton />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
});
