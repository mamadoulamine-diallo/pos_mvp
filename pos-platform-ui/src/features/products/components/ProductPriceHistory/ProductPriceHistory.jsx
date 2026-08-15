import "./ProductPriceHistory.scss";

function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString("fr-FR")} F`;
}

function formatDate(date) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function ProductPriceHistory({
  prices,
}) {
  if (!prices.length) {
    return (
      <div className="ProductPriceHistory-empty">
        Aucun historique de prix.
      </div>
    );
  }

  return (
    <section className="ProductPriceHistory">
      <header className="ProductPriceHistory-header">
        <div>
          <h2>Historique des prix</h2>

          <p>
            Évolution des prix d'achat et de vente.
          </p>
        </div>
      </header>

      <div className="ProductPriceHistory-list">
        {prices.map((price, index) => {
          const active =
            price.endDate === null;

          return (
            <article
              key={`${price.startDate}-${index}`}
              className={
                active
                  ? "ProductPriceHistory-item ProductPriceHistory-item--active"
                  : "ProductPriceHistory-item"
              }
            >
              <div className="ProductPriceHistory-marker">
                <span />
              </div>

              <div className="ProductPriceHistory-content">
                <div className="ProductPriceHistory-prices">
                  <div>
                    <span>Vente</span>

                    <strong>
                      {formatPrice(
                        price.salePrice,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Achat</span>

                    <strong>
                      {formatPrice(
                        price.purchasePrice,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="ProductPriceHistory-period">
                  {active ? (
                    <>
                      <strong>
                        Prix actuel
                      </strong>

                      <span>
                        Depuis le{" "}
                        {formatDate(
                          price.startDate,
                        )}
                      </span>
                    </>
                  ) : (
                    <span>
                      {formatDate(
                        price.startDate,
                      )}
                      {" → "}
                      {formatDate(
                        price.endDate,
                      )}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ProductPriceHistory;