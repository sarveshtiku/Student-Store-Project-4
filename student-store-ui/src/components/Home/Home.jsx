// src/components/Home/Home.jsx
import React from "react"
import ProductGrid from "../ProductGrid/ProductGrid"
import "./Home.css"

export default function Home({
  products,
  isFetching,
  addToCart,
  removeFromCart,
  getQuantity,
  activeCategory,
  searchInputValue,
}) {
  if (isFetching) return <div>Loading products…</div>

  // filter logic
  let list = products
  if (activeCategory !== "All Categories") {
    list = list.filter((p) => p.category === activeCategory)
  }
  if (searchInputValue) {
    const q = searchInputValue.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q))
  }
  return (
    <ProductGrid
      products={list}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      getQuantity={getQuantity}
    />
  )
}
