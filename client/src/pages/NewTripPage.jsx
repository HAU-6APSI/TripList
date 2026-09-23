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
          <TripForm onSubmit={handleSubmit} onCancel={() => navigate("/")} />
        </div>
      </main>
    </>
  );
}
