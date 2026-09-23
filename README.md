# TripList

Plan weekend trips around Angeles City. A finals project for CS 401,
Holy Angel University School of Computing.

Two folders:

- `client/` — React (Vite) front end, styled with the "Parul" design
  system (see `client/src/styles/tokens.css`).
- `server/` — Express + PostgreSQL API.

## Current status

The UI is fully built and working end-to-end right now using a
temporary `localStorage` data layer (`client/src/lib/storage.js`), so
you can run just the client and use the whole app immediately:

```
cd client
npm install
npm run dev
```

The real backend (`server/`) is also built — routes for trips,
destinations, and activities, backed by Postgres — but the client isn't
wired to it yet. See `client/README.md` and `server/README.md` for how
to connect them (it's a small, deliberate swap: one new `api.js` file
replacing `storage.js`, same function names throughout).

## Setting this up as your own GitHub repo

1. Create your repo from `HAU-6APSI/final-project-template` ("Use this
   template"), set it to **public**.
2. Copy `client/` and `server/` (and this README, and `.gitignore`)
   into it.
3. Do **not** commit a real `.env` file or your name/student
   number/email anywhere in this repo — see the finals brief.
4. Commit as you go, so `project/REPORT.md` in your workspace has real
   commits to point to.
