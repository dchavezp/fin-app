import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Container } from "@/components/container";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { StockSearchRow } from "../components/stock-search-row";
import { STOCK_FILTER_OPTIONS } from "../constants";
import { useStockSearch } from "../hooks/use-stock-search";

export function StockSearchScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const {
    error,
    filter,
    isError,
    isPending,
    isQueryTooShort,
    query,
    setFilter,
    setQuery,
    stocks,
  } = useStockSearch();

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
        <Pressable onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="arrow-back" size={22} color={theme.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Search</Text>
        <View style={styles.headerAction} />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.searchShell,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.textTertiary}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setQuery}
            placeholder="Search stocks"
            placeholderTextColor={theme.textTertiary}
            style={[styles.searchInput, { color: theme.text }]}
            value={query}
          />
        </View>

        <View style={styles.filters}>
          {STOCK_FILTER_OPTIONS.map((option) => {
            const isActive = option.value === filter;

            return (
              <Pressable
                key={option.value}
                onPress={() => setFilter(option.value)}
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
              Loading stocks...
            </Text>
          </View>
        ) : null}

        {isQueryTooShort ? (
          <View style={styles.stateBlock}>
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              Type at least 2 letters to search.
            </Text>
          </View>
        ) : null}

        {isError ? (
          <View style={styles.stateBlock}>
            <Text style={[styles.stateText, { color: theme.error }]}>
              {error instanceof Error
                ? error.message
                : "Unable to load stock data."}
            </Text>
          </View>
        ) : null}

        {!isPending && !isError && !isQueryTooShort ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={stocks}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <StockSearchRow
                onPress={() =>
                  router.push(`/stocks/${encodeURIComponent(item.symbol)}`)
                }
                stock={item}
              />
            )}
            ListEmptyComponent={
              <View style={styles.stateBlock}>
                <Text
                  style={[styles.stateText, { color: theme.textSecondary }]}
                >
                  No stocks found.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchShell: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    height: 54,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
    marginTop: 16,
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
  listContent: {
    paddingBottom: 120,
  },
  stateBlock: {
    paddingVertical: 24,
  },
  stateText: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
});
