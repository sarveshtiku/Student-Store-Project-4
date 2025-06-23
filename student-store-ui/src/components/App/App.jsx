// src/components/App/App.jsx
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { fetchJSON } from "../../services/api"

import SubNavbar from "../SubNavbar/SubNavbar"
import Home from "../Home/Home"
import ProductDetail from "../ProductDetail/ProductDetail"
import Sidebar from "../Sidebar/Sidebar"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import CheckoutSuccess from "../CheckoutSuccess/CheckoutSuccess"

import "./App.css"

export default function App() {
  // UI & data
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})           // { [productId]: qty }
  const [isFetching, setIsFetching] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Categories")
  const [searchInputValue, setSearchInputValue] = useState("")
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: "" })

  // load products once
  useEffect(() => {
    setIsFetching(true)
    fetchJSON("/products")
      .then(setProducts)
      .catch(setError)
      .finally(() => setIsFetching(false))
  }, [])

  // cart helpers
  const addToCart = (product) =>
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }))

  const removeFromCart = (product) =>
    setCart((c) => {
      const next = { ...c }
      next[product.id] = (next[product.id] || 0) - 1
      if (next[product.id] <= 0) delete next[product.id]
      return next
    })

  const clearCart = () => setCart({})

  const getQuantity = (product) => cart[product.id] || 0
  const getTotalItems = () =>
    Object.values(cart).reduce((sum, q) => sum + q, 0)

  // checkout: POST /orders
  const handleOnCheckout = async () => {
    setIsCheckingOut(true)
    setError(null)

    const items = Object.entries(cart).map(([id, qty]) => ({
      productId: +id,
      quantity: qty,
      price: products.find((p) => p.id === +id).price,
    }))

    try {
      const created = await fetchJSON("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: 123,   // replace when you have real auth
          status: "pending",
          items,
        }),
      })
      setOrder(created)
      clearCart()
      setSidebarOpen(true)
    } catch (e) {
      setError(e)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        {/* slide-out cart sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((o) => !o)}
          cart={cart}
          products={products}
          getQuantity={getQuantity}
          getTotalItems={getTotalItems}
          handleOnCheckout={handleOnCheckout}
          isCheckingOut={isCheckingOut}
          order={order}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />

        <main>
          {/* category / search bar */}
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={(e) =>
              setSearchInputValue(e.target.value)
            }
          />

          <Routes>
            {/* product grid */}
            <Route
              path="/"
              element={
                <Home
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  searchInputValue={searchInputValue}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  getQuantity={getQuantity}
                />
              }
            />

            {/* product detail page */}
            <Route
              path="/products/:productId"
              element={
                <ProductDetail
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  getQuantity={getQuantity}
                />
              }
            />

            {/* full cart view */}
            <Route
              path="/cart"
              element={
                <ShoppingCart
                  products={products}
                  cart={cart}
                  clearCart={clearCart}
                  error={error}
                  isCheckingOut={isCheckingOut}
                  handleOnCheckout={handleOnCheckout}
                  order={order}
                />
              }
            />

            {/* after-checkout confirmation */}
            <Route
              path="/checkout-success"
              element={<CheckoutSuccess order={order} />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}
