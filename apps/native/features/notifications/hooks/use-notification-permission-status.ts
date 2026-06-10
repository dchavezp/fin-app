import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

import type { PushPermissionStatus } from "../types";

export function useNotificationPermissionStatus(): PushPermissionStatus {
  const [status, setStatus] = useState<PushPermissionStatus>("not-configured");

  useEffect(() => {
    let active = true;

    async function check() {
      if (!Device.isDevice) {
        if (active) {
          setStatus("denied");
        }

        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (!active) {
        return;
      }

      if (existingStatus === "granted") {
        setStatus("granted");
      } else if (existingStatus === "denied") {
        setStatus("denied");
      } else {
        setStatus("not-configured");
      }
    }

    check();

    return () => {
      active = false;
    };
  }, []);

  return status;
}
