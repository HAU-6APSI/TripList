import express from "express";
import cors from "cors";
import "dotenv/config";
import { tripsRouter } from "./routes/trips.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()) : true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/ready", async (req, res) => {
  try {
    const { pool } = await import("./db.js");
    await pool.query("select 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not ready" });
  }
});

app.use("/api/trips", tripsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`TripList server listening on http://localhost:${port}`);
});
