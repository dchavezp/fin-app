import * as SecureStore from "expo-secure-store";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  NotificationEvent,
  NotificationEventInput,
  NotificationSettings,
} from "./types";

type NotificationHistoryContextValue = {
  events: NotificationEvent[];
  settings: NotificationSettings;
  createEvent: (input: NotificationEventInput) => NotificationEvent;
  markRead: (eventId: string) => void;
  updateSetting: <Key extends keyof NotificationSettings>(
    key: Key,
    value: NotificationSettings[Key],
  ) => void;
};

type NotificationHistoryProviderProps = {
  children: ReactNode;
  userId: string;
};

const DEFAULT_SETTINGS: NotificationSettings = {
  pushPriceAlertsEnabled: false,
  quietHoursEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

const EVENTS_STORAGE_KEY_PREFIX = "finn.notification.events";
const MAX_STORED_EVENTS = 50;
const SETTINGS_STORAGE_KEY_PREFIX = "finn.notification.settings";

const NotificationHistoryContext =
  createContext<NotificationHistoryContextValue | null>(null);

function createNotificationEventId() {
  return `notification_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sortEvents(events: NotificationEvent[]) {
  return [...events].sort(
    (first, second) =>
      new Date(second.occurredAt).getTime() -
      new Date(first.occurredAt).getTime(),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNotificationEvent(value: unknown): value is NotificationEvent {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.symbol === "string" &&
    typeof value.targetPrice === "number" &&
    typeof value.triggerPrice === "number" &&
    (value.direction === "above" || value.direction === "below") &&
    typeof value.occurredAt === "string" &&
    typeof value.read === "boolean" &&
    (value.delivery === "in-app" ||
      value.delivery === "push" ||
      value.delivery === "both")
  );
}

function parseStoredEvents(value: string) {
  const parsed = JSON.parse(value) as unknown;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return sortEvents(parsed.filter(isNotificationEvent)).slice(
    0,
    MAX_STORED_EVENTS,
  );
}

function parseStoredSettings(value: string): NotificationSettings {
  const parsed = JSON.parse(value) as unknown;

  if (!isRecord(parsed)) {
    return DEFAULT_SETTINGS;
  }

  return {
    pushPriceAlertsEnabled: false,
    quietHoursEnabled:
      typeof parsed.quietHoursEnabled === "boolean"
        ? parsed.quietHoursEnabled
        : DEFAULT_SETTINGS.quietHoursEnabled,
    soundEnabled:
      typeof parsed.soundEnabled === "boolean"
        ? parsed.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    vibrationEnabled:
      typeof parsed.vibrationEnabled === "boolean"
        ? parsed.vibrationEnabled
        : DEFAULT_SETTINGS.vibrationEnabled,
  };
}

function getEventsStorageKey(userId: string) {
  return `${EVENTS_STORAGE_KEY_PREFIX}.${userId}`;
}

function getSettingsStorageKey(userId: string) {
  return `${SETTINGS_STORAGE_KEY_PREFIX}.${userId}`;
}

export function NotificationHistoryProvider({
  children,
  userId,
}: NotificationHistoryProviderProps) {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [settings, setSettings] =
    useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      setHydrated(false);
      setEvents([]);
      setSettings(DEFAULT_SETTINGS);

      try {
        const [storedEvents, storedSettings] = await Promise.all([
          SecureStore.getItemAsync(getEventsStorageKey(userId)),
          SecureStore.getItemAsync(getSettingsStorageKey(userId)),
        ]);

        if (!active) {
          return;
        }

        if (storedEvents) {
          setEvents(parseStoredEvents(storedEvents));
        }

        if (storedSettings) {
          setSettings(parseStoredSettings(storedSettings));
        }
      } catch {
        // Ignore malformed local notification state; server sync can replace it later.
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    SecureStore.setItemAsync(
      getEventsStorageKey(userId),
      JSON.stringify(events.slice(0, MAX_STORED_EVENTS)),
    ).catch(() => undefined);
  }, [events, hydrated, userId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    SecureStore.setItemAsync(
      getSettingsStorageKey(userId),
      JSON.stringify(settings),
    ).catch(() => undefined);
  }, [hydrated, settings, userId]);

  const value = useMemo<NotificationHistoryContextValue>(
    () => ({
      events,
      settings,
      createEvent: (input) => {
        const nextEvent: NotificationEvent = {
          id: createNotificationEventId(),
          occurredAt: new Date().toISOString(),
          read: false,
          ...input,
        };

        setEvents((current) =>
          sortEvents([nextEvent, ...current]).slice(0, MAX_STORED_EVENTS),
        );

        return nextEvent;
      },
      markRead: (eventId) => {
        setEvents((current) =>
          current.map((event) =>
            event.id === eventId ? { ...event, read: true } : event,
          ),
        );
      },
      updateSetting: (key, settingValue) => {
        setSettings((current) => ({ ...current, [key]: settingValue }));
      },
    }),
    [events, settings],
  );

  return (
    <NotificationHistoryContext.Provider value={value}>
      {children}
    </NotificationHistoryContext.Provider>
  );
}

export function useNotificationHistory() {
  const context = useContext(NotificationHistoryContext);

  if (!context) {
    throw new Error(
      "useNotificationHistory must be used within NotificationHistoryProvider",
    );
  }

  return context;
}
