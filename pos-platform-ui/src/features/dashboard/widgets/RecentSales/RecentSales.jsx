import { useEffect, useState } from "react";
import { loadRecentSales } from "../../services/dashboardService";

function formatSaleTime(saleDate) {
  if (!saleDate) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(saleDate));
}

function formatAmount(amount) {
  return `${Number(amount ?? 0).toLocaleString("fr-FR")} F`;
}

function RecentSales({ period = "TODAY" }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchRecentSales() {
      try {
        setLoading(true);
        setError(null);

        const data = await loadRecentSales(period);

        if (!isCancelled) {
          setSales(data);
        }
      } catch (requestError) {
        console.error(requestError);

        if (!isCancelled) {
          setError("Impossible de charger les ventes récentes.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecentSales();

    return () => {
      isCancelled = true;
    };
  }, [period]);

  return (
    <article className="DashboardCard">
      <header className="DashboardCard-header">
        <div>
          <h2>Ventes récentes</h2>
          <p>Dernières transactions</p>
        </div>
      </header>

      {loading && (
        <p className="DashboardCard-message">
          Chargement des ventes...
        </p>
      )}

      {error && (
        <p className="DashboardCard-message DashboardCard-message--error">
          {error}
        </p>
      )}

      {!loading && !error && sales.length === 0 && (
        <p className="DashboardCard-message">
          Aucune vente pour cette période.
        </p>
      )}

      {!loading && !error && sales.length > 0 && (
        <div className="RecentSales-list">
          {sales.map((sale) => (
            <article
              key={sale.saleId}
              className="RecentSales-item"
            >
              <span className="RecentSales-time">
                {formatSaleTime(sale.saleDate)}
              </span>

              <strong className="RecentSales-total">
                {formatAmount(sale.total)}
              </strong>

              <span className="RecentSales-method">
                Vente #{sale.saleId}
              </span>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}

export default RecentSales;