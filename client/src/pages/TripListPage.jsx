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
  const destinationCount = trips.reduce((total, trip) => total + (trip.destinations || []).length, 0);
  const completedCount = trips.reduce(
    (total, trip) => total + (trip.destinations || []).filter((destination) => destination.status === "done" || destination.done).length,
    0,
  );

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

      <main className={`${styles.content} container`}>
        <div className={styles.dashboard}>
          <section className={styles.tripsSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.kicker}>Your itinerary shelf</span>
                <h2>{trips.length ? "Trips in progress" : "Start your next chapter"}</h2>
              </div>
              {trips.length > 0 && <span className={styles.tripCount}>{trips.length} trip{trips.length === 1 ? "" : "s"}</span>}
            </div>
            <TripGrid trips={trips} onNewTrip={() => navigate("/trips/new")} />
          </section>

          <aside className={styles.overview}>
            <div className={styles.overviewTop}>
              <span className={styles.kicker}>Planning pulse</span>
              <span className={styles.pulseDot} />
            </div>
            <h2>Make room for the good stuff.</h2>
            <p>Keep your places, food stops, and small plans together before the weekend arrives.</p>
            <div className={styles.stats}>
              <div><strong>{trips.length}</strong><span>trips</span></div>
              <div><strong>{destinationCount}</strong><span>places saved</span></div>
              <div><strong>{completedCount}</strong><span>checked off</span></div>
            </div>
            <div className={styles.cityNote}>
              <span className={styles.noteMark}>✦</span>
              <div><strong>Angeles City, Pampanga</strong><span>Good food, easy detours, and a little more time outside.</span></div>
            </div>
          </aside>
        </div>

        <section className={styles.cityGuide}>
          <div className={styles.guideHeading}>
            <div>
              <span className={styles.kicker}>A little local context</span>
              <h2>Build a day around Angeles.</h2>
            </div>
            <p>Start with a flavor, a place, or a slow hour. Add the details to a trip when you are ready.</p>
          </div>
          <div className={styles.guideGrid}>
            <article className={`${styles.guideTile} ${styles.foodTile}`}>
              <span className={styles.tileTag}>Eat</span>
              <div><h3>Sisig first</h3><p>Make room for Kapampangan food and the stories behind it.</p></div>
            </article>
            <article className={`${styles.guideTile} ${styles.heritageTile}`}>
              <span className={styles.tileTag}>Wander</span>
              <div><h3>Santo Rosario</h3><p>Walk the heritage district, then pause at Holy Rosary Parish.</p></div>
            </article>
            <article className={`${styles.guideTile} ${styles.clarkTile}`}>
              <span className={styles.tileTag}>Pause</span>
              <div><h3>Clark and coffee</h3><p>Leave space for a coffee stop between the bigger plans.</p></div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
