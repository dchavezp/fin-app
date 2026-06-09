import { env } from "@finn-app/env/server";

import type { StockFilter, StockHistoryRange } from "./stocks.schema";

const MOCK_BASE_PRICES: Record<string, number> = {
  AAPL: 218,
  MSFT: 468,
  NVDA: 130,
  AMZN: 215,
  GOOGL: 195,
  META: 565,
  TSLA: 265,
  AMD: 165,
  NFLX: 720,
  PLTR: 32,
  INTC: 32,
  JPM: 225,
};

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

interface FinnhubEarningResult {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
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
  shareOutstanding: number | null;
  initials: string;
}

export interface StockHistoryPoint {
  close: number;
  time: number;
}

export interface StockHistory {
  points: StockHistoryPoint[];
  range: StockHistoryRange;
  resolution: string;
  symbol: string;
}

export interface EarningResult {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateMockPoints(
  basePrice: number,
  count: number,
  volatility: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const points: StockHistoryPoint[] = [];
  let price = basePrice;
  const secondsPerPoint = Math.floor((24 * 60 * 60) / count);

  for (let index = count - 1; index >= 0; index -= 1) {
    const time = nowSeconds - index * secondsPerPoint;
    price += (rand() - 0.5) * volatility;

    if (price < 1) {
      price = 1;
    }

    points.push({ close: Math.round(price * 100) / 100, time });
  }

  return points;
}

function getMockConfig(range: StockHistoryRange) {
  switch (range) {
    case "1W":
      return { count: 7, volatility: 4 };
    case "1M":
      return { count: 22, volatility: 3 };
    case "1Y":
      return { count: 52, volatility: 5 };
    default:
      return { count: 26, volatility: 2 };
  }
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
      response.status,
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

async function loadHistory(symbol: string, range: StockHistoryRange) {
  const basePrice = MOCK_BASE_PRICES[symbol] ?? 150;
  const config = getMockConfig(range);
  const seed =
    symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
    range.charCodeAt(1);
  const points = generateMockPoints(
    basePrice,
    config.count,
    config.volatility,
    seed,
  );

  return {
    points,
    range,
    resolution: "mock",
    symbol,
  } satisfies StockHistory;
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
    shareOutstanding: profile.shareOutstanding ?? null,
    initials: getInitials(profile.name || normalizedSymbol, normalizedSymbol),
  };
}

export async function getStockHistory(
  symbol: string,
  range: StockHistoryRange,
): Promise<StockHistory> {
  const normalizedSymbol = symbol.toUpperCase();

  return loadHistory(normalizedSymbol, range);
}

export async function getStockEarnings(
  symbol: string,
): Promise<EarningResult[]> {
  const normalizedSymbol = symbol.toUpperCase();
  const results = await fetchFinnhub<FinnhubEarningResult[]>(
    "/stock/earnings",
    { symbol: normalizedSymbol, limit: "8" },
    300_000,
  );

  return results.map((item) => ({
    actual: item.actual,
    estimate: item.estimate,
    period: item.period,
    quarter: item.quarter,
    surprise: item.surprise,
    surprisePercent: item.surprisePercent,
    symbol: item.symbol,
    year: item.year,
  }));
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
