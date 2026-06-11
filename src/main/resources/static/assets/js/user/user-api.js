export async function createUser(payload) {
    const response = await fetch("/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erreur lors de la création utilisateur");
    return response.json();
}

export async function updateUser(userId, payload) {
    const response = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erreur lors de la modification utilisateur");
    return response.json();
}