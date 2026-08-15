import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  loadSaleDetail,
  loadSalesHistory,
} from "../services/saleService";

function useSalesHistory() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [detailError, setDetailError] =
    useState(null);

  const refreshSales = useCallback(async () => {
    try {
      const data = await loadSalesHistory();

      setSales(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error(
        "Impossible de charger l'historique des ventes.",
        requestError,
      );

      setError(
        "Impossible de charger l'historique des ventes.",
      );

      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeSales() {
      try {
        const data = await loadSalesHistory();

        if (!cancelled) {
          setSales(data);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger l'historique des ventes.",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Impossible de charger l'historique des ventes.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeSales();

    return () => {
      cancelled = true;
    };
  }, []);

  const openSaleDetail = useCallback(
    async (saleId) => {
      try {
        setDetailLoading(true);
        setDetailError(null);

        const detail =
          await loadSaleDetail(saleId);

        setSelectedSale(detail);

        return detail;
      } catch (requestError) {
        console.error(
          "Impossible de charger le détail de la vente.",
          requestError,
        );

        setDetailError(
          "Impossible de charger le détail de la vente.",
        );

        return null;
      } finally {
        setDetailLoading(false);
      }
    },
    [],
  );

  const closeSaleDetail = useCallback(() => {
    setSelectedSale(null);
    setDetailError(null);
  }, []);

  return {
    sales,
    selectedSale,

    loading,
    detailLoading,

    error,
    detailError,

    refreshSales,
    openSaleDetail,
    closeSaleDetail,
  };
}

export default useSalesHistory;