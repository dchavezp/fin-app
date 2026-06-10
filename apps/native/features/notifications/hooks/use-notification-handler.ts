import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { useNotificationHistory } from "../notification-history-context";
import type { NotificationEventInput } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationData = {
  type?: string;
  alertId?: string;
  symbol?: string;
  triggerPrice?: string;
  targetPrice?: string;
  direction?: string;
};

function handleNotificationTap(
  data: NotificationData,
  router: ReturnType<typeof useRouter>,
) {
  if (data.type === "price_alert" && data.alertId) {
    router.push(`/alerts/${data.alertId}`);
  }
}

function parseNotificationData(
  data: Record<string, string | string[]> | undefined,
): NotificationData | null {
  if (!data) {
    return null;
  }

  const result: NotificationData = {};

  if (typeof data.type === "string") {
    result.type = data.type;
  }

  if (typeof data.alertId === "string") {
    result.alertId = data.alertId;
  }

  if (typeof data.symbol === "string") {
    result.symbol = data.symbol;
  }

  if (typeof data.triggerPrice === "string") {
    result.triggerPrice = data.triggerPrice;
  }

  if (typeof data.targetPrice === "string") {
    result.targetPrice = data.targetPrice;
  }

  if (typeof data.direction === "string") {
    result.direction = data.direction;
  }

  return result;
}

export function useNotificationHandler() {
  const router = useRouter();
  const { createEvent } = useNotificationHistory();
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);
  const receivedListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    receivedListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = parseNotificationData(
          notification.request.content.data as Record<
            string,
            string | string[]
          >,
        );

        if (data?.type !== "price_alert" || !data.symbol) {
          return;
        }

        const event: NotificationEventInput = {
          symbol: data.symbol,
          targetPrice: Number(data.targetPrice ?? 0),
          triggerPrice: Number(data.triggerPrice ?? 0),
          direction: (data.direction ?? "above") as "above" | "below",
          delivery: "push",
          ruleId: data.alertId,
          occurredAt: new Date().toISOString(),
        };

        createEvent(event);
      },
    );

    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = parseNotificationData(
          response.notification.request.content.data as Record<
            string,
            string | string[]
          >,
        );

        if (data) {
          handleNotificationTap(data, router);
        }
      });

    return () => {
      if (receivedListenerRef.current) {
        receivedListenerRef.current.remove();
      }

      if (responseListenerRef.current) {
        responseListenerRef.current.remove();
      }
    };
  }, [router, createEvent]);
}
