const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function getSalesHistory() {
  const response = await fetch(
    `${API_BASE_URL}/sales`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger l'historique des ventes.",
    );
  }

  return response.json();
}

export async function getSaleDetail(id) {
  const response = await fetch(
    `${API_BASE_URL}/sales/${id}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger le détail de la vente.",
    );
  }

  return response.json();
}