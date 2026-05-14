/**
 * Drizzle ORM client for Turso (libSQL).
 *
 * Usage inside a server$ / routeLoader$ / routeAction$:
 *
 *   import { getDb } from "~/db";
 *
 *   export const useMyLoader = routeLoader$(async (ev) => {
 *     const db = getDb(ev);
 *     return db.select().from(users).all();
 *   });
 */

import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type DrizzleDb = LibSQLDatabase<typeof schema>;

/**
 * Creates a Drizzle database instance bound to the current request's
 * environment variables (Turso URL + auth token).
 *
 * Pass a `RequestEventBase` (available in loaders, actions and server$).
 */
export function getDb(requestEvent: RequestEventBase): DrizzleDb {
  const url = requestEvent.env.get("PRIVATE_TURSO_DATABASE_URL")?.trim();
  if (!url) throw new Error("PRIVATE_TURSO_DATABASE_URL is not defined");

  const authToken = requestEvent.env.get("PRIVATE_TURSO_AUTH_TOKEN")?.trim();
  if (!authToken && !url.includes("file:")) {
    throw new Error("PRIVATE_TURSO_AUTH_TOKEN is not defined");
  }

  const client = createClient({ url, authToken });
  return drizzle(client, { schema });
}

// Re-export schema for convenience
export * from "./schema";
