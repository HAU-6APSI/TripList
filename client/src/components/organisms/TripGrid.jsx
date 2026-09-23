import { useNavigate } from "react-router-dom";
import TripCard from "../molecules/TripCard.jsx";
import Button from "../atoms/Button.jsx";
import { CompassIcon, PlusIcon } from "../../lib/icons.jsx";
import styles from "./TripGrid.module.css";

/**
 * TripGrid — organism
 * Props: trips (array), onNewTrip
 */
export default function TripGrid({ trips, onNewTrip }) {
  const navigate = useNavigate();

  if (trips.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <CompassIcon size={26} />
        </div>
        <h3>No trips yet</h3>
        <p>Start with a name and a date range — you can add destinations and activities once the trip is created.</p>
        <Button variant="primary" onClick={onNewTrip}>
          <PlusIcon size={16} />
          <span>Plan your first trip</span>
        </Button>
      </div>
    );
  }

  const sorted = [...trips].sort((a, b) => (a.start || "").localeCompare(b.start || ""));

  return (
    <div className={styles.grid}>
      {sorted.map((trip) => {
        const destinations = trip.destinations || [];
        return (
          <TripCard
            key={trip.id}
            name={trip.name}
            startDate={trip.start}
            endDate={trip.end}
            destinationCount={destinations.length}
            destinationsDone={destinations.filter((d) => (d.status || (d.done ? "done" : "next")) === "done").length}
            onClick={() => navigate(`/trips/${trip.id}`)}
          />
        );
      })}
    </div>
  );
}
