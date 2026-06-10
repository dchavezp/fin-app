import { env } from "@finn-app/env/server";
import WebSocket from "ws";

import { logger } from "@/lib/logger";
import { evaluateAlert } from "@/modules/notifications/alert-evaluator";

const FINNHUB_WS_URL = "wss://ws.finnhub.io";

type FinnhubTradeMessage = {
  type: "trade";
  data: Array<{
    s: string;
    p: number;
    t: number;
    v: number;
    c: Array<string>;
  }>;
};

let ws: WebSocket | null = null;
const subscribedSymbols = new Set<string>();
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 120_000;
const RATE_LIMITED_BASE_DELAY = 60_000;

let isRateLimited = false;

function getReconnectDelay(error?: Error): number {
  if (error?.message.includes("429") || isRateLimited) {
    isRateLimited = true;

    return RATE_LIMITED_BASE_DELAY;
  }

  return Math.min(1000 * 2 ** reconnectAttempts, MAX_RECONNECT_DELAY);
}

function handleMessage(raw: WebSocket.RawData) {
  try {
    const message = JSON.parse(raw.toString()) as FinnhubTradeMessage;

    if (message.type !== "trade") {
      return;
    }

    for (const trade of message.data) {
      evaluateAlert({
        symbol: trade.s,
        price: trade.p,
        time: trade.t,
      }).catch((error) => {
        logger.error({ symbol: trade.s, error }, "alert evaluation failed");
      });
    }
  } catch (error) {
    logger.error({ error }, "failed to parse Finnhub WebSocket message");
  }
}

function handleClose(code?: number, reason?: string) {
  ws = null;
  scheduleReconnect(undefined, code, reason);
}

function handleError(error: Error) {
  logger.error({ error: error.message }, "Finnhub WebSocket error");

  if (error.message.includes("429")) {
    isRateLimited = true;
  }
}

function scheduleReconnect(
  error?: Error,
  closeCode?: number,
  closeReason?: string,
) {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  const delay = getReconnectDelay(error);

  logger.info(
    { delay, reconnectAttempts, closeCode, closeReason, isRateLimited },
    "scheduling Finnhub WebSocket reconnect",
  );

  reconnectTimer = setTimeout(() => {
    reconnectAttempts += 1;
    isRateLimited = false;
    connect();
  }, delay);
}

function connect() {
  if (isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    const url = `${FINNHUB_WS_URL}?token=${env.FINNHUB_API_KEY}`;

    ws = new WebSocket(url);

    ws.on("open", () => {
      isConnecting = false;
      reconnectAttempts = 0;

      for (const symbol of subscribedSymbols) {
        ws?.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });

    ws.on("message", handleMessage);
    ws.on("close", handleClose);
    ws.on("error", (error: Error) => {
      handleError(error);
      handleClose(undefined, error.message);
    });
  } catch (error) {
    isConnecting = false;
    logger.error({ error }, "failed to create Finnhub WebSocket");
    scheduleReconnect();
  }
}

export function startWebSocket() {
  if (ws || isConnecting) {
    return;
  }

  connect();
}

export function stopWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (ws) {
    ws.close();
    ws = null;
  }

  isConnecting = false;
  reconnectAttempts = 0;
}

export function subscribeSymbol(symbol: string) {
  const normalized = symbol.toUpperCase();

  if (subscribedSymbols.has(normalized)) {
    return;
  }

  subscribedSymbols.add(normalized);

  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "subscribe", symbol: normalized }));
  }
}

export function unsubscribeSymbol(symbol: string) {
  const normalized = symbol.toUpperCase();

  if (!subscribedSymbols.has(normalized)) {
    return;
  }

  subscribedSymbols.delete(normalized);

  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "unsubscribe", symbol: normalized }));
  }
}

export function getSubscribedSymbols(): string[] {
  return Array.from(subscribedSymbols);
}

export function setSubscribedSymbols(symbols: string[]) {
  const newSet = new Set(symbols.map((s) => s.toUpperCase()));

  for (const symbol of subscribedSymbols) {
    if (!newSet.has(symbol)) {
      unsubscribeSymbol(symbol);
    }
  }

  for (const symbol of newSet) {
    if (!subscribedSymbols.has(symbol)) {
      subscribeSymbol(symbol);
    }
  }
}
