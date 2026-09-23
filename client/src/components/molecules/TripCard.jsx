import { PinIcon, CheckIcon } from "../../lib/icons.jsx";
import { formatDate, formatShortDate } from "../../lib/places.js";
import styles from "./TripCard.module.css";

/**
 * TripCard — molecule
 * Props: name, startDate, endDate, destinationCount, destinationsDone, onClick
 */
export default function TripCard({
  name,
  startDate,
  endDate,
  destinationCount = 0,
  destinationsDone = 0,
  onClick,
}) {
  return (
    <button className={styles.card} onClick={onClick}>
      <span className={styles.washi} aria-hidden="true" />
      <div className={styles.banner}>
        <span className={styles.stamp}>
          <PinIcon size={18} />
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{name || "Untitled trip"}</div>
        <div className={styles.dates}>
          {formatShortDate(startDate)} – {formatDate(endDate)}
        </div>
        <div className={styles.meta}>
          <span>
            <PinIcon size={12} /> {destinationCount} {destinationCount === 1 ? "place" : "places"}
          </span>
          {destinationCount > 0 && (
            <span>
              <CheckIcon size={12} /> {destinationsDone}/{destinationCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
