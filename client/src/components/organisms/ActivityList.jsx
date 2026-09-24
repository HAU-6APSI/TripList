import ActivityItem from "../molecules/ActivityItem.jsx";
import { BagIcon, PlusIcon } from "../../lib/icons.jsx";
import styles from "./ActivityList.module.css";

/**
 * ActivityList — organism
 * Props: activities, onToggle(id), onRemove(id), onAdd
 */
const LOCAL_ACTIVITY_IDEAS = [
  { name: "Try sisig at a Kapampangan restaurant", type: "Food" },
  { name: "Find a coffee shop near Clark", type: "Coffee" },
  { name: "Walk through the Santo Rosario heritage district", type: "Heritage" },
  { name: "Watch the sunset at Clark Freeport", type: "Outdoors" },
  { name: "Try a local dessert at Susie's Cuisine", type: "Dessert" },
];

export default function ActivityList({ activities, onToggle, onRemove, onAdd, onQuickAdd }) {
  const completed = activities.filter((activity) => activity.done).length;
  const progress = activities.length ? Math.round((completed / activities.length) * 100) : 0;

  return (
    <div className={styles.card}>
      <h3>
        <BagIcon size={17} />
        <span>Activities</span>
        {activities.length > 0 && (
          <span className={styles.count}>
            {completed}/{activities.length}
          </span>
        )}
      </h3>

      {activities.length > 0 && (
        <div className={styles.progressSummary}>
          <div className={styles.progressCopy}>
            <span>{completed === activities.length ? "All set for this trip" : `${completed} of ${activities.length} activities done`}</span>
            <strong>{progress}%</strong>
          </div>
          <div className={styles.progressTrack} aria-label={`${progress}% of activities completed`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <>
          <p className={styles.emptyText}>Nothing planned yet — start with one of these local ideas.</p>
          <div className={styles.ideaList}>
            {LOCAL_ACTIVITY_IDEAS.map((idea) => (
              <button key={idea.name} type="button" className={styles.idea} onClick={() => onQuickAdd(idea.name)}>
                <span>{idea.name}</span>
                <small>{idea.type} · Angeles City</small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.timeline}>
          {activities.map((a) => (
            <ActivityItem
              key={a.id}
              name={a.name}
              done={a.done}
              onToggle={() => onToggle(a.id)}
              onRemove={() => onRemove(a.id)}
            />
          ))}
        </div>
      )}

      <button className={styles.addRow} onClick={onAdd}>
        <PlusIcon size={15} />
        <span>Add activity</span>
      </button>
    </div>
  );
}
