import SaleProductCard from "../SaleProductCard";
import "./SaleProductGrid.scss";

function SaleProductGrid({
  products,
  onAdd,
}) {
  if (products.length === 0) {
    return (
      <div className="SaleProducts-empty">
        <h2>Aucun produit trouvé</h2>

        <p>
          Modifiez votre recherche ou votre catégorie.
        </p>
      </div>
    );
  }

  return (
    <section className="SaleProductGrid">
      {products.map((product) => (
        <SaleProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
        />
      ))}
    </section>
  );
}

export default SaleProductGrid;