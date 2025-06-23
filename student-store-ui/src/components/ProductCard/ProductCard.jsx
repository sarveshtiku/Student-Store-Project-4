// src/components/ProductCard/ProductCard.jsx
import { Link } from "react-router-dom"
import codepath from "../../assets/codepath.svg"
import { formatPrice } from "../../utils/format"
import "./ProductCard.css"

export default function ProductCard({ product, quantity, addToCart, removeFromCart }) {
  return (
    <div className="ProductCard">
      <Link to={`/products/${product.id}`} className="media">
        <img
          src={product.imageUrl || codepath}
          alt={product.name}
        />
      </Link>

      <div className="product-info">
        <div className="info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>

        <div className="actions">
          <button onClick={() => removeFromCart(product)} disabled={quantity === 0} className="qty-btn">
            −
          </button>

          <span className="qty-display">{quantity}</span>

          <button onClick={() => addToCart(product)} className="qty-btn">
            +
          </button>
        </div>
      </div>
    </div>
  )
}
