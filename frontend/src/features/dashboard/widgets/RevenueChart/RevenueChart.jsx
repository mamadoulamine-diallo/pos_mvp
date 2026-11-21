import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { loadRevenueChart } from "../../services/dashboardService";

import "./RevenueChart.scss";

const views = [
  { value: "day", label: "Jour" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
];

const months = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function formatChartLabel(point, view) {
  if (view !== "month") {
    return point.label;
  }

  const [year, month] = point.label.split("-");

  return `${months[Number(month) - 1]} ${year}`;
}

function RevenueChart({ period = "TODAY" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [view, setView] = useState("day");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderChart() {
      try {
        setError(null);

        const data = await loadRevenueChart(view, period);

        if (isCancelled || !canvasRef.current) {
          return;
        }

        const labels = data.map((point) =>
          formatChartLabel(point, view),
        );

        const values = data.map((point) => point.revenue);

        chartRef.current?.destroy();

        chartRef.current = new Chart(canvasRef.current, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Chiffre d’affaires",
                data: values,
                borderWidth: 3,
                tension: 0.35,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback(value) {
                    return `${Number(value).toLocaleString(
                      "fr-FR",
                    )} F`;
                  },
                },
              },
            },
          },
        });
      } catch (requestError) {
        console.error(requestError);
        setError("Impossible de charger le graphique.");
      }
    }

    renderChart();

    return () => {
      isCancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [period, view]);

  return (
    <article className="DashboardCard DashboardCard--chart">
      <header className="DashboardCard-header DashboardCard-header--chart">
        <div>
          <h2>Évolution des ventes</h2>
          <p>Analyse du chiffre d’affaires</p>
        </div>

        <div className="ChartTabs">
          {views.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`ChartTabs-button${
                view === value ? " active" : ""
              }`}
              onClick={() => setView(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {error ? (
        <p>{error}</p>
      ) : (
        <div className="RevenueChart-container">
          <canvas ref={canvasRef} />
        </div>
      )}
    </article>
  );
}

export default RevenueChart;