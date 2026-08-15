import { useCallback, useMemo, useState } from "react";

function useSaleCart() {
  const [items, setItems] = useState([]);

  const addProduct = useCallback((product) => {
    if (
      !product.active ||
      product.stockQuantity <= 0
    ) {
      return false;
    }

    let added = false;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        if (
          existingItem.quantity >=
          product.stockQuantity
        ) {
          return currentItems;
        }

        added = true;

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      added = true;

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: Number(product.salePrice ?? 0),
          stockQuantity: product.stockQuantity,
          quantity: 1,
        },
      ];
    });

    return added;
  }, []);

  const increaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= item.stockQuantity) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const quantity = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0,
      ),
    [items],
  );

  return {
    items,
    quantity,
    total,

    addProduct,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  };
}

export default useSaleCart;