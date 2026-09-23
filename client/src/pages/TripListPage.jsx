import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import TripGrid from "../components/organisms/TripGrid.jsx";
import Button from "../components/atoms/Button.jsx";
import { StarIcon, PlusIcon } from "../lib/icons.jsx";
import styles from "./TripListPage.module.css";

/**
 * TripListPage — page (route: /)
 * Props: trips
 */
export default function TripListPage({ trips }) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.duskband}>
        <Navbar>
          <Button variant="primary" onClick={() => navigate("/trips/new")}>
            <PlusIcon size={16} />
            <span>New trip</span>
          </Button>
        </Navbar>

        <section className={`${styles.hero} container`}>
          <span className={styles.heroStar}>
            <StarIcon size={90} filled />
          </span>
          <h1>
            Where to <em>next</em>?
          </h1>
          <p className={styles.lede}>
            Plan weekend trips around Angeles City — save the spots you want to hit, the food you want to try, and
            everything you've already checked off.
          </p>
        </section>
      </div>

      <main className="container">
        <TripGrid trips={trips} onNewTrip={() => navigate("/trips/new")} />
      </main>
    </>
  );
}
