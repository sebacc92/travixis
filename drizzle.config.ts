import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration for migrations and schema push.
 *
 * Common commands:
 *   pnpm drizzle-kit generate   → generate SQL migration files
 *   pnpm drizzle-kit migrate    → apply pending migrations to Turso
 *   pnpm drizzle-kit push       → push schema directly (dev only)
 *   pnpm drizzle-kit studio     → open Drizzle Studio in the browser
 *
 * Environment variables required:
 *   PRIVATE_TURSO_DATABASE_URL  – libsql:// or file: URL
 *   PRIVATE_TURSO_AUTH_TOKEN    – auth token (not required for local file:)
 */
export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.PRIVATE_TURSO_DATABASE_URL!,
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
  },
});
