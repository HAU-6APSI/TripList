// Temporary client-side data layer.
//
// This lets the UI work end-to-end before the Express/Postgres backend
// exists. Every function here is written to match the shape the real
// /api/trips endpoints will have, so swapping this module for one that
// calls `fetch("/api/trips")` etc. should not require changing any
// component — see api.js (TODO) once the backend is ready.

const STORAGE_KEY = "triplist:trips";
export const DESTINATION_STATUSES = ["next", "otw", "done"];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function readAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map((trip) => ({
          ...trip,
          destinations: (trip.destinations || []).map((destination) => ({
            ...destination,
            status: DESTINATION_STATUSES.includes(destination.status)
              ? destination.status
              : destination.done
                ? "done"
                : "next",
          })),
        }))
      : [];
  } catch {
    return [];
  }
}

function writeAll(trips) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — state still
    // holds for the current session, it just won't persist on reload.
  }
}

export function getTrips() {
  return readAll();
}

export function getTrip(id) {
  return readAll().find((t) => t.id === id) || null;
}

export function createTrip({ name, start, end }) {
  const trips = readAll();
  const trip = { id: uid(), name, start, end, destinations: [], activities: [], notes: "" };
  trips.push(trip);
  writeAll(trips);
  return trip;
}

export function updateTrip(id, patch) {
  const trips = readAll();
  const trip = trips.find((t) => t.id === id);
  if (!trip) return null;
  Object.assign(trip, patch);
  writeAll(trips);
  return trip;
}

export function deleteTrip(id) {
  const trips = readAll().filter((t) => t.id !== id);
  writeAll(trips);
}

function withTrip(id, fn) {
  const trips = readAll();
  const trip = trips.find((t) => t.id === id);
  if (!trip) return null;
  fn(trip);
  writeAll(trips);
  return trip;
}

export function addDestination(tripId, { name, notes = "" }) {
  return withTrip(tripId, (trip) => {
    trip.destinations = trip.destinations || [];
    trip.destinations.push({ id: uid(), name, notes, status: "next" });
  });
}

export function toggleDestination(tripId, destId) {
  return withTrip(tripId, (trip) => {
    const item = (trip.destinations || []).find((d) => d.id === destId);
    if (item) item.status = item.status === "done" ? "next" : "done";
  });
}

export function updateDestinationStatus(tripId, destId, status) {
  if (!DESTINATION_STATUSES.includes(status)) return null;
  return withTrip(tripId, (trip) => {
    const item = (trip.destinations || []).find((d) => d.id === destId);
    if (item) item.status = status;
  });
}

export function removeDestination(tripId, destId) {
  return withTrip(tripId, (trip) => {
    trip.destinations = (trip.destinations || []).filter((d) => d.id !== destId);
  });
}

export function addActivity(tripId, { name }) {
  return withTrip(tripId, (trip) => {
    trip.activities = trip.activities || [];
    trip.activities.push({ id: uid(), name, done: false });
  });
}

export function toggleActivity(tripId, actId) {
  return withTrip(tripId, (trip) => {
    const item = (trip.activities || []).find((a) => a.id === actId);
    if (item) item.done = !item.done;
  });
}

export function removeActivity(tripId, actId) {
  return withTrip(tripId, (trip) => {
    trip.activities = (trip.activities || []).filter((a) => a.id !== actId);
  });
}

export function updateNotes(tripId, notes) {
  return withTrip(tripId, (trip) => {
    trip.notes = notes;
  });
}
