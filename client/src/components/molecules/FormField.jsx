import Input from "../atoms/Input.jsx";
import styles from "./FormField.module.css";

/**
 * FormField — molecule (label + Input atom + optional error)
 * Props: label, htmlFor, error, plus everything Input accepts (value, onChange, ...)
 */
export default function FormField({ label, htmlFor, error, ...inputProps }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      <Input id={htmlFor} {...inputProps} />
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
