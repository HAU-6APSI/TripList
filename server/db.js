import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Copy .env.example to .env and fill in your Postgres connection string."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
