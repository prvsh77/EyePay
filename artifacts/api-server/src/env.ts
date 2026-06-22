import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

try {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(dirname, "../../../.env") });
} catch (e) {
  // Ignored
}
