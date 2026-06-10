import { env } from "@finn-app/env/server";
import pino from "pino";

const isDev = env.NODE_ENV === "development";

export const logger = pino({
  level: isDev ? "debug" : "info",
  ...(isDev && {
    transport: {
      target: "pino/file",
      options: {
        destination: 1,
      },
    },
  }),
});
