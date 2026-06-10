import { auth } from "@finn-app/auth";
import { Hono } from "hono";

import {
  alertParamsSchema,
  createAlertSchema,
  updateAlertSchema,
} from "./alerts.schema";
import * as alertsService from "./alerts.service";

export const alertsRoutes = new Hono()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  })
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const alerts = await alertsService.getAlertsByUser(session.user.id);

      return c.json({ data: alerts });
    } catch (_error) {
      return c.json({ error: "Failed to fetch alerts" }, 500);
    }
  })
  .post("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = createAlertSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const alert = await alertsService.createAlert(
        session.user.id,
        parsed.data,
      );

      return c.json({ data: alert }, 201);
    } catch (_error) {
      return c.json({ error: "Failed to create alert" }, 500);
    }
  })
  .put("/:id", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const params = alertParamsSchema.safeParse(c.req.param());

    if (!params.success) {
      return c.json({ error: params.error.flatten() }, 400);
    }

    const parsed = updateAlertSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const alert = await alertsService.updateAlert(
        params.data.id,
        session.user.id,
        parsed.data,
      );

      if (!alert) {
        return c.json({ error: "Alert not found" }, 404);
      }

      return c.json({ data: alert });
    } catch (_error) {
      return c.json({ error: "Failed to update alert" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const params = alertParamsSchema.safeParse(c.req.param());

    if (!params.success) {
      return c.json({ error: params.error.flatten() }, 400);
    }

    try {
      const alert = await alertsService.deleteAlert(
        params.data.id,
        session.user.id,
      );

      if (!alert) {
        return c.json({ error: "Alert not found" }, 404);
      }

      return c.json({ data: alert });
    } catch (_error) {
      return c.json({ error: "Failed to delete alert" }, 500);
    }
  });
