# TripList client

This folder contains the React and Vite front end.

## Run it

```bash
npm install
npm run dev
```

The app uses browser storage by default. Set `VITE_USE_MOCK_API=false` in `.env` to use the Express API.

## Main folders

```text
src/components/  Reusable interface parts
src/pages/       Trip list, new trip, and trip detail pages
src/lib/         Storage, API, maps, places, and icons
src/styles/      Shared design tokens and global styles
```

The Google Maps key is optional for demo mode. Use a restricted key in `VITE_GOOGLE_MAPS_API_KEY` for live map features.
