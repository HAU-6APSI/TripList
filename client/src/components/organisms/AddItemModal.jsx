import { useEffect, useState } from "react";
import FormField from "../molecules/FormField.jsx";
import Button from "../atoms/Button.jsx";
import styles from "./AddItemModal.module.css";

/**
 * AddItemModal — organism (the "Add Destination / Activity" screen,
 * shown as a modal panel over the Trip Page, per M6A2)
 * Props: kind ("destination" | "activity"), tripName, onSave({name, notes?}), onCancel
 */
export default function AddItemModal({ kind, tripName, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    document.getElementById("item-name")?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(kind === "destination" ? { name: trimmed, notes: notes.trim() } : { name: trimmed });
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>{kind === "destination" ? "Add destination" : "Add activity"}</h2>
        <p className={styles.sub}>{tripName}</p>

        {kind === "destination" ? (
          <>
            <FormField
              label="Place name"
              htmlFor="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Clark Museum"
              required
            />
            <FormField
              label="Notes (optional)"
              htmlFor="item-notes"
              as="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opening hours, entrance fee, tips..."
            />
          </>
        ) : (
          <FormField
            label="What do you want to do?"
            htmlFor="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Try sisig at a local karinderya"
            required
          />
        )}

        <div className={styles.actions}>
          <Button variant="ghostLight" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
