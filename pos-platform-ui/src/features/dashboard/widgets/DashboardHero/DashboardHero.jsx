import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { loadCurrentUser } from "../../../auth/services/authService";

function DashboardHero() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCurrentUser() {
      try {
        const user = await loadCurrentUser();

        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error(
            "Impossible de charger l'utilisateur connecté",
            requestError
          );

          setError("Utilisateur non identifié");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  let greeting = "Bonjour";

  if (loading) {
    greeting = "Bonjour…";
  } else if (currentUser?.fullName) {
    greeting = `Bonjour ${currentUser.fullName}`;
  } else if (error) {
    greeting = "Bonjour";
  }

  return (
    <section className="DashboardHero">
      <div className="DashboardHero-content">
        <p className="DashboardHero-eyebrow">Tableau de bord</p>

        <h1 className="DashboardHero-title">
          {greeting}
        </h1>

        <p className="DashboardHero-subtitle">
          Voici un aperçu de l’activité de votre commerce.
        </p>
      </div>

      <Link
        to="/sales/new"
        className="DashboardHero-action"
      >
        Nouvelle vente
      </Link>
    </section>
  );
}

export default DashboardHero;