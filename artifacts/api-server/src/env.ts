import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

try {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(dirname, "../../../.env") });
} catch (e) {
  // Ignored
}

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is required but was not provided.",
  );
}

// Re-exported as a non-optional string so callers don't need to re-check it.
export const JWT_SECRET: string = process.env.JWT_SECRET;
