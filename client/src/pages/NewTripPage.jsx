import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import TripForm from "../components/organisms/TripForm.jsx";
import styles from "./NewTripPage.module.css";

/**
 * NewTripPage — page (route: /trips/new)
 * Props: onCreate({name, start, end}) -> returns the created trip
 */
export default function NewTripPage({ onCreate }) {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const trip = await onCreate(values);
    navigate(`/trips/${trip.id}`);
  }

  return (
    <>
      <div className={styles.duskband}>
        <Navbar backTo="/" />
      </div>
      <main className="container">
        <div className={styles.wrap}>
          <section className={styles.intro}>
            <span className={styles.eyebrow}>Angeles City · Pampanga</span>
            <h1>Give the weekend a shape.</h1>
            <p>Start with the dates and a feeling. You can add places, food stops, activities, and notes next.</p>
            <div className={styles.introImage} aria-hidden="true" />
            <div className={styles.introQuote}>
              <span>✦</span>
              <strong>Manyaman days ahead.</strong>
              <small>Good food, easy walks, and room for a slow coffee.</small>
            </div>
          </section>
          <TripForm onSubmit={handleSubmit} onCancel={() => navigate("/")} />
        </div>
      </main>
    </>
  );
}
