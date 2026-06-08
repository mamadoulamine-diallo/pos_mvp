export async function createProduct(payload) {
    const response = await fetch("/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
    }

    return response.json();
}

export async function updateProduct(productId, payload) {
    const response = await fetch(`/products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la modification du produit");
    }

    return response.json();
}

export async function addStock(payload) {
    const response = await fetch("/products/stock", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du stock");
    }

    return response.json();
}

export async function changePrice(payload) {
    const response = await fetch("/products/price", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la modification du prix");
    }

    return response.json();
}