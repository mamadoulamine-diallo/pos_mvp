import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadProducts } from "../../products/services/productService";

function useSaleProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await loadProducts();

      setProducts(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error(
        "Impossible de charger les produits de vente.",
        requestError,
      );

      setError(
        "Impossible de charger les produits.",
      );

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
        console.error(
          "Impossible de charger les produits de vente.",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Impossible de charger les produits.",
          );
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      // En caisse, on ne propose pas les produits inactifs.
      if (!product.active) {
        return false;
      }

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        product.categoryId ===
          Number(selectedCategory);

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  return {
    products: filteredProducts,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    loading,
    error,

    refreshProducts,
  };
}

export default useSaleProducts;