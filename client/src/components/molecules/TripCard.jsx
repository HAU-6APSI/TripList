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
  const progress = destinationCount ? Math.round((destinationsDone / destinationCount) * 100) : 0;
  const lowerName = (name || "").toLowerCase();
  const image = lowerName.includes("clark")
    ? "https://commons.wikimedia.org/wiki/Special:FilePath/ClarkAngelesjf9644_32.JPG?width=1000"
    : lowerName.includes("heritage") || lowerName.includes("angeles")
      ? "https://commons.wikimedia.org/wiki/Special:FilePath/Angeles%20Heritage%20District.jpg?width=1000"
      : "https://commons.wikimedia.org/wiki/Special:FilePath/Behind%20Marquee%20Mall.jpg?width=1000";
  const tripState = progress === 100 && destinationCount > 0 ? "Complete" : progress > 0 ? "In progress" : "Ready to plan";

  return (
    <button className={styles.card} onClick={onClick}>
      <span className={styles.washi} aria-hidden="true" />
      <div className={styles.banner} style={{ backgroundImage: `linear-gradient(150deg, rgba(33, 42, 74, 0.3), rgba(59, 35, 39, 0.86)), url("${image}")` }}>
        <span className={styles.placeLabel}>Angeles City · Pampanga</span>
        <span className={styles.stamp}>
          <PinIcon size={18} />
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{name || "Untitled trip"}</div>
        <div className={styles.dates}>
          {formatShortDate(startDate)} – {formatDate(endDate)}
        </div>
        <div className={styles.state}>{tripState}</div>
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
        {destinationCount > 0 && (
          <div className={styles.progressTrack} aria-label={`${progress}% of destinations complete`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </button>
  );
}
