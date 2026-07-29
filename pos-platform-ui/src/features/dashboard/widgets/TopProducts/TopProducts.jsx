import { useEffect, useState } from "react";
import { loadTopProducts } from "../../services/dashboardService";

import "./TopProducts.scss";

function TopProducts({ period = "TODAY" }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        async function fetchProducts() {

            try {

                const data = await loadTopProducts(period);

                setProducts(data);

            } catch (error) {

                console.error(error);

            }

        }

        fetchProducts();

    }, [period]);

    return (

        <article className="DashboardCard">

            <header className="DashboardCard-header">

                <div>

                    <h2>Top produits</h2>

                    <p>Produits les plus vendus</p>

                </div>

            </header>

            <div className="TopProducts-list">

                {products.map((product, index) => (

                    <article
                        key={product.productName}
                        className="TopProducts-item"
                    >

                        <span className="TopProducts-rank">

                            #{index + 1}

                        </span>

                        <div className="TopProducts-info">

                            <strong>

                                {product.productName}

                            </strong>

                            <small>

                                {product.quantitySold} unités vendues

                            </small>

                        </div>

                        <span className="TopProducts-revenue">

                            {Number(product.revenue).toLocaleString("fr-FR")} F

                        </span>

                    </article>

                ))}

            </div>

        </article>

    );

}

export default TopProducts;