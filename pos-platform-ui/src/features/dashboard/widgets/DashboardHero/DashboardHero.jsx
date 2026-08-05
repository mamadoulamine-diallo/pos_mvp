import { Link } from "react-router-dom";

import useAuth from "../../../auth/hooks/useAuth";

function DashboardHero() {
  const {
    currentUser,
    loading,
  } = useAuth();

  const greeting = loading
    ? "Bonjour..."
    : `Bonjour ${currentUser?.fullName ?? "utilisateur"}`;

  return (
    <section className="Dashboard-hero">
      <div>
        <p className="Dashboard-eyebrow">
          Tableau de bord
        </p>

        <h1 className="Dashboard-title">
          {greeting}
        </h1>

        <p className="Dashboard-subtitle">
          Voici l’activité de votre commerce aujourd’hui.
        </p>
      </div>

      <Link
        to="/sales/new"
        className="Dashboard-cta"
      >
        Nouvelle vente
      </Link>
    </section>
  );
}

export default DashboardHero;