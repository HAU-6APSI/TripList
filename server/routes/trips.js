import { Router } from "express";
import { pool } from "../db.js";

export const tripsRouter = Router();

// Shapes every trip the same way the client's lib/storage.js does, so
// the frontend doesn't need to change when it switches from
// localStorage to this API: { id, name, start, end, notes, destinations, activities }
function shapeTrip(row, destinations, activities) {
  return {
    id: row.id,
    name: row.name,
    start: row.start_date,
    end: row.end_date,
    notes: row.notes,
    destinations: destinations.map((d) => ({ id: d.id, name: d.name, notes: d.notes, done: d.done })),
    activities: activities.map((a) => ({ id: a.id, name: a.name, done: a.done })),
  };
}

async function loadFullTrip(id) {
  const tripRes = await pool.query("select * from trips where id = $1", [id]);
  if (tripRes.rows.length === 0) return null;
  const [destRes, actRes] = await Promise.all([
    pool.query("select * from destinations where trip_id = $1 order by created_at asc", [id]),
    pool.query("select * from activities where trip_id = $1 order by created_at asc", [id]),
  ]);
  return shapeTrip(tripRes.rows[0], destRes.rows, actRes.rows);
}

// GET /api/trips — list all trips, each with its destinations/activities
tripsRouter.get("/", async (req, res) => {
  try {
    const tripsRes = await pool.query("select * from trips order by start_date asc");
    const trips = await Promise.all(tripsRes.rows.map((row) => loadFullTrip(row.id)));
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load trips." });
  }
});

// POST /api/trips — create a trip
tripsRouter.post("/", async (req, res) => {
  const { name, start, end } = req.body;
  if (!name || !start || !end) {
    return res.status(400).json({ error: "name, start, and end are required." });
  }
  try {
    const result = await pool.query(
      "insert into trips (name, start_date, end_date) values ($1, $2, $3) returning id",
      [name, start, end]
    );
    const trip = await loadFullTrip(result.rows[0].id);
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trip." });
  }
});

// GET /api/trips/:id
tripsRouter.get("/:id", async (req, res) => {
  try {
    const trip = await loadFullTrip(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found." });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load trip." });
  }
});

// PUT /api/trips/:id — update name / dates / notes
tripsRouter.put("/:id", async (req, res) => {
  const { name, start, end, notes } = req.body;
  try {
    const existing = await pool.query("select * from trips where id = $1", [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Trip not found." });
    const current = existing.rows[0];
    await pool.query(
      "update trips set name = $1, start_date = $2, end_date = $3, notes = $4 where id = $5",
      [
        name ?? current.name,
        start ?? current.start_date,
        end ?? current.end_date,
        notes ?? current.notes,
        req.params.id,
      ]
    );
    const trip = await loadFullTrip(req.params.id);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update trip." });
  }
});

// DELETE /api/trips/:id
tripsRouter.delete("/:id", async (req, res) => {
  try {
    await pool.query("delete from trips where id = $1", [req.params.id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete trip." });
  }
});

// ---------- destinations ----------

// POST /api/trips/:id/destinations
tripsRouter.post("/:id/destinations", async (req, res) => {
  const { name, notes = "" } = req.body;
  if (!name) return res.status(400).json({ error: "name is required." });
  try {
    await pool.query("insert into destinations (trip_id, name, notes) values ($1, $2, $3)", [
      req.params.id,
      name,
      notes,
    ]);
    const trip = await loadFullTrip(req.params.id);
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add destination." });
  }
});

// PATCH /api/trips/:id/destinations/:destId — toggle done or edit fields
tripsRouter.patch("/:id/destinations/:destId", async (req, res) => {
  const { name, notes, done } = req.body;
  try {
    const existing = await pool.query("select * from destinations where id = $1 and trip_id = $2", [
      req.params.destId,
      req.params.id,
    ]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Destination not found." });
    const current = existing.rows[0];
    await pool.query("update destinations set name = $1, notes = $2, done = $3 where id = $4", [
      name ?? current.name,
      notes ?? current.notes,
      done ?? current.done,
      req.params.destId,
    ]);
    const trip = await loadFullTrip(req.params.id);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update destination." });
  }
});

// DELETE /api/trips/:id/destinations/:destId
tripsRouter.delete("/:id/destinations/:destId", async (req, res) => {
  try {
    await pool.query("delete from destinations where id = $1 and trip_id = $2", [
      req.params.destId,
      req.params.id,
    ]);
    const trip = await loadFullTrip(req.params.id);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove destination." });
  }
});

// ---------- activities ----------

// POST /api/trips/:id/activities
tripsRouter.post("/:id/activities", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required." });
  try {
    await pool.query("insert into activities (trip_id, name) values ($1, $2)", [req.params.id, name]);
    const trip = await loadFullTrip(req.params.id);
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add activity." });
  }
});

// PATCH /api/trips/:id/activities/:actId — toggle done or edit name
tripsRouter.patch("/:id/activities/:actId", async (req, res) => {
  const { name, done } = req.body;
  try {
    const existing = await pool.query("select * from activities where id = $1 and trip_id = $2", [
      req.params.actId,
      req.params.id,
    ]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Activity not found." });
    const current = existing.rows[0];
    await pool.query("update activities set name = $1, done = $2 where id = $3", [
      name ?? current.name,
      done ?? current.done,
      req.params.actId,
    ]);
    const trip = await loadFullTrip(req.params.id);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update activity." });
  }
});

// DELETE /api/trips/:id/activities/:actId
tripsRouter.delete("/:id/activities/:actId", async (req, res) => {
  try {
    await pool.query("delete from activities where id = $1 and trip_id = $2", [
      req.params.actId,
      req.params.id,
    ]);
    const trip = await loadFullTrip(req.params.id);
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove activity." });
  }
});
