// src/components/SubNavbar/SubNavbar.jsx
import { useNavigate } from "react-router-dom";
import "./SubNavbar.css";

export default function SubNavbar({
  activeCategory,
  setActiveCategory,
  searchInputValue,
  handleOnSearchInputChange,
  getTotalItems,
}) {
  const categories = [
    "All Categories",
    "Accessories",
    "Apparel",
    "Books",
    "Snacks",
    "Supplies",
  ];
  const navigate = useNavigate();

  return (
    <nav className="SubNavbar">
      <div className="content">
        <div className="row">
          <div className="search-bar">
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={searchInputValue}
              onChange={handleOnSearchInputChange}
            />
            <i className="material-icons">search</i>
          </div>
          <button
            className="cart-button"
            onClick={() => navigate("/cart")}
            aria-label="View Cart"
          >
            <i className="material-icons md-36">shopping_cart</i>
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
        </div>
        <div className="row">
          <ul className="category-menu">
            {categories.map((cat) => (
              <li
                key={cat}
                className={activeCategory === cat ? "is-active" : ""}
              >
                <button onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
