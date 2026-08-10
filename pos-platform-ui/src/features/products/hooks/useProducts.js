import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addStock as addStockService,
  createProduct as createProductService,
  loadProducts,
  updateProduct as updateProductService,
  changePrice as changePriceService,
} from "../services/productService";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await loadProducts();

      setProducts(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error("Impossible de charger les produits.", requestError);

      setError("Impossible de charger les produits.");

      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeProducts() {
      try {
        const data = await loadProducts();

        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error("Impossible de charger les produits.", requestError);

          setError("Impossible de charger les produits.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const createProduct = useCallback(
    async (data) => {
      const createdProduct = await createProductService(data);

      await refreshProducts();

      return createdProduct;
    },
    [refreshProducts],
  );

  const updateProduct = useCallback(
    async (id, data) => {
      const updatedProduct = await updateProductService(id, data);

      await refreshProducts();

      return updatedProduct;
    },
    [refreshProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch),
    );
  }, [products, search]);

  const addStock = useCallback(
    async (productId, quantity) => {
      await addStockService({
        productId,
        quantity,
      });

      await refreshProducts();
    },
    [refreshProducts],
  );

  const changePrice = useCallback(
    async (productId, salePrice, purchasePrice) => {
      await changePriceService({
        productId,
        salePrice,
        purchasePrice,
      });

      await refreshProducts();
    },
    [refreshProducts],
  );

  return {
    products: filteredProducts,
    search,
    setSearch,
    loading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    addStock,
    changePrice,
  };
}

export default useProducts;
