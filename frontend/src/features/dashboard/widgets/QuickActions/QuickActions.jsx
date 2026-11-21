import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <article className="DashboardCard DashboardCard--actions">
      <header className="DashboardCard-header">
        <div>
          <h2>Actions rapides</h2>
          <p>Accès direct</p>
        </div>
      </header>

      <div className="DashboardActions">
        <Link
          to="/sales/new"
          className="DashboardActions-link"
        >
          Nouvelle vente
        </Link>

        <Link
          to="/products"
          className="DashboardActions-link"
        >
          Produits
        </Link>

        <Link
          to="/sales/history"
          className="DashboardActions-link"
        >
          Historique ventes
        </Link>
      </div>
    </article>
  );
}

export default QuickActions;