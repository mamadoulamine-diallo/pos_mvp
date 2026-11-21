import { Search } from "lucide-react";

import "./ProductSearch.scss";

function ProductSearch({ value, onChange }) {
  return (
    <div className="ProductSearch">
      <Search
        className="ProductSearch-icon"
        size={18}
      />

      <input
        className="ProductSearch-input"
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

export default ProductSearch;