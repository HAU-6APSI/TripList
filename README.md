# TripList

TripList helps people plan trips around Angeles City, Pampanga.

Live site: https://hau-6apsi.github.io/TripList/

## What it does

- Create trips with dates.
- Add destinations, activities, and notes.
- Mark destinations as Next, OTW, or Done.
- View destinations on Google Maps.
- Start directions to a destination.
- Get local ideas for sisig, coffee, restaurants, breakfast, desserts, and nightlife.

## Run the client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

The default mode uses browser storage. No database is needed for this mode.

## Run the API

The API needs Node.js 20 or newer and PostgreSQL 17.

```bash
cd server
npm install
copy .env.example .env
npm run db:init
npm run dev
```

The API runs at `http://localhost:4000`.

Set these values in `client/.env` to use the API:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your_restricted_browser_key
```

Never commit a real password, database URL, or API key.

## Project structure

```text
client/      React and Vite front end
server/      Express and PostgreSQL API
docs/        Reports and project documents
compose.yml  Local PostgreSQL and API setup
```

## Current status

The demo client is live and working. The real API is implemented but still needs a hosted PostgreSQL database and API deployment.

See [server/README.md](server/README.md) for API routes and [AI-USAGE.md](AI-USAGE.md) for AI use.
