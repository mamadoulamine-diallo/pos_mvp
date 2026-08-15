import {
  getSaleDetail,
  getSalesHistory,
} from "../api/saleApi";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function createSale(items) {
  const response = await fetch(
    `${API_BASE_URL}/sales`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        items: items.map((item) => ({
          productId: Number(item.id),
          quantity: item.quantity,
        })),
      }),
    },
  );

  if (!response.ok) {
    let message =
      "Impossible d'enregistrer la vente.";

    try {
      const error = await response.json();

      message =
        error.message ||
        error.error ||
        message;
    } catch {
      // Réponse backend sans JSON exploitable.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function loadSalesHistory() {
  return getSalesHistory();
}

export async function loadSaleDetail(id) {
  return getSaleDetail(id);
}