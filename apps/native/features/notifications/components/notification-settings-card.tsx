import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, View } from "react-native";

import { FIN_DATA_THEME, getFinDataMode } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

import { useNotificationPermissionStatus } from "../hooks/use-notification-permission-status";
import { useNotificationSettings } from "../hooks/use-notification-settings";
import type { NotificationSettings, PushPermissionStatus } from "../types";

type SettingRowProps = {
  description: string;
  disabled?: boolean;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingRow({
  description,
  disabled = false,
  label,
  value,
  onValueChange,
}: SettingRowProps) {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);

  return (
    <View style={[styles.settingRow, disabled ? styles.disabledRow : null]}>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          {label}
        </Text>
        <Text
          style={[styles.settingDescription, { color: theme.textTertiary }]}
        >
          {description}
        </Text>
      </View>
      <Switch
        accessibilityHint={description}
        accessibilityLabel={label}
        disabled={disabled}
        onValueChange={onValueChange}
        thumbColor={value ? theme.primary : theme.textTertiary}
        trackColor={{ false: theme.surfaceVariant, true: theme.successSurface }}
        value={value}
      />
    </View>
  );
}

function formatPermissionStatus(status: PushPermissionStatus) {
  switch (status) {
    case "granted":
      return "Push ready";
    case "denied":
      return "Permission denied";
    default:
      return "Push not connected";
  }
}

export function NotificationSettingsCard() {
  const { colorScheme } = useColorScheme();
  const theme = getFinDataMode(colorScheme);
  const permissionStatus = useNotificationPermissionStatus();
  const { settings, setSetting } = useNotificationSettings();
  const pushUnavailable = permissionStatus === "not-configured";

  function updateSetting(key: keyof NotificationSettings) {
    return (value: boolean) => setSetting(key, value);
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: theme.text }]}>
            Notifications
          </Text>
          <Text style={[styles.body, { color: theme.textTertiary }]}>
            Configure how price rule hits should reach you.
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: theme.surfaceContainerLow },
          ]}
        >
          <Ionicons name="cloud-outline" size={14} color={theme.primary} />
          <Text style={[styles.statusText, { color: theme.primary }]}>
            {formatPermissionStatus(permissionStatus)}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <SettingRow
        description="FCM setup is required before push delivery can be enabled."
        disabled={pushUnavailable}
        label="Push delivery"
        onValueChange={updateSetting("pushPriceAlertsEnabled")}
        value={!pushUnavailable && settings.pushPriceAlertsEnabled}
      />
      <SettingRow
        description="Reserve a quiet window for future push delivery."
        label="Quiet hours"
        onValueChange={updateSetting("quietHoursEnabled")}
        value={settings.quietHoursEnabled}
      />
      <SettingRow
        description="Allow audible cues for price hits."
        label="Sound"
        onValueChange={updateSetting("soundEnabled")}
        value={settings.soundEnabled}
      />
      <SettingRow
        description="Allow vibration when a price rule fires."
        label="Vibration"
        onValueChange={updateSetting("vibrationEnabled")}
        value={settings.vibrationEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    padding: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: FIN_DATA_THEME.typography.body,
    lineHeight: 20,
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: FIN_DATA_THEME.typography.caption,
    fontWeight: "700",
  },
  divider: {
    height: 1,
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  disabledRow: {
    opacity: 0.62,
  },
  settingCopy: {
    flex: 1,
    gap: 3,
  },
  settingLabel: {
    fontSize: FIN_DATA_THEME.typography.button,
    fontWeight: "700",
  },
  settingDescription: {
    fontSize: FIN_DATA_THEME.typography.caption,
    lineHeight: 17,
  },
});
