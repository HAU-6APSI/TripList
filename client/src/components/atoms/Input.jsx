import styles from "./Input.module.css";

/**
 * Input — atom
 * A bare form control, no label of its own. FormField (molecule) pairs
 * it with a <label> and an optional error message.
 * Props: id, as ("input" | "textarea"), type, value, onChange, placeholder, required
 */
export default function Input({ id, as = "input", type = "text", ...rest }) {
  const Field = as === "textarea" ? "textarea" : "input";
  return (
    <Field
      id={id}
      name={id}
      type={as === "textarea" ? undefined : type}
      className={styles.control}
      {...rest}
    />
  );
}
