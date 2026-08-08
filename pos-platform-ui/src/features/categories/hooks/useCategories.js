import { useEffect, useState } from "react";

import { loadCategories } from "../services/categoryService";

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const data = await loadCategories();

        if (!cancelled) {
          setCategories(data);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger les catégories.",
          requestError,
        );

        if (!cancelled) {
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

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    categories,
    loading,
    error,
  };
}

export default useCategories;