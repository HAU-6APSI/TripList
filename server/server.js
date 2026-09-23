import express from "express";
import cors from "cors";
import "dotenv/config";
import { tripsRouter } from "./routes/trips.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/trips", tripsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`TripList server listening on http://localhost:${port}`);
});
