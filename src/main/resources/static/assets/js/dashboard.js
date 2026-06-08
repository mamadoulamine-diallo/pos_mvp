let revenueChartInstance = null;

function getDatasetByView(view) {
  switch (view) {
    case "month":
      return window.revenueByMonth || [];

    case "year":
      return window.revenueByYear || [];

    case "day":
    default:
      return (window.revenueByDay || []).slice(-14);
  }
}

function formatChartLabel(point, view) {
  if (view === "month") {
    const [year, month] = point.label.split("-");

    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
    ];

    return `${months[Number(month) - 1]} ${year}`;
  }

  return point.label;
}

function renderRevenueChart(view = "day") {
  const canvas = document.querySelector("#RevenueChart");

  if (!canvas || typeof Chart === "undefined") return;

  const data = getDatasetByView(view);

  const labels = data.map((point) => formatChartLabel(point, view));
  const values = data.map((point) => point.revenue);

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(canvas, {
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
              return `${Number(value).toLocaleString("fr-FR")} F`;
            },
          },
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const chartButtons = document.querySelectorAll(".ChartTabs-button");

  renderRevenueChart("day");

  chartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      chartButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      renderRevenueChart(button.dataset.view);
    });
  });
});