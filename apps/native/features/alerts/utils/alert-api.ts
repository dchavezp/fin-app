import { env } from "@finn-app/env/native";

import { authClient } from "@/lib/auth-client";

import type { StockAlert, StockAlertInput } from "../types";

class AlertApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlertApiError";
  }
}

async function fetchJson<T>(
  path: string,
  options?: { body?: unknown; method?: string; signal?: AbortSignal },
) {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cookies = authClient.getCookie();

  if (cookies) {
    headers.Cookie = cookies;
  }

  const response = await fetch(`${env.EXPO_PUBLIC_SERVER_URL}${path}`, {
    credentials: "omit",
    headers,
    method: options?.method ?? "GET",
    body: options?.body ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
  });

  const payload = (await response.json().catch(() => null)) as {
    data?: T;
    error?: string | { fieldErrors?: Record<string, string[]> };
  } | null;

  if (!response.ok) {
    const errorMessage =
      typeof payload?.error === "string" ? payload.error : "Request failed";

    throw new AlertApiError(errorMessage);
  }

  return payload?.data ?? null;
}

export function fetchAlerts(signal?: AbortSignal) {
  return fetchJson<StockAlert[]>("/api/alerts", { signal });
}

export function createAlert(input: StockAlertInput) {
  return fetchJson<StockAlert>("/api/alerts", {
    method: "POST",
    body: input,
  });
}

export function updateAlert(alertId: string, input: Partial<StockAlertInput>) {
  return fetchJson<StockAlert>(`/api/alerts/${encodeURIComponent(alertId)}`, {
    method: "PUT",
    body: input,
  });
}

export function deleteAlert(alertId: string) {
  return fetchJson<StockAlert>(`/api/alerts/${encodeURIComponent(alertId)}`, {
    method: "DELETE",
  });
}
