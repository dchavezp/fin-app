import { auth } from "@finn-app/auth";
import { Hono } from "hono";

import {
  stockDetailParamsSchema,
  stockListQuerySchema,
  stockSearchQuerySchema,
} from "./stocks.schema";
import {
  getStockDetail,
  getStockList,
  searchStocks,
  toApiError,
} from "./stocks.service";

export const stocksRoutes = new Hono()
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
    const parsed = stockListQuerySchema.safeParse(c.req.query());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const stocks = await getStockList(parsed.data.filter, parsed.data.limit);

      return c.json({ data: stocks });
    } catch (error) {
      const apiError = toApiError(error);
      c.status(apiError.status as 400 | 404 | 500 | 502);

      return c.json({ error: apiError.message });
    }
  })
  .get("/search", async (c) => {
    const parsed = stockSearchQuerySchema.safeParse(c.req.query());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const stocks = await searchStocks(
        parsed.data.q,
        parsed.data.filter,
        parsed.data.limit,
      );

      return c.json({ data: stocks });
    } catch (error) {
      const apiError = toApiError(error);
      c.status(apiError.status as 400 | 404 | 500 | 502);

      return c.json({ error: apiError.message });
    }
  })
  .get("/:symbol", async (c) => {
    const parsed = stockDetailParamsSchema.safeParse(c.req.param());

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    try {
      const stock = await getStockDetail(parsed.data.symbol);

      return c.json({ data: stock });
    } catch (error) {
      const apiError = toApiError(error);
      c.status(apiError.status as 400 | 404 | 500 | 502);

      return c.json({ error: apiError.message });
    }
  });
