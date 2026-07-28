import { useEffect, useState } from "react";
import { loadDashboardSummary } from "../../services/dashboardService";

import "./SummaryCards.scss";

const revenueLabels = {
  TODAY: "CA du jour",
  LAST_7_DAYS: "CA des 7 derniers jours",
  LAST_30_DAYS: "CA des 30 derniers jours",
  ALL: "CA total",
};

function SummaryCards({ period = "TODAY" }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setError(null);

        const data = await loadDashboardSummary(period);

        setSummary(data);
      } catch (requestError) {
        console.error(requestError);
        setError("Impossible de charger les indicateurs.");
      }
    }

    fetchSummary();
  }, [period]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!summary) {
    return <p>Chargement...</p>;
  }

  const cards = [
    {
      label: revenueLabels[period],
      value: summary.revenueFormatted,
      help: "Ventes validées",
      modifier: "DashboardStat--primary",
    },
    {
      label: "Ventes",
      value: summary.salesCount,
      help: "Transactions",
    },
    {
      label: "Articles vendus",
      value: summary.itemsSold,
      help: "Quantité totale",
    },
    {
      label: "Panier moyen",
      value: summary.averageBasketFormatted,
      help: "Par vente",
    },
    {
      label: "Stock faible",
      value: summary.lowStockCount,
      help: "Produits à surveiller",
      modifier: "DashboardStat--warning",
    },
    {
      label: "Ruptures",
      value: summary.outOfStockCount,
      help: "Produits indisponibles",
      modifier: "DashboardStat--danger",
    },
  ];

  return (
    <section className="DashboardStats">
      {cards.map(({ label, value, help, modifier }) => (
        <article
          className={`DashboardStat${modifier ? ` ${modifier}` : ""}`}
          key={label}
        >
          <span className="DashboardStat-label">{label}</span>

          <strong className="DashboardStat-value">{value}</strong>

          <small className="DashboardStat-help">{help}</small>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;