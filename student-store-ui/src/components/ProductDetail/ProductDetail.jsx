// src/components/ProductDetail/ProductDetail.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchJSON } from "../../services/api"
import { formatPrice } from "../../utils/format"
import "./ProductDetail.css"

export default function ProductDetail({ addToCart, removeFromCart, getQuantity }) {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchJSON(`/products/${productId}`)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return <p>Loading…</p>
  if (error) return <p>Error loading product.</p>
  if (!product) return <p>Product not found.</p>

  const qty = getQuantity(product)

  return (
    <div className="ProductDetail">
      <Link to="/" className="back-link">← Back</Link>

      <div className="detail-card">
        <div className="media">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="info">
          <h2>{product.name}</h2>
          <p className="price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          <div className="actions">
            <button onClick={() => removeFromCart(product)} disabled={qty === 0}>−</button>
            <span className="qty">{qty}</span>
            <button onClick={() => addToCart(product)}>＋</button>
          </div>
        </div>
      </div>
    </div>
  )
}
