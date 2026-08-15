const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function getUsers() {
  const response = await fetch(
    `${API_BASE_URL}/users`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger les utilisateurs.",
    );
  }

  return response.json();
}

export async function getUserRoles() {
  const response = await fetch(
    `${API_BASE_URL}/users/roles`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de charger les rôles.",
    );
  }

  return response.json();
}

export async function postUser(request) {
  const response = await fetch(
    `${API_BASE_URL}/users`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de créer l'utilisateur.",
    );
  }

  return response.json();
}

export async function putUser(
  id,
  request,
) {
  const response = await fetch(
    `${API_BASE_URL}/users/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de modifier l'utilisateur.",
    );
  }

  return response.json();
}