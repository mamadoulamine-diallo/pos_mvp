export async function persistSale(cartItems) {
    const payload = {
        items: cartItems.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
        })),
    };

    const response = await fetch("/sales", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.error || "Erreur lors de l'enregistrement de la vente"
        );
    }

    return response.json();
}