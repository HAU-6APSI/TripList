# TripList server

This folder contains the Express and PostgreSQL API.

## Setup

Use Node.js 20 or newer and PostgreSQL 17.

```bash
npm install
copy .env.example .env
npm run db:init
npm run dev
```

The server runs at `http://localhost:4000`.

## Environment

```env
DATABASE_URL=postgres://user:password@localhost:5432/triplist
PORT=4000
CORS_ORIGINS=http://localhost:5173
```

Use placeholders only. Never commit a real password.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the server is running |
| GET | `/api/ready` | Check that the database is reachable |
| GET | `/api/trips` | List trips |
| POST | `/api/trips` | Create a trip |
| GET | `/api/trips/:id` | Get one trip |
| PUT | `/api/trips/:id` | Update a trip or notes |
| DELETE | `/api/trips/:id` | Delete a trip |
| POST | `/api/trips/:id/destinations` | Add a destination |
| PATCH | `/api/trips/:id/destinations/:destId` | Update a destination or status |
| DELETE | `/api/trips/:id/destinations/:destId` | Delete a destination |
| POST | `/api/trips/:id/activities` | Add an activity |
| PATCH | `/api/trips/:id/activities/:actId` | Toggle an activity |
| DELETE | `/api/trips/:id/activities/:actId` | Delete an activity |

Destinations can store a status, address, latitude, and longitude.
