import { dashboardSales } from "./data/sales-mock.js";
import { products } from "./data/products-mock.js";

function formatPrice(price) {
  return `${Math.round(price).toLocaleString("fr-FR")} F`;
}

function updateText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function getTotalRevenue(sales) {
  return sales.reduce((total, sale) => total + sale.total, 0);
}

function getTotalItems(sales) {
  return sales.reduce((total, sale) => {
    return (
      total + sale.items.reduce((subTotal, item) => subTotal + item.quantity, 0)
    );
  }, 0);
}

function getAverageBasket(sales) {
  if (sales.length === 0) return 0;

  return getTotalRevenue(sales) / sales.length;
}

function getTopProducts(sales) {
  const products = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!products[item.name]) {
        products[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }

      products[item.name].quantity += item.quantity;
      products[item.name].revenue += item.quantity * item.price;
    });
  });

  return Object.values(products)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

function renderRecentSales(sales) {
  const container = document.querySelector(".RecentSales-list");

  if (!container) return;

  container.innerHTML = "";

  sales
    .slice()
    .reverse()
    .slice(0, 5)
    .forEach((sale) => {
      const date = new Date(sale.date);

      const item = document.createElement("article");
      item.className = "RecentSales-item";

      item.innerHTML = `
        <span class="RecentSales-time">
          ${date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <strong class="RecentSales-total">
          ${formatPrice(sale.total)}
        </strong>

        <span class="RecentSales-method">
          ${sale.paymentMethod}
        </span>
      `;

      container.appendChild(item);
    });
}

function renderTopProducts(products) {
  const container = document.querySelector(".TopProducts-list");

  if (!container) return;

  container.innerHTML = "";

  products.forEach((product, index) => {
    const item = document.createElement("article");
    item.className = "TopProducts-item";

    item.innerHTML = `
      <span class="TopProducts-rank">#${index + 1}</span>

      <div class="TopProducts-info">
        <strong>${product.name}</strong>
        <small>${product.quantity} unités vendues</small>
      </div>

      <span class="TopProducts-revenue">
        ${formatPrice(product.revenue)}
      </span>
    `;

    container.appendChild(item);
  });
}

function groupSalesByHour(sales) {
  const grouped = {};

  sales.forEach((sale) => {
    const hour = new Date(sale.date).getHours();
    const label = `${hour}h`;

    grouped[label] = (grouped[label] || 0) + sale.total;
  });

  return grouped;
}

function groupSalesByMonthDay(sales) {
  const grouped = {};

  sales.forEach((sale) => {
    const date = new Date(sale.date);
    const day = date.getDate();

    const label = `${day}`;

    grouped[label] = (grouped[label] || 0) + sale.total;
  });

  return grouped;
}

function groupSalesByYearMonth(sales) {
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  const grouped = {};

  months.forEach((month) => {
    grouped[month] = 0;
  });

  sales.forEach((sale) => {
    const date = new Date(sale.date);

    const month = date.toLocaleDateString("fr-FR", {
      month: "short",
    });

    grouped[month] += sale.total;
  });

  return grouped;
}

function getChartData(view, sales) {
  switch (view) {
    case "month":
      return groupSalesByMonthDay(sales);

    case "year":
      return groupSalesByYearMonth(sales);

    default:
      return groupSalesByHour(sales);
  }
}

function renderRevenueChart(view, sales) {
  const canvas = document.querySelector("#RevenueChart");

  if (!canvas || typeof Chart === "undefined") return;

  const groupedData = getChartData(view, sales);

  const labels = Object.keys(groupedData);
  const values = Object.values(groupedData);

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(canvas, {
    type: "line",

    data: {
      labels,

      datasets: [
        {
          label: "CA",

          data: values,

          borderWidth: 3,
          tension: 0.35,
          fill: false,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function getLowStockProducts(products) {
  return products.filter((product) => {
    return product.stock > 0 && product.stock <= 5;
  });
}

function getOutOfStockProducts(products) {
  return products.filter((product) => {
    return product.stock === 0;
  });
}

function renderStockAlerts(products) {
  const container = document.querySelector(".StockAlerts-list");

  if (!container) return;

  container.innerHTML = "";

  const alerts = products.filter((product) => {
    return product.stock <= 5;
  });

  alerts.forEach((product) => {
    const item = document.createElement("article");

    item.className = "StockAlert";

    const isOut = product.stock === 0;

    item.innerHTML = `
      <div class="StockAlert-info">
        <strong>${product.name}</strong>

        <small>
          ${isOut ? "Produit indisponible" : `${product.stock} restants`}
        </small>
      </div>

      <span class="
        StockAlert-badge
        ${isOut ? "StockAlert-badge--out" : ""}
      ">
        ${isOut ? "Rupture" : "Faible"}
      </span>
    `;

    container.appendChild(item);
  });
}

let revenueChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const sales = dashboardSales;

  const chartButtons = document.querySelectorAll(".ChartTabs-button");

  let currentChartView = "hour";

  const totalRevenue = getTotalRevenue(sales);
  const totalItems = getTotalItems(sales);
  const averageBasket = getAverageBasket(sales);
  const topProducts = getTopProducts(sales);

  updateText(".DashboardRevenue", formatPrice(totalRevenue));
  updateText(".DashboardSales", sales.length);
  updateText(".DashboardItems", totalItems);
  updateText(".DashboardAverage", formatPrice(averageBasket));

  renderRecentSales(sales);
  renderTopProducts(topProducts);
  renderRevenueChart(currentChartView, sales);

  chartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      chartButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      currentChartView = button.dataset.view;

      renderRevenueChart(currentChartView, sales);
    });
  });

  const lowStockProducts = getLowStockProducts(products);

  const outOfStockProducts = getOutOfStockProducts(products);

  updateText(".DashboardLowStock", lowStockProducts.length);

  updateText(".DashboardOutStock", outOfStockProducts.length);

  renderStockAlerts(products);
});
