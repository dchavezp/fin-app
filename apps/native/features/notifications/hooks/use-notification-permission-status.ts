import type { PushPermissionStatus } from "../types";

export function useNotificationPermissionStatus(): PushPermissionStatus {
  return "not-configured";
}
