import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addStock as addStockService,
  changePrice as changePriceService,
  createProduct as createProductService,
  loadProducts,
  updateProduct as updateProductService,
} from "../services/productService";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [selectedFilter, setSelectedFilter] =
    useState("all");

  const refreshProducts = useCallback(async () => {
    try {
      const data = await loadProducts();

      setProducts(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error(
        "Impossible de charger les produits.",
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
        if (!cancelled) {
          console.error(
            "Impossible de charger les produits.",
            requestError,
          );

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

  const createProduct = useCallback(
    async (data) => {
      const createdProduct =
        await createProductService(data);

      await refreshProducts();

      return createdProduct;
    },
    [refreshProducts],
  );

  const updateProduct = useCallback(
    async (id, data) => {
      const updatedProduct =
        await updateProductService(id, data);

      await refreshProducts();

      return updatedProduct;
    },
    [refreshProducts],
  );

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
    async (
      productId,
      salePrice,
      purchasePrice,
    ) => {
      await changePriceService({
        productId,
        salePrice,
        purchasePrice,
      });

      await refreshProducts();
    },
    [refreshProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      // Recherche

      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch);

      // Catégorie

      const matchesCategory =
        selectedCategory === "all" ||
        product.categoryId ===
          Number(selectedCategory);

      // État du stock / statut produit

      const matchesFilter = (() => {
        switch (selectedFilter) {
          case "in-stock":
            return (
              product.active &&
              product.stockQuantity > 5
            );

          case "low-stock":
            return (
              product.active &&
              product.stockQuantity > 0 &&
              product.stockQuantity <= 5
            );

          case "out-stock":
            return (
              product.active &&
              product.stockQuantity === 0
            );

          case "inactive":
            return !product.active;

          case "all":
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFilter
      );
    });
  }, [
    products,
    search,
    selectedCategory,
    selectedFilter,
  ]);

  return {
    products: filteredProducts,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    selectedFilter,
    setSelectedFilter,

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