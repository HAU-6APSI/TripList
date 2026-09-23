import { CheckIcon, StarIcon } from "../../lib/icons.jsx";
import styles from "./Checkbox.module.css";

/**
 * Checkbox — atom
 * Renders as a round "timeline pin" (star when unchecked, filled check
 * when checked) rather than a native checkbox, to match the corkboard
 * itinerary look — but stays a real, keyboard-operable button with the
 * correct aria state.
 * Props: checked, onChange, label
 */
export default function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.pin} ${checked ? styles.checked : ""}`}
      onClick={onChange}
    >
      {checked ? <CheckIcon size={14} /> : <StarIcon size={15} />}
    </button>
  );
}
