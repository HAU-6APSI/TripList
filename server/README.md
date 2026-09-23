# TripList — server

Express + PostgreSQL API for TripList.

## Setup

1. Have a Postgres database ready (local install, or a free hosted one
   like Neon, Supabase, or Railway).
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`.
3. Install dependencies and create the tables:

   ```
   npm install
   npm run db:init
   ```

4. Run the server:

   ```
   npm run dev
   ```

   Listens on `http://localhost:4000` by default.

## Endpoints

| Method | Path                                   | Does                              |
|--------|-----------------------------------------|------------------------------------|
| GET    | /api/health                             | Health check                       |
| GET    | /api/trips                              | List all trips                     |
| POST   | /api/trips                              | Create a trip `{name, start, end}` |
| GET    | /api/trips/:id                          | Get one trip                       |
| PUT    | /api/trips/:id                          | Update name/dates/notes            |
| DELETE | /api/trips/:id                          | Delete a trip                      |
| POST   | /api/trips/:id/destinations             | Add a destination `{name, notes}`  |
| PATCH  | /api/trips/:id/destinations/:destId     | Edit/toggle a destination          |
| DELETE | /api/trips/:id/destinations/:destId     | Remove a destination               |
| POST   | /api/trips/:id/activities               | Add an activity `{name}`           |
| PATCH  | /api/trips/:id/activities/:actId        | Edit/toggle an activity            |
| DELETE | /api/trips/:id/activities/:actId        | Remove an activity                 |

Every trip response is shaped `{id, name, start, end, notes, destinations, activities}`
— the same shape the client's temporary `lib/storage.js` already uses,
so wiring the frontend to this API later is a drop-in swap (see the
client README).

## Connecting the client

In `client/src/App.jsx`, replace:

```js
import * as store from "./lib/storage.js";
```

with a new `client/src/lib/api.js` that exposes the same function names
(`getTrips`, `createTrip`, `addDestination`, ...) but calls `fetch("/api/trips")`
instead of `localStorage`. The Vite dev server already proxies `/api` to
this server (see `client/vite.config.js`).
