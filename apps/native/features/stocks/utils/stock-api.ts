import { env } from "@finn-app/env/native";

import { authClient } from "@/lib/auth-client";

import type {
  StockDetailResponse,
  StockFilter,
  StockListResponse,
} from "../types";

class StockApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockApiError";
  }
}

async function fetchJson<T>(path: string, signal?: AbortSignal) {
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  const cookies = authClient.getCookie();

  if (cookies) {
    headers.Cookie = cookies;
  }

  const response = await fetch(`${env.EXPO_PUBLIC_SERVER_URL}${path}`, {
    credentials: "omit",
    headers,
    signal,
  });

  const payload = (await response.json().catch(() => null)) as {
    data?: T;
    error?: string;
  } | null;

  if (!response.ok || !payload?.data) {
    throw new StockApiError(payload?.error || "Unable to load stock data");
  }

  return payload.data;
}

export function fetchStocks(
  filter: StockFilter,
  query: string,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    filter,
    limit: "12",
  });

  if (query.trim().length > 0) {
    params.set("q", query.trim());
    return fetchJson<StockListResponse["data"]>(
      `/api/stocks/search?${params.toString()}`,
      signal,
    );
  }

  return fetchJson<StockListResponse["data"]>(
    `/api/stocks?${params.toString()}`,
    signal,
  );
}

export function fetchStockDetail(symbol: string, signal?: AbortSignal) {
  return fetchJson<StockDetailResponse["data"]>(
    `/api/stocks/${encodeURIComponent(symbol)}`,
    signal,
  );
}
