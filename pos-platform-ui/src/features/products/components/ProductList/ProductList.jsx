import ProductCard from "../ProductCard";

function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <p className="Products-empty">
        Aucun produit trouvé.
      </p>
    );
  }

  return (
    <section className="Products-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}

export default ProductList;