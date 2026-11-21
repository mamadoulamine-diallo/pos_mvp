import { useEffect, useState } from "react";
import { loadStockAlerts } from "../../services/dashboardService";

function StockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlerts() {
      try {
        setLoading(true);
        setError(null);

        const data = await loadStockAlerts();

        if (!cancelled) {
          setAlerts(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Impossible de charger les alertes.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAlerts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <article className="DashboardCard">
        <header className="DashboardCard-header">
          <h2>Alertes stock</h2>
          <p>Produits nécessitant une attention</p>
        </header>

        <p className="DashboardCard-message">
          Chargement...
        </p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="DashboardCard">
        <header className="DashboardCard-header">
          <h2>Alertes stock</h2>
          <p>Produits nécessitant une attention</p>
        </header>

        <p className="DashboardCard-message DashboardCard-message--error">
          {error}
        </p>
      </article>
    );
  }

  return (
    <article className="DashboardCard">
      <header className="DashboardCard-header">
        <div>
          <h2>Alertes stock</h2>
          <p>Produits nécessitant une attention</p>
        </div>
      </header>

      <div className="StockAlerts-list">
        {alerts.map((alert) => (
          <article
            key={alert.productId}
            className="StockAlert"
          >
            <div className="StockAlert-info">
              <strong>{alert.productName}</strong>

              <small>
                {alert.stockQuantity === 0
                  ? "Produit indisponible"
                  : `${alert.stockQuantity} restants`}
              </small>
            </div>

            <span
              className={`StockAlert-badge${
                alert.status === "OUT"
                  ? " StockAlert-badge--out"
                  : ""
              }`}
            >
              {alert.status === "OUT"
                ? "Rupture"
                : "Faible"}
            </span>
          </article>
        ))}
      </div>
    </article>
  );
}

export default StockAlerts;