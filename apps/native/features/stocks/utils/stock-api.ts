import { env } from "@finn-app/env/native";

import { authClient } from "@/lib/auth-client";

import type {
  EarningsResponse,
  StockChartRange,
  StockDetailResponse,
  StockFilter,
  StockHistoryResponse,
  StockListItem,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStockListItem(value: unknown): value is StockListItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.symbol === "string" &&
    typeof value.name === "string" &&
    typeof value.exchange === "string" &&
    isFiniteNumber(value.price) &&
    isFiniteNumber(value.change) &&
    isFiniteNumber(value.changePercent) &&
    (value.marketCap === null || isFiniteNumber(value.marketCap)) &&
    (value.currency === null || typeof value.currency === "string") &&
    typeof value.initials === "string"
  );
}

function parseStockListItems(value: unknown) {
  if (!Array.isArray(value) || !value.every(isStockListItem)) {
    throw new StockApiError("Unable to load stock data");
  }

  return value;
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

export function fetchWatchlist(signal?: AbortSignal) {
  return fetchJson<unknown>("/api/stocks/watchlist", signal).then(
    parseStockListItems,
  );
}

export function fetchStockDetail(symbol: string, signal?: AbortSignal) {
  return fetchJson<StockDetailResponse["data"]>(
    `/api/stocks/${encodeURIComponent(symbol)}`,
    signal,
  );
}

export function fetchStockEarnings(symbol: string, signal?: AbortSignal) {
  return fetchJson<EarningsResponse["data"]>(
    `/api/stocks/${encodeURIComponent(symbol)}/earnings`,
    signal,
  );
}

export function fetchStockHistory(
  symbol: string,
  range: StockChartRange,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    range,
  });

  return fetchJson<StockHistoryResponse["data"]>(
    `/api/stocks/${encodeURIComponent(symbol)}/history?${params.toString()}`,
    signal,
  );
}
