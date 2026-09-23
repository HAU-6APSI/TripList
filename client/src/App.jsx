import { useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import TripListPage from "./pages/TripListPage.jsx";
import NewTripPage from "./pages/NewTripPage.jsx";
import TripPage from "./pages/TripPage.jsx";
import * as store from "./lib/storage.js";
import * as apiStore from "./lib/tripApi.js";
import { googleMapsDirectionsUrl } from "./lib/googleMaps.js";

/**
 * App — top-level routing and state.
 *
 * Trip data currently lives in the browser via lib/storage.js. Once the
 * Express/Postgres API exists, swap the `store` import for one that
 * calls fetch("/api/trips") etc. — every function below keeps the same
 * name and shape, so no page or component needs to change.
 */
export default function App() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const dataStore = import.meta.env.VITE_USE_MOCK_API === "false" ? apiStore : store;

  useEffect(() => {
    dataStore.getTrips().then(setTrips).catch((err) => setError(err.message));
  }, []);

  async function refresh() {
    setTrips(await dataStore.getTrips());
  }

  async function handleCreate(values) {
    const trip = await dataStore.createTrip(values);
    await refresh();
    return trip;
  }

  if (error) return <main className="container"><p>{error}</p></main>;

  return (
    <Routes>
      <Route path="/" element={<TripListPage trips={trips} />} />
      <Route path="/trips/new" element={<NewTripPage onCreate={handleCreate} />} />
      <Route path="/trips/:id" element={<TripPageRoute trips={trips} refresh={refresh} dataStore={dataStore} />} />
    </Routes>
  );
}

/**
 * Looks up the trip named in the URL and hands TripPage a fully bound
 * set of callbacks, so TripPage itself doesn't need to know the trip id.
 */
function TripPageRoute({ trips, refresh, dataStore }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);

  return (
    <TripPage
      trip={trip}
      onUpdateTrip={async (patch) => {
        await dataStore.updateTrip(id, patch);
        await refresh();
      }}
      onDeleteTrip={async () => {
        await dataStore.deleteTrip(id);
        await refresh();
        navigate("/");
      }}
      onAddDestination={async (values) => {
        await dataStore.addDestination(id, values);
        await refresh();
      }}
      onToggleDestination={async (destId) => {
        await dataStore.toggleDestination(id, destId);
        await refresh();
      }}
      onUpdateDestinationStatus={async (destId, status) => {
        await dataStore.updateDestinationStatus(id, destId, status);
        await refresh();
      }}
      onStartNavigation={(destination) => {
        if (!destination) return;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => window.open(googleMapsDirectionsUrl(destination, {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }), "_blank", "noopener,noreferrer"),
            () => window.open(googleMapsDirectionsUrl(destination), "_blank", "noopener,noreferrer"),
            { enableHighAccuracy: true, timeout: 5000 },
          );
        } else {
          window.open(googleMapsDirectionsUrl(destination), "_blank", "noopener,noreferrer");
        }
      }}
      onRemoveDestination={async (destId) => {
        await dataStore.removeDestination(id, destId);
        await refresh();
      }}
      onAddActivity={async (values) => {
        await dataStore.addActivity(id, values);
        await refresh();
      }}
      onToggleActivity={async (actId) => {
        await dataStore.toggleActivity(id, actId);
        await refresh();
      }}
      onRemoveActivity={async (actId) => {
        await dataStore.removeActivity(id, actId);
        await refresh();
      }}
      onUpdateNotes={async (notes) => {
        await dataStore.updateNotes(id, notes);
        // Not calling refresh() here on purpose: TripPage manages its own
        // notes textarea state while typing, so re-rendering the whole
        // trip on every keystroke isn't needed and would fight the
        // debounce in TripPage's handleNotesChange.
      }}
    />
  );
}
