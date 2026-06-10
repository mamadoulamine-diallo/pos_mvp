export async function createCategory(payload) {
    const response = await fetch("/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la création de la catégorie");
    }

    return response.json();
}