import SaleHistoryRow from "../SaleHistoryRow";

import "./SaleHistoryList.scss";

function SaleHistoryList({
  sales,
  onSelect,
}) {
  return (
    <section className="SaleHistoryList">
      {sales.map((sale) => (
        <SaleHistoryRow
          key={sale.saleId}
          sale={sale}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

export default SaleHistoryList;