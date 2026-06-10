import { auth } from "@finn-app/auth";
import { checkDatabaseConnection, db, priceAlert } from "@finn-app/db";
import { env } from "@finn-app/env/server";
import { serve } from "@hono/node-server";
import { isNull } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { alertsRoutes } from "@/modules/alerts/alerts.routes";
import { notificationsRoutes } from "@/modules/notifications/notifications.routes";
import {
  setSubscribedSymbols,
  startWebSocket,
} from "@/modules/stocks/finnhub-websocket";
import { stocksRoutes } from "@/modules/stocks/stocks.routes";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/alerts", alertsRoutes);
app.route("/api/notifications", notificationsRoutes);
app.route("/api/stocks", stocksRoutes);

app.get("/health", async (c) => {
  try {
    await checkDatabaseConnection();

    return c.json({ ok: true, database: "connected" });
  } catch {
    return c.json({ ok: false, database: "disconnected" }, 503);
  }
});

app.get("/", (c) => {
  return c.text("OK");
});

export type AppType = typeof app;

await checkDatabaseConnection();

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);

    startWebSocket();
    refreshWebSocketSubscriptions();
    setInterval(refreshWebSocketSubscriptions, 60_000);
  },
);

async function refreshWebSocketSubscriptions() {
  try {
    const rows = await db
      .select({ symbol: priceAlert.symbol })
      .from(priceAlert)
      .where(isNull(priceAlert.triggeredAt));

    const symbols = [...new Set(rows.map((r) => r.symbol))];

    setSubscribedSymbols(symbols);
  } catch (error) {
    console.error("Failed to refresh WebSocket subscriptions:", error);
  }
}
