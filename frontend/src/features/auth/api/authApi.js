const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function postLogin(pinCode) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        pinCode,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Code PIN incorrect.");
    }

    throw new Error(
      "Impossible de se connecter.",
    );
  }

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      credentials: "include",
    },
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Impossible de vérifier la session.",
    );
  }

  return response.json();
}

export async function postLogout() {
  const response = await fetch(
    `${API_BASE_URL}/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de se déconnecter.",
    );
  }
}