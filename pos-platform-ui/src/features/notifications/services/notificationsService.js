import { getStockNotifications } from "../api/notificationsApi";

export async function loadNotifications() {
  const alerts = await getStockNotifications();

  return alerts.map((alert) => ({
    id: `stock-${alert.productId}`,
    productId: alert.productId,
    title: alert.productName,
    message:
      alert.stockQuantity === 0
        ? "Produit en rupture de stock"
        : `${alert.stockQuantity} unité(s) restante(s)`,
    level:
      alert.stockQuantity === 0
        ? "danger"
        : "warning",
  }));
}