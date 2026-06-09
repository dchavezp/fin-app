import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

interface CompanyProfileProps {
  country: string | null;
  industry: string | null;
  ipo: string | null;
  shareOutstanding: number | null;
  website: string | null;
}

function formatShares(value: number | null) {
  if (!value) {
    return "N/A";
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  return value.toLocaleString();
}

export function CompanyProfile({
  country,
  industry,
  ipo,
  shareOutstanding,
  website,
}: CompanyProfileProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  const rows: [string, string | null, string | undefined][] = [
    ["Country", country, undefined],
    ["Industry", industry, undefined],
    ["IPO Date", ipo, undefined],
    [
      "Shares Outstanding",
      shareOutstanding ? formatShares(shareOutstanding) : "N/A",
      undefined,
    ],
  ];

  const hasWebsite = website && website.length > 0;

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
            Company profile
          </Text>
        </View>
        {hasWebsite ? (
          <Pressable
            onPress={() => Linking.openURL(website)}
            style={({ pressed }) => [
              styles.linkButton,
              {
                backgroundColor: pressed ? theme.surfaceVariant : "transparent",
              },
            ]}
          >
            <Ionicons name="globe-outline" size={16} color={theme.primary} />
            <Text
              numberOfLines={1}
              style={[styles.linkText, { color: theme.primary }]}
            >
              Website
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.surfaceVariant }]}
      />

      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, { color: theme.textTertiary }]}>
            {label}
          </Text>
          <Text numberOfLines={1} style={[styles.value, { color: theme.text }]}>
            {value ?? "N/A"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  linkButton: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "500",
  },
  value: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "600",
    maxWidth: "50%",
  },
});
