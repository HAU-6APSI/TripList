import { Link } from "react-router-dom";
import { ParulIcon, BackIcon } from "../../lib/icons.jsx";
import styles from "./Navbar.module.css";

/**
 * Navbar — organism
 * Props: title, backTo (link target for the back arrow; omit on the
 * trip list, where the brand shows instead), children (right-aligned
 * actions, e.g. the "New trip" button)
 */
export default function Navbar({ backTo, children }) {
  return (
    <div className={`${styles.inner} container`}>
      {backTo ? (
        <Link className={styles.backLink} to={backTo}>
          <BackIcon size={16} />
          <span>Back to trips</span>
        </Link>
      ) : (
        <Link className={styles.brand} to="/">
          <span className={styles.mark}>
            <ParulIcon size={28} />
          </span>
          <span className={styles.name}>TripList</span>
          <span className={styles.sub}>Angeles City trip planner</span>
        </Link>
      )}
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
