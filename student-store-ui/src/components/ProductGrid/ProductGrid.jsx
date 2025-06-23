// src/components/ProductGrid/ProductGrid.jsx
import React from "react"
import ProductCard from "../ProductCard/ProductCard"
import "./ProductGrid.css"

export default function ProductGrid({
  products = [],
  addToCart,
  removeFromCart,
  getQuantity,
}) {
  if (!products.length)
    return <div>No products available for this filter.</div>

  return (
    <div className="ProductGrid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={getQuantity(product)}
          addToCart={() => addToCart(product)}
          removeFromCart={() => removeFromCart(product)}
        />
      ))}
    </div>
  )
}
