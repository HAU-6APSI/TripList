import { useState } from "react";
import FormField from "../molecules/FormField.jsx";
import Button from "../atoms/Button.jsx";
import styles from "./TripForm.module.css";

/**
 * TripForm — organism (reused by New Trip and Edit Trip, per M6A2)
 * Props: trip (existing trip to edit, or null for create), onSubmit({name,start,end}), onCancel
 */
export default function TripForm({ trip = null, onSubmit, onCancel }) {
  const [name, setName] = useState(trip?.name || "");
  const [start, setStart] = useState(trip?.start || "");
  const [end, setEnd] = useState(trip?.end || "");
  const [error, setError] = useState("");

  const isEdit = Boolean(trip);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !start || !end) {
      setError("Please fill in the trip name and both dates.");
      return;
    }
    if (end < start) {
      setError("End date can't be before the start date.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), start, end });
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit trip" : "Plan a new trip"}</h2>
      <p className={styles.sub}>
        {isEdit ? "Update the name or dates." : "Places, activities, and notes can be added after the trip is created."}
      </p>

      <FormField
        label="Trip name"
        htmlFor="trip-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Baguio-style weekend in Clark"
        required
      />

      <div className={styles.row}>
        <FormField
          label="Start date"
          htmlFor="trip-start"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <FormField
          label="End date"
          htmlFor="trip-end"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!isEdit && (
        <p className={styles.hint}>You'll be able to add destinations, activities, and notes on the next screen.</p>
      )}

      <div className={styles.actions}>
        <Button variant="ghostLight" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {isEdit ? "Update" : "Create trip"}
        </Button>
      </div>
    </form>
  );
}
