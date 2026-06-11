import { env } from "@finn-app/env/server";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import * as schema from "./schema";

export function createDb() {
  return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();

export async function checkDatabaseConnection() {
  await db.execute(sql`select 1`);
}

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "packages/db/src/migrations",
  });
}

export { schema };

export const { priceAlert, priceAlertRelations } = schema;
export const { deviceToken, deviceTokenRelations } = schema;
