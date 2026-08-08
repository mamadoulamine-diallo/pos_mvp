import { useEffect, useMemo, useState } from "react";

import { loadProducts } from "../services/productService";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const data = await loadProducts();

        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger les produits.",
          requestError,
        );

        if (!cancelled) {
          setError("Impossible de charger les produits.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [products, search]);

  return {
    products: filteredProducts,
    search,
    setSearch,
    loading,
    error,
  };
}

export default useProducts;