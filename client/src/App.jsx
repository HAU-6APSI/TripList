import { useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import TripListPage from "./pages/TripListPage.jsx";
import NewTripPage from "./pages/NewTripPage.jsx";
import TripPage from "./pages/TripPage.jsx";
import * as store from "./lib/storage.js";

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

  useEffect(() => {
    setTrips(store.getTrips());
  }, []);

  function refresh() {
    setTrips(store.getTrips());
  }

  function handleCreate(values) {
    const trip = store.createTrip(values);
    refresh();
    return trip;
  }

  return (
    <Routes>
      <Route path="/" element={<TripListPage trips={trips} />} />
      <Route path="/trips/new" element={<NewTripPage onCreate={handleCreate} />} />
      <Route path="/trips/:id" element={<TripPageRoute trips={trips} refresh={refresh} />} />
    </Routes>
  );
}

/**
 * Looks up the trip named in the URL and hands TripPage a fully bound
 * set of callbacks, so TripPage itself doesn't need to know the trip id.
 */
function TripPageRoute({ trips, refresh }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);

  return (
    <TripPage
      trip={trip}
      onUpdateTrip={(patch) => {
        store.updateTrip(id, patch);
        refresh();
      }}
      onDeleteTrip={() => {
        store.deleteTrip(id);
        refresh();
        navigate("/");
      }}
      onAddDestination={(values) => {
        store.addDestination(id, values);
        refresh();
      }}
      onToggleDestination={(destId) => {
        store.toggleDestination(id, destId);
        refresh();
      }}
      onUpdateDestinationStatus={(destId, status) => {
        store.updateDestinationStatus(id, destId, status);
        refresh();
      }}
      onRemoveDestination={(destId) => {
        store.removeDestination(id, destId);
        refresh();
      }}
      onAddActivity={(values) => {
        store.addActivity(id, values);
        refresh();
      }}
      onToggleActivity={(actId) => {
        store.toggleActivity(id, actId);
        refresh();
      }}
      onRemoveActivity={(actId) => {
        store.removeActivity(id, actId);
        refresh();
      }}
      onUpdateNotes={(notes) => {
        store.updateNotes(id, notes);
        // Not calling refresh() here on purpose: TripPage manages its own
        // notes textarea state while typing, so re-rendering the whole
        // trip on every keystroke isn't needed and would fight the
        // debounce in TripPage's handleNotesChange.
      }}
    />
  );
}
