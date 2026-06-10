import { useNotificationHistory } from "../notification-history-context";
import type { NotificationSettings } from "../types";

export function useNotificationSettings() {
  const { settings, updateSetting } = useNotificationHistory();

  function setSetting<Key extends keyof NotificationSettings>(
    key: Key,
    value: NotificationSettings[Key],
  ) {
    updateSetting(key, value);
  }

  return {
    settings,
    setSetting,
  };
}
