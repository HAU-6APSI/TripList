import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import TripForm from "../components/organisms/TripForm.jsx";
import DestinationList from "../components/organisms/DestinationList.jsx";
import ActivityList from "../components/organisms/ActivityList.jsx";
import TripMap from "../components/organisms/TripMap.jsx";
import AddItemModal from "../components/organisms/AddItemModal.jsx";
import Button from "../components/atoms/Button.jsx";
import { CalendarIcon, EditIcon, TrashIcon } from "../lib/icons.jsx";
import { formatDate } from "../lib/places.js";
import styles from "./TripPage.module.css";

/**
 * TripPage — page (route: /trips/:id)
 * Props: trip, onUpdateTrip(patch), onDeleteTrip, onAddDestination, onToggleDestination,
 *        onUpdateDestinationStatus, onRemoveDestination, onAddActivity, onToggleActivity,
 *        onRemoveActivity, onUpdateNotes
 */
export default function TripPage({
  trip,
  onUpdateTrip,
  onDeleteTrip,
  onAddDestination,
  onToggleDestination,
  onUpdateDestinationStatus,
  onStartNavigation,
  onRemoveDestination,
  onAddActivity,
  onToggleActivity,
  onRemoveActivity,
  onUpdateNotes,
}) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [modal, setModal] = useState(null); // "destination" | "activity" | null
  const [notesValue, setNotesValue] = useState(trip?.notes || "");
  const [savedHint, setSavedHint] = useState("Saved automatically");
  const [completionNotice, setCompletionNotice] = useState(false);
  const notesTimer = useRef(null);
  const previousCompleted = useRef(null);

  useEffect(() => () => clearTimeout(notesTimer.current), []);

  useEffect(() => {
    const currentDestinations = trip?.destinations || [];
    const completed = currentDestinations.filter((destination) => (destination.status || (destination.done ? "done" : "next")) === "done").length;
    const allDone = currentDestinations.length > 0 && completed === currentDestinations.length;
    if (previousCompleted.current !== null && completed > previousCompleted.current && allDone) {
      setCompletionNotice(true);
    }
    previousCompleted.current = completed;
  }, [trip]);

  if (!trip) {
    return (
      <>
        <div className={styles.duskband}>
          <Navbar backTo="/" />
        </div>
        <main className="container">
          <div className={styles.notFound}>
            <h3>Trip not found</h3>
            <p>This trip may have been deleted.</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Back to trips
            </Button>
          </div>
        </main>
      </>
    );
  }

  const destinations = trip.destinations || [];
  const activities = trip.activities || [];
  const completedDestinations = destinations.filter((destination) => (destination.status || (destination.done ? "done" : "next")) === "done").length;
  const allDestinationsDone = destinations.length > 0 && completedDestinations === destinations.length;

  function handleNotesChange(e) {
    const value = e.target.value;
    setNotesValue(value);
    setSavedHint("Saving...");
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      onUpdateNotes(value);
      setSavedHint("Saved automatically");
    }, 400);
  }

  function handleDelete() {
    if (window.confirm("Delete this trip? This can't be undone.")) {
      onDeleteTrip();
      navigate("/");
    }
  }

  if (editing) {
    return (
      <>
        <div className={styles.duskband}>
          <Navbar backTo="/" />
        </div>
        <main className="container">
          <div className={styles.formWrap}>
            <TripForm
              trip={trip}
              onSubmit={(values) => {
                onUpdateTrip(values);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className={styles.duskband}>
        <Navbar backTo="/" />
        <section className={`${styles.heroMini} container`}>
          <div className={styles.heroEyebrow}>Angeles City · Pampanga, Philippines</div>
          <h1>{trip.name}</h1>
          <div className={styles.dates}>
            <CalendarIcon size={14} />
            <span>
              {formatDate(trip.start)} – {formatDate(trip.end)}
            </span>
          </div>
          <div className={styles.heroActions}>
            <Button variant="ghost" onClick={() => setEditing(true)}>
              <EditIcon size={15} />
              <span>Edit</span>
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon size={15} />
              <span>Delete</span>
            </Button>
          </div>
        </section>
      </div>

      <main className="container">
        {completionNotice && allDestinationsDone && (
          <section className={styles.completionNotice} role="status">
            <div className={styles.completionIcon}>✓</div>
            <div className={styles.completionText}>
              <strong>Trip destinations complete!</strong>
              <span>You finished all {completedDestinations} place{completedDestinations === 1 ? "" : "s"} for {trip.name}.</span>
              <small>{activities.filter((activity) => !activity.done).length ? `${activities.filter((activity) => !activity.done).length} activities still to do.` : "Your activities are complete too."}</small>
            </div>
            <button type="button" onClick={() => setCompletionNotice(false)} aria-label="Dismiss completion notice">×</button>
          </section>
        )}
        <div className={styles.layout}>
          <div>
            <DestinationList
              destinations={destinations}
              onToggle={onToggleDestination}
              onUpdateStatus={onUpdateDestinationStatus}
              onStartNavigation={onStartNavigation}
              onRemove={onRemoveDestination}
              onAdd={() => setModal("destination")}
              onQuickAdd={(name) => onAddDestination({ name, notes: "" })}
            />
            <ActivityList
              activities={activities}
              onToggle={onToggleActivity}
              onRemove={onRemoveActivity}
              onAdd={() => setModal("activity")}
              onQuickAdd={(name) => onAddActivity({ name })}
            />
            <div className={styles.notesCard}>
              <div className={styles.notesHeader}>
                <div>
                  <h3 className={styles.notesHeading}>Trip notes</h3>
                  <p className={styles.notesSub}>Keep the small details close.</p>
                </div>
                <span className={styles.noteCount}>{notesValue.length} characters</span>
              </div>
              <textarea
                className={styles.notesArea}
                value={notesValue}
                onChange={handleNotesChange}
                placeholder="Packing reminders, booking numbers, anything to remember..."
              />
              <div className={styles.notesFooter}>
                <span className={styles.savedHint}>{savedHint}</span>
                <span>Autosaves as you type</span>
              </div>
              <div className={styles.noteStarters}>
                {[
                  "Places to visit: ",
                  "Food to try: ",
                  "Things to remember: ",
                ].map((starter) => (
                  <button key={starter} type="button" onClick={() => {
                    const value = notesValue ? `${notesValue}\n${starter}` : starter;
                    setNotesValue(value);
                    onUpdateNotes(value);
                  }}>
                    + {starter.replace(": ", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <TripMap destinations={destinations} onAddDestination={onAddDestination} />
          </div>
        </div>
      </main>

      {modal && (
        <AddItemModal
          kind={modal}
          tripName={trip.name}
          onCancel={() => setModal(null)}
          onSave={(values) => {
            if (modal === "destination") onAddDestination(values);
            else onAddActivity(values);
            setModal(null);
          }}
        />
      )}
    </>
  );
}
