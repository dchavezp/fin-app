export type NotificationDirection = "above" | "below";

export type NotificationDelivery = "in-app" | "push" | "both";

export type NotificationEvent = {
  id: string;
  ruleId?: string;
  symbol: string;
  targetPrice: number;
  triggerPrice: number;
  direction: NotificationDirection;
  occurredAt: string;
  read: boolean;
  delivery: NotificationDelivery;
};

export type NotificationEventInput = Omit<
  NotificationEvent,
  "id" | "occurredAt" | "read"
> & {
  occurredAt?: string;
};

export type NotificationSettings = {
  pushPriceAlertsEnabled: boolean;
  quietHoursEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

export type PushPermissionStatus = "not-configured" | "granted" | "denied";
