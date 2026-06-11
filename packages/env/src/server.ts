import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const parsedEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    CORS_ORIGIN: z.string().min(1),
    FINNHUB_API_KEY: z.string().min(1),
    FCM_SERVICE_ACCOUNT_PATH: z.string().min(1).optional(),
    FCM_SERVICE_ACCOUNT_BASE64: z.string().min(1).optional(),
    FCM_PROJECT_ID: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

if (
  !parsedEnv.FCM_SERVICE_ACCOUNT_BASE64 &&
  !parsedEnv.FCM_SERVICE_ACCOUNT_PATH
) {
  throw new Error(
    "Missing FCM service account configuration. Set FCM_SERVICE_ACCOUNT_BASE64 or FCM_SERVICE_ACCOUNT_PATH.",
  );
}

export const corsOrigins = parsedEnv.CORS_ORIGIN.split(",").map((origin) => {
  const trimmedOrigin = origin.trim();

  z.url().parse(trimmedOrigin);

  return trimmedOrigin;
});

export const env = parsedEnv;
