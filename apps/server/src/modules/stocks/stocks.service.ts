import { env } from "@finn-app/env/server";

import type { StockFilter } from "./stocks.schema";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_CACHE = new Map<string, { data: unknown; expiresAt: number }>();
const MAX_CACHE_ENTRIES = 200;
const POPULAR_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "AMD",
  "NFLX",
  "PLTR",
  "INTC",
  "JPM",
];

interface FinnhubSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface FinnhubSearchResponse {
  count: number;
  result: FinnhubSearchResult[];
}

interface FinnhubQuoteResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

interface FinnhubProfileResponse {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface StockListItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number | null;
  currency: string | null;
  initials: string;
}

export interface StockDetail {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap: number | null;
  currency: string | null;
  industry: string | null;
  country: string | null;
  website: string | null;
  ipo: string | null;
  logoUrl: string | null;
  initials: string;
}

function normalizeMarketCap(value: number | null | undefined) {
  if (!value) {
    return null;
  }

  // Finnhub returns market capitalization in millions.
  return value * 1_000_000;
}

function pruneCache(now: number) {
  for (const [key, value] of FINNHUB_CACHE.entries()) {
    if (value.expiresAt <= now) {
      FINNHUB_CACHE.delete(key);
    }
  }

  while (FINNHUB_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = FINNHUB_CACHE.keys().next().value;

    if (!oldestKey) {
      break;
    }

    FINNHUB_CACHE.delete(oldestKey);
  }
}

class FinnhubError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "FinnhubError";
  }
}

async function fetchFinnhub<T>(
  path: string,
  query: Record<string, string>,
  ttlMs = 30_000,
): Promise<T> {
  const url = new URL(`${FINNHUB_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  url.searchParams.set("token", env.FINNHUB_API_KEY);
  const cacheKey = url.toString();
  const cached = FINNHUB_CACHE.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  if (cached) {
    FINNHUB_CACHE.delete(cacheKey);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new FinnhubError(
      `Finnhub request failed with status ${response.status}`,
    );
  }

  const data = (await response.json()) as T;
  pruneCache(now);
  FINNHUB_CACHE.set(cacheKey, {
    data,
    expiresAt: now + ttlMs,
  });

  return data;
}

function getInitials(name: string, symbol: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9]/g, "");
  const initials = cleaned.slice(0, 2).toUpperCase();

  if (initials.length === 2) {
    return initials;
  }

  return symbol
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeListItem(
  quote: FinnhubQuoteResponse,
  profile: FinnhubProfileResponse | null,
  searchResult: FinnhubSearchResult | null,
  symbol: string,
): StockListItem {
  const name = profile?.name || searchResult?.description || symbol;
  const exchange = profile?.exchange || "US";

  return {
    symbol,
    name,
    exchange,
    price: quote.c || 0,
    change: quote.d || 0,
    changePercent: quote.dp || 0,
    marketCap: normalizeMarketCap(profile?.marketCapitalization),
    currency: profile?.currency ?? null,
    initials: getInitials(name, symbol),
  };
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

function applyFilter(
  stocks: StockListItem[],
  filter: StockFilter,
  limit: number,
) {
  const baseList = [...stocks];

  switch (filter) {
    case "gainers":
      return baseList
        .filter((stock) => stock.changePercent >= 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, limit);
    case "losers":
      return baseList
        .filter((stock) => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, limit);
    case "large-cap":
      return baseList
        .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
        .slice(0, limit);
    default:
      return baseList.slice(0, limit);
  }
}

async function loadQuote(symbol: string) {
  return fetchFinnhub<FinnhubQuoteResponse>("/quote", { symbol }, 15_000);
}

async function loadProfile(symbol: string) {
  const profile = await fetchFinnhub<FinnhubProfileResponse>(
    "/stock/profile2",
    {
      symbol,
    },
    300_000,
  );

  if (!profile.ticker && !profile.name) {
    return null;
  }

  return profile;
}

async function loadSummaryForSymbol(
  symbol: string,
  searchResult: FinnhubSearchResult | null,
) {
  const [quote, profile] = await Promise.all([
    loadQuote(symbol),
    loadProfile(symbol),
  ]);

  return normalizeListItem(quote, profile, searchResult, symbol);
}

export async function getStockList(filter: StockFilter, limit: number) {
  const settledItems = await Promise.allSettled(
    POPULAR_SYMBOLS.map((symbol) => loadSummaryForSymbol(symbol, null)),
  );
  const items = settledItems.filter(isFulfilled).map((result) => result.value);

  if (items.length === 0) {
    throw new FinnhubError("Unable to load stock data");
  }

  return applyFilter(items, filter, limit);
}

export async function searchStocks(
  query: string,
  filter: StockFilter,
  limit: number,
) {
  const response = await fetchFinnhub<FinnhubSearchResponse>(
    "/search",
    {
      q: query,
    },
    15_000,
  );

  const matches = response.result
    .filter((result) => result.symbol && result.description)
    .filter((result) => result.type === "Common Stock" || result.type === "ETP")
    .slice(0, Math.max(limit * 3, limit));

  const settledItems = await Promise.allSettled(
    matches.map((result) => loadSummaryForSymbol(result.symbol, result)),
  );
  const items = settledItems.filter(isFulfilled).map((result) => result.value);

  if (matches.length > 0 && items.length === 0) {
    throw new FinnhubError("Unable to load stock data");
  }

  return applyFilter(items, filter, limit);
}

export async function getStockDetail(symbol: string): Promise<StockDetail> {
  const normalizedSymbol = symbol.toUpperCase();
  const [quote, profile] = await Promise.all([
    loadQuote(normalizedSymbol),
    loadProfile(normalizedSymbol),
  ]);

  if (!profile) {
    throw new FinnhubError(`Stock ${normalizedSymbol} was not found`, 404);
  }

  return {
    symbol: normalizedSymbol,
    name: profile.name || normalizedSymbol,
    exchange: profile.exchange || "US",
    price: quote.c || 0,
    change: quote.d || 0,
    changePercent: quote.dp || 0,
    high: quote.h || 0,
    low: quote.l || 0,
    open: quote.o || 0,
    previousClose: quote.pc || 0,
    marketCap: normalizeMarketCap(profile.marketCapitalization),
    currency: profile.currency ?? null,
    industry: profile.finnhubIndustry || null,
    country: profile.country || null,
    website: profile.weburl || null,
    ipo: profile.ipo || null,
    logoUrl: profile.logo || null,
    initials: getInitials(profile.name || normalizedSymbol, normalizedSymbol),
  };
}

export function toApiError(error: unknown) {
  if (error instanceof FinnhubError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  return {
    message: "Unable to load stock data",
    status: 500,
  };
}
