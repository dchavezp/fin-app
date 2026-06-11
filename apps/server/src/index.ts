import { auth } from "@finn-app/auth";
import { checkDatabaseConnection, db, priceAlert } from "@finn-app/db";
import { corsOrigins } from "@finn-app/env/server";
import { serve } from "@hono/node-server";
import { isNull } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";

import { logger } from "@/lib/logger";

import { alertsRoutes } from "@/modules/alerts/alerts.routes";
import { notificationsRoutes } from "@/modules/notifications/notifications.routes";
import {
  setSubscribedSymbols,
  startWebSocket,
} from "@/modules/stocks/finnhub-websocket";
import { stocksRoutes } from "@/modules/stocks/stocks.routes";

const app = new Hono();
const port = getPort();

app.use(honoLogger());
app.use(
  "/*",
  cors({
    origin: corsOrigins,
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

serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port,
  },
  (info) => {
    logger.info({ port: info.port }, "server started");

    checkDatabaseConnection().catch((error) => {
      logger.error({ error }, "database connection failed at startup");
    });

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
    logger.error({ error }, "failed to refresh WebSocket subscriptions");
  }
}

function getPort() {
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}
