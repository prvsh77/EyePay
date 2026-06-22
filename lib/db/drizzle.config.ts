import { defineConfig } from "drizzle-kit";
import { join } from "path";

try {
  process.loadEnvFile(join(import.meta.dirname, "../../.env"));
} catch (e) {
  // Ignore error if file doesn't exist
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/eyepay",
  },
});
