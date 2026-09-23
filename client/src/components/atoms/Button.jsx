import styles from "./Button.module.css";

/**
 * Button — atom
 * Props: variant ("primary" | "ghost" | "ghostLight" | "danger" | "text"),
 *        onClick, type, disabled, children
 */
export default function Button({
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  children,
  ...rest
}) {
  const variantClass = styles[variant] || styles.primary;
  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
