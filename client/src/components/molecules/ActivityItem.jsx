import Checkbox from "../atoms/Checkbox.jsx";
import { TrashIcon } from "../../lib/icons.jsx";
import styles from "./ActivityItem.module.css";

/**
 * ActivityItem — molecule
 * Props: name, done, onToggle, onRemove
 */
export default function ActivityItem({ name, done, onToggle, onRemove }) {
  return (
    <div className={styles.row}>
      <Checkbox
        checked={done}
        onChange={onToggle}
        label={done ? `Mark ${name} as not done` : `Mark ${name} as done`}
      />
      <div className={styles.text}>
        <div className={`${styles.name} ${done ? styles.done : ""}`}>{name}</div>
      </div>
      <button className={styles.remove} onClick={onRemove} aria-label={`Remove ${name}`}>
        <TrashIcon size={15} />
      </button>
    </div>
  );
}
