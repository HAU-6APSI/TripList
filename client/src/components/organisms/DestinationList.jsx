import DestinationItem from "../molecules/DestinationItem.jsx";
import { PinIcon, PlusIcon } from "../../lib/icons.jsx";
import { PLACES } from "../../lib/places.js";
import styles from "./DestinationList.module.css";

/**
 * DestinationList — organism
 * Props: destinations, onToggle(id), onRemove(id), onAdd (opens the Add
 * Destination form/modal), onQuickAdd(name) (adds a suggested place directly)
 */
export default function DestinationList({ destinations, onToggle, onUpdateStatus, onRemove, onAdd, onQuickAdd }) {
  const suggestions = PLACES.filter((p) => !destinations.some((d) => d.name === p.name));

  return (
    <div className={styles.card}>
      <h3>
        <PinIcon size={17} />
        <span>Destinations</span>
        {destinations.length > 0 && (
          <span className={styles.count}>
            {destinations.filter((d) => (d.status || (d.done ? "done" : "next")) === "done").length}/{destinations.length}
          </span>
        )}
      </h3>

      {destinations.length === 0 ? (
        <p className={styles.emptyText}>No destinations yet — add one below or pick a quick suggestion.</p>
      ) : (
        <div className={styles.timeline}>
          {destinations.map((d) => (
            <DestinationItem
              key={d.id}
              name={d.name}
              notes={d.notes}
              status={d.status || (d.done ? "done" : "next")}
              onToggle={() => onToggle(d.id)}
              onUpdateStatus={(status) => onUpdateStatus(d.id, status)}
              onRemove={() => onRemove(d.id)}
            />
          ))}
        </div>
      )}

      <button className={styles.addRow} onClick={onAdd}>
        <PlusIcon size={15} />
        <span>Add destination</span>
      </button>

      {suggestions.length > 0 && (
        <div className={styles.chipRow}>
          {suggestions.map((p) => (
            <button key={p.name} type="button" className={styles.chip} onClick={() => onQuickAdd(p.name)}>
              <PlusIcon size={12} /> {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
