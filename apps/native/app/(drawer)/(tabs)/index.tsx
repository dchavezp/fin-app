import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function TabOne() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={{ gap: 8 }}>
            <Text
              style={{ color: theme.text, fontSize: 24, fontWeight: "bold" }}
            >
              Tab One
            </Text>
            <Text style={{ color: theme.text, fontSize: 16, opacity: 0.7 }}>
              Explore the first section of your app
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingVertical: 16,
  },
});
