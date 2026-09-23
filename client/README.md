# TripList — client

React (Vite) front end for TripList, styled with the "Parul" design
system (see `src/styles/tokens.css`) — a golden-hour theme inspired by
Angeles City's Giant Lantern Festival.

## Structure (atomic design, per M6A2)

```
src/
  components/
    atoms/        Button, Input, Checkbox
    molecules/     FormField, TripCard, DestinationItem, ActivityItem
    organisms/     Navbar, TripForm, TripGrid, DestinationList,
                    ActivityList, TripMap, AddItemModal
  pages/           TripListPage, NewTripPage, TripPage
  lib/
    storage.js     temporary localStorage data layer (see below)
    places.js      quick-add destination suggestions + date formatting
    icons.jsx      shared inline SVG icons
  styles/
    tokens.css     color / type / spacing tokens
    global.css     reset + base styles
  App.jsx          routes
  main.jsx         entry point
```

## Running it

```
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## About `lib/storage.js`

The app currently stores trips in the browser via `localStorage`, so the
UI is fully working on its own before the backend exists. Every function
in `storage.js` (`getTrips`, `createTrip`, `addDestination`,
`toggleActivity`, etc.) is written to match the shape the real
`/api/trips` endpoints will have.

**To connect it to the real Express/Postgres server:** replace the
`import * as store from "./lib/storage.js"` in `App.jsx` with a new
`api.js` module that calls `fetch("/api/trips")` etc. using the same
function names. No component or page needs to change — they only call
`store.xxx()`, never `localStorage` directly.

`vite.config.js` already proxies `/api` requests to
`http://localhost:4000` during development, so once `api.js` exists,
running the Express server alongside `npm run dev` is enough to wire
everything up.
