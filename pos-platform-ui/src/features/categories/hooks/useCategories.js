import { useCallback, useEffect, useState } from "react";

import {
  createCategory as createCategoryService,
  loadCategories,
  updateCategory as updateCategoryService,
} from "../services/categoryService";

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCategories = useCallback(async () => {
    try {
      const data = await loadCategories();

      setCategories(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error(
        "Impossible de charger les catégories.",
        requestError,
      );

      setError("Impossible de charger les catégories.");

      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeCategories() {
      try {
        const data = await loadCategories();

        if (!cancelled) {
          setCategories(data);
          setError(null);
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error(
            "Impossible de charger les catégories.",
            requestError,
          );

          setError(
            "Impossible de charger les catégories.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const createCategory = useCallback(
    async (data) => {
      const createdCategory =
        await createCategoryService(data);

      await refreshCategories();

      return createdCategory;
    },
    [refreshCategories],
  );

  const updateCategory = useCallback(
    async (id, data) => {
      const updatedCategory =
        await updateCategoryService(id, data);

      await refreshCategories();

      return updatedCategory;
    },
    [refreshCategories],
  );

  return {
    categories,
    loading,
    error,
    refreshCategories,
    createCategory,
    updateCategory,
  };
}

export default useCategories;