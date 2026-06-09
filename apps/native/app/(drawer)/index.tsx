import { type Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { NAV_THEME } from "@/lib/constants";
import { disableMockAuth } from "@/lib/mock-auth";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useSession } from "@/lib/use-session";

const AUTH_ROUTE = "/auth" as Href;

export default function Home() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const { data: session } = useSession();

  async function handleSignOut() {
    disableMockAuth();
    await authClient.signOut();
    router.replace(AUTH_ROUTE);
  }

  return (
    <Container>
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.content}>
          <View style={styles.titleHost}>
            <Text
              style={{
                color: theme.text,
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              BETTER T STACK
            </Text>
          </View>

          {session?.user ? (
            <View
              style={[
                styles.userCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.userHeader}>
                <View style={{ gap: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>
                    {`Welcome, ${session.user.name}`}
                  </Text>
                  <Text
                    style={{ color: theme.text, fontSize: 14, opacity: 0.7 }}
                  >
                    {session.user.email}
                  </Text>
                </View>
              </View>
              <View>
                <Pressable
                  style={[styles.outlinedButton, { borderColor: theme.text }]}
                  onPress={handleSignOut}
                >
                  <Text style={{ color: theme.text, fontSize: 14 }}>
                    Sign Out
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  titleHost: {
    alignSelf: "stretch",
    height: 34,
    marginBottom: 24,
  },
  userCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  userHeader: {
    marginBottom: 8,
  },
  outlinedButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
});
