import { auth } from "@finn-app/auth";
import { checkDatabaseConnection } from "@finn-app/db";
import { env } from "@finn-app/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

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

import { serve } from "@hono/node-server";

await checkDatabaseConnection();

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
