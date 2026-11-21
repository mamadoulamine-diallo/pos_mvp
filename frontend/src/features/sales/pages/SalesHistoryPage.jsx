import SaleDetailModal from "../components/SaleDetailModal";
import SaleHistoryList from "../components/SaleHistoryList";

import useSalesHistory from "../hooks/useSalesHistory";

import "./SalesHistoryPage.scss";

function SalesHistoryPage() {
  const {
    sales,
    selectedSale,

    loading,
    detailLoading,

    error,
    detailError,

    openSaleDetail,
    closeSaleDetail,
  } = useSalesHistory();

  return (
    <main className="SalesHistoryPage">
      <header className="SalesHistoryPage-header">
        <div>
          <h1>Historique des ventes</h1>

          <p>
            {sales.length}{" "}
            {sales.length === 1
              ? "vente"
              : "ventes"}
          </p>
        </div>
      </header>

      {loading && (
        <p className="SalesHistoryPage-message">
          Chargement de l'historique...
        </p>
      )}

      {error && (
        <p className="SalesHistoryPage-message SalesHistoryPage-message--error">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        sales.length === 0 && (
          <div className="SalesHistoryPage-empty">
            <h2>Aucune vente</h2>

            <p>
              Les ventes enregistrées
              apparaîtront ici.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        sales.length > 0 && (
          <SaleHistoryList
            sales={sales}
            onSelect={openSaleDetail}
          />
        )}

      <SaleDetailModal
        sale={selectedSale}
        loading={detailLoading}
        error={detailError}
        onClose={closeSaleDetail}
      />
    </main>
  );
}

export default SalesHistoryPage;