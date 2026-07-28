import { useEffect, useState } from "react";
import { loadDashboardSummary } from "../../services/dashboardService";

import "./SummaryCards.scss";

function SummaryCards() {

    const [summary, setSummary] = useState(null);

    useEffect(() => {

        async function fetchSummary() {

            try {

                const data = await loadDashboardSummary();

                setSummary(data);

            } catch (error) {

                console.error(error);

            }

        }

        fetchSummary();

    }, []);

    if (!summary) {
        return <p>Loading...</p>;
    }

    return (

        <div className="summary-cards">

            <div className="summary-card">
                <h3>Revenue</h3>
                <p>{summary.revenueFormatted}</p>
            </div>

            <div className="summary-card">
                <h3>Sales</h3>
                <p>{summary.salesCount}</p>
            </div>

            <div className="summary-card">
                <h3>Items Sold</h3>
                <p>{summary.itemsSold}</p>
            </div>

            <div className="summary-card">
                <h3>Average Basket</h3>
                <p>{summary.averageBasketFormatted}</p>
            </div>

        </div>

    );

}

export default SummaryCards;