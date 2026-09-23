import { TrashIcon } from "../../lib/icons.jsx";
import styles from "./DestinationItem.module.css";

/**
 * DestinationItem — molecule
 * Props: name, notes, status, onUpdateStatus, onRemove
 */
const STATUS_OPTIONS = [
  { value: "next", label: "Next" },
  { value: "otw", label: "OTW" },
  { value: "done", label: "Done" },
];

export default function DestinationItem({ name, notes, address, status, onUpdateStatus, onRemove }) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <div className={`${styles.name} ${status === "done" ? styles.done : ""}`}>{name}</div>
        {address && address !== notes && <div className={styles.address}>{address}</div>}
        {notes && <div className={styles.notes}>{notes}</div>}
      </div>
      <div className={styles.statuses} role="group" aria-label={`Status for ${name}`}>
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.status} ${styles[option.value]} ${status === option.value ? styles.active : ""}`}
            onClick={() => onUpdateStatus(option.value)}
            aria-pressed={status === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button className={styles.remove} onClick={onRemove} aria-label={`Remove ${name}`}>
        <TrashIcon size={15} />
      </button>
    </div>
  );
}
