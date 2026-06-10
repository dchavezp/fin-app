import { auth } from "@finn-app/auth";
import { Hono } from "hono";

import {
  registerTokenSchema,
  unregisterTokenSchema,
} from "./notifications.schema";
import * as notificationsService from "./notifications.service";

export const notificationsRoutes = new Hono()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  })
  .post("/register-token", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = registerTokenSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const token = await notificationsService.registerDeviceToken(
        session.user.id,
        parsed.data,
      );

      return c.json({ data: token }, 201);
    } catch (_error) {
      return c.json({ error: "Failed to register token" }, 500);
    }
  })
  .delete("/unregister-token", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = unregisterTokenSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      await notificationsService.unregisterDeviceToken(
        session.user.id,
        parsed.data.token,
      );

      return c.json({ success: true });
    } catch (_error) {
      return c.json({ error: "Failed to unregister token" }, 500);
    }
  });
