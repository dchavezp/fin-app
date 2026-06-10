import { env } from "@finn-app/env/server";
import WebSocket from "ws";

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
const MAX_RECONNECT_DELAY = 30_000;

function getReconnectDelay(): number {
  const delay = Math.min(1000 * 2 ** reconnectAttempts, MAX_RECONNECT_DELAY);

  return delay;
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
        console.error(`Alert evaluation failed for ${trade.s}:`, error);
      });
    }
  } catch (error) {
    console.error("Failed to parse Finnhub WebSocket message:", error);
  }
}

function handleClose() {
  ws = null;
  scheduleReconnect();
}

function handleError(error: Error) {
  console.error("Finnhub WebSocket error:", error.message);
}

function scheduleReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  const delay = getReconnectDelay();

  reconnectTimer = setTimeout(() => {
    reconnectAttempts += 1;
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
      handleClose();
    });
  } catch (error) {
    isConnecting = false;
    console.error("Failed to create Finnhub WebSocket:", error);
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
