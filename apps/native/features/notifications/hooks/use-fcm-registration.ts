import { env } from "@finn-app/env/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { authClient } from "@/lib/auth-client";

import type { PushPermissionStatus } from "../types";

function isAndroid(): boolean {
  return Platform.OS === "android";
}

async function setupAndroidChannel() {
  if (!isAndroid()) {
    return;
  }

  await Notifications.setNotificationChannelAsync("price-alerts", {
    name: "Price Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 100, 50, 100],
    sound: "default",
  });
}

async function requestPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return "denied" as PushPermissionStatus;
  }

  return "granted" as PushPermissionStatus;
}

async function getExpoPushToken() {
  const tokenData = await Notifications.getExpoPushTokenAsync({});

  return tokenData.data;
}

async function registerTokenWithServer(token: string) {
  const platform = isAndroid() ? "android" : "ios";
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookies = authClient.getCookie();

  if (cookies) {
    headers.Cookie = cookies;
  }

  try {
    await fetch(
      `${env.EXPO_PUBLIC_SERVER_URL}/api/notifications/register-token`,
      {
        method: "POST",
        credentials: "omit",
        headers,
        body: JSON.stringify({ token, platform }),
      },
    );
  } catch (error) {
    console.error("Failed to register push token:", error);
  }
}

export function useFcmRegistration() {
  const [permissionStatus, setPermissionStatus] =
    useState<PushPermissionStatus>("not-configured");
  const [pushToken, setPushToken] = useState<string | null>(null);
  const registeredTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    async function init() {
      if (!Device.isDevice) {
        if (active) {
          setPermissionStatus("denied");
        }

        return;
      }

      await setupAndroidChannel();
      const status = await requestPermissions();

      if (!active) {
        return;
      }

      setPermissionStatus(status);

      if (status !== "granted") {
        return;
      }

      try {
        const token = await getExpoPushToken();

        if (!active) {
          return;
        }

        setPushToken(token);
      } catch (error) {
        console.error("Failed to get Expo push token:", error);
      }
    }

    init();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pushToken || pushToken === registeredTokenRef.current) {
      return;
    }

    registeredTokenRef.current = pushToken;
    registerTokenWithServer(pushToken);
  }, [pushToken]);

  return { permissionStatus, pushToken };
}
