import { Search } from "lucide-react";
import "./SaleSearch.scss";


function SaleSearch({
  value,
  onChange,
}) {
  return (
    <div className="SaleSearch">
      <Search
        className="SaleSearch-icon"
        size={18}
        aria-hidden="true"
      />

      <input
        className="SaleSearch-input"
        type="search"
        placeholder="Rechercher un produit..."
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
}

export default SaleSearch;