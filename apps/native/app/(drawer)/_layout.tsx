import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { type Href, Redirect, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StockAlertsProvider } from "@/features/alerts/stock-alerts-context";
import { NotificationHistoryProvider } from "@/features/notifications/notification-history-context";
import { authClient } from "@/lib/auth-client";
import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { disableMockAuth } from "@/lib/mock-auth";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useSession } from "@/lib/use-session";

const AUTH_ROUTE = "/auth" as Href;

type CustomDrawerContentProps = DrawerContentComponentProps & {
  userEmail?: string | null;
  userName?: string | null;
};

function CustomDrawerContent({
  userEmail,
  userName,
  ...props
}: CustomDrawerContentProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  async function handleSignOut() {
    disableMockAuth();
    await authClient.signOut();
    router.replace(AUTH_ROUTE);
  }

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.surface }]}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <MaterialCommunityIcons
            name="chart-line"
            size={28}
            color={theme.primary}
          />
          <View style={styles.accountBlock}>
            <Text style={[styles.drawerBrand, { color: theme.text }]}>
              FinData Pro
            </Text>
            <Text style={[styles.accountName, { color: theme.text }]}>
              {userName || "No data"}
            </Text>
            <Text style={[styles.accountEmail, { color: theme.textSecondary }]}>
              {userEmail || "No data"}
            </Text>
          </View>
        </View>
      </DrawerContentScrollView>
      <View
        style={[
          styles.drawerFooter,
          { borderTopColor: theme.border, paddingBottom: 16 + insets.bottom },
        ]}
      >
        <Pressable style={styles.signOutRow} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color={theme.error} />
          <Text style={[styles.signOutLabel, { color: theme.error }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const DrawerLayout = () => {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  if (!session?.user) {
    return <Redirect href={AUTH_ROUTE} />;
  }

  return (
    <StockAlertsProvider>
      <NotificationHistoryProvider
        key={session.user.id}
        userId={session.user.id}
      >
        <Drawer
          drawerContent={(props) => (
            <CustomDrawerContent
              {...props}
              userEmail={session.user.email}
              userName={session.user.name}
            />
          )}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: theme.surface,
              width: 280,
            },
            drawerLabelStyle: {
              color: theme.textSecondary,
            },
            drawerInactiveTintColor: theme.textSecondary,
            drawerActiveTintColor: theme.primary,
            drawerActiveBackgroundColor: theme.surfaceVariant,
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerItemStyle: { display: "none" },
              drawerIcon: ({
                size,
                color,
              }: {
                size: number;
                color: string;
              }) => <Ionicons name="grid-outline" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="stocks"
            options={{
              drawerItemStyle: { display: "none" },
              headerShown: false,
            }}
          />
        </Drawer>
      </NotificationHistoryProvider>
    </StockAlertsProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  accountBlock: {
    flex: 1,
    gap: 4,
  },
  drawerBrand: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  accountName: {
    fontSize: FIN_DATA_THEME.typography.brand,
    fontWeight: "700",
  },
  accountEmail: {
    fontSize: FIN_DATA_THEME.typography.body,
    fontWeight: "400",
  },
  drawerFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  signOutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  signOutLabel: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "500",
  },
});

export default DrawerLayout;
