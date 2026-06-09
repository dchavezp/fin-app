import { MaterialIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { MOCK_CATEGORIES } from "../constants";

export const CategoryCards = memo(function CategoryCards() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <View style={styles.row}>
      {MOCK_CATEGORIES.map((cat) => (
        <Pressable
          key={cat.id}
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.surfaceContainerLow },
            ]}
          >
            <MaterialIcons
              name={cat.icon as keyof typeof MaterialIcons.glyphMap}
              size={22}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.label, { color: theme.text }]}>{cat.label}</Text>
        </Pressable>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FIN_DATA_THEME.typography.label,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
});
