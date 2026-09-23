// Temporary client-side data layer.
//
// This lets the UI work end-to-end before the Express/Postgres backend
// exists. Every function here is written to match the shape the real
// /api/trips endpoints will have, so swapping this module for one that
// calls `fetch("/api/trips")` etc. should not require changing any
// component — see api.js (TODO) once the backend is ready.

const STORAGE_KEY = "triplist:trips";
const DEMO_SEEDED_KEY = "triplist:demo-seeded";
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

function createStarterTrip() {
  return {
    id: uid(),
    name: "Clark",
    start: "2026-11-12",
    end: "2026-11-17",
    destinations: [
      {
        id: uid(),
        name: "Clark Museum",
        notes: "Start the trip with local history and culture.",
        address: "Clark Museum, Clark Freeport Zone, Pampanga",
        lat: 15.1857,
        lng: 120.5454,
        status: "next",
      },
      {
        id: uid(),
        name: "Marquee Mall",
        notes: "Coffee stop and easy first-day shopping.",
        address: "Marquee Mall, Angeles City, Pampanga",
        lat: 15.1696,
        lng: 120.5881,
        status: "otw",
      },
      {
        id: uid(),
        name: "Holy Rosary Parish (Pisamban Maragul)",
        notes: "Visit the heritage district around Santo Rosario.",
        address: "Holy Rosary Parish, Angeles City, Pampanga",
        lat: 15.1455,
        lng: 120.5881,
        status: "done",
      },
    ],
    activities: [
      { id: uid(), name: "Try sisig at a local Kapampangan restaurant", done: false },
      { id: uid(), name: "Find a coffee shop near Clark", done: false },
    ],
    notes: "Remember to try sisig, leave room for coffee, and check the map before each stop.",
  };
}

export function getTrips() {
  const trips = readAll();
  if (trips.length > 0 || window.localStorage.getItem(DEMO_SEEDED_KEY)) return trips;
  const starterTrip = createStarterTrip();
  writeAll([starterTrip]);
  try {
    window.localStorage.setItem(DEMO_SEEDED_KEY, "true");
  } catch {
    // The trip still works for the current session if storage is unavailable.
  }
  return [starterTrip];
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

export function addDestination(tripId, { name, notes = "", address = "", lat = null, lng = null }) {
  return withTrip(tripId, (trip) => {
    trip.destinations = trip.destinations || [];
    trip.destinations.push({ id: uid(), name, notes, address, lat, lng, status: "next" });
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
