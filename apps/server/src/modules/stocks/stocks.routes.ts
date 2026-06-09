import { auth } from "@finn-app/auth";
import { Hono } from "hono";

import {
  stockDetailParamsSchema,
  stockHistoryQuerySchema,
  stockListQuerySchema,
  stockSearchQuerySchema,
} from "./stocks.schema";
import {
  getStockDetail,
  getStockEarnings,
  getStockHistory,
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
  .get("/:symbol/earnings", async (c) => {
    const params = stockDetailParamsSchema.safeParse(c.req.param());

    if (!params.success) {
      return c.json({ error: params.error.flatten() }, 400);
    }

    try {
      const earnings = await getStockEarnings(params.data.symbol);

      return c.json({ data: earnings });
    } catch (error) {
      const apiError = toApiError(error);
      c.status(apiError.status as 400 | 404 | 500 | 502);

      return c.json({ error: apiError.message });
    }
  })
  .get("/:symbol/history", async (c) => {
    const params = stockDetailParamsSchema.safeParse(c.req.param());
    const query = stockHistoryQuerySchema.safeParse(c.req.query());

    if (!params.success) {
      return c.json({ error: params.error.flatten() }, 400);
    }

    if (!query.success) {
      return c.json({ error: query.error.flatten() }, 400);
    }

    try {
      const history = await getStockHistory(
        params.data.symbol,
        query.data.range,
      );

      return c.json({ data: history });
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
