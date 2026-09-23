import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { pool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Schema applied.");
  await pool.end();
}

main().catch((err) => {
  console.error("Failed to apply schema:", err.message);
  process.exit(1);
});
