import * as alertsService from "@/modules/alerts/alerts.service";
import * as notificationsService from "@/modules/notifications/notifications.service";

import { sendPushNotificationToMultipleTokens } from "./fcm.service";

const RECENTLY_TRIGGERED = new Map<string, number>();
const DEDUP_WINDOW_MS = 300_000;

function isWithinDedupWindow(alertId: string): boolean {
  const lastTriggered = RECENTLY_TRIGGERED.get(alertId);

  if (!lastTriggered) {
    return false;
  }

  return Date.now() - lastTriggered < DEDUP_WINDOW_MS;
}

function markTriggered(alertId: string) {
  RECENTLY_TRIGGERED.set(alertId, Date.now());
}

export type TradeData = {
  symbol: string;
  price: number;
  time: number;
};

export async function evaluateAlert(trade: TradeData) {
  const alerts = await alertsService.getUntriggeredAlertsBySymbol(trade.symbol);

  if (alerts.length === 0) {
    return;
  }

  for (const alert of alerts) {
    if (isWithinDedupWindow(alert.id)) {
      continue;
    }

    const triggered =
      alert.direction === "above"
        ? trade.price >= alert.targetPrice
        : trade.price <= alert.targetPrice;

    if (!triggered) {
      continue;
    }

    await alertsService.markAlertTriggered(alert.id);
    markTriggered(alert.id);

    const tokens = await notificationsService.getDeviceTokensByUserId(
      alert.userId,
    );

    if (tokens.length === 0) {
      continue;
    }

    const tokenValues = tokens.map((t) => t.token);
    const directionLabel = alert.direction === "above" ? "above" : "below";
    const title = `Price Alert: ${alert.symbol}`;
    const body = `${alert.symbol} traded at $${trade.price.toFixed(2)} — ${directionLabel} your target of $${alert.targetPrice}.`;

    sendPushNotificationToMultipleTokens(tokenValues, title, body, {
      symbol: alert.symbol,
      alertId: alert.id,
      triggerPrice: String(trade.price),
      targetPrice: String(alert.targetPrice),
      direction: alert.direction,
      type: "price_alert",
    }).catch((error) => {
      console.error(`FCM send failed for alert ${alert.id}:`, error);
    });
  }
}
