// src/components/App/App.jsx
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { fetchJSON } from "../../services/api"

import SubNavbar from "../SubNavbar/SubNavbar"
import Home from "../Home/Home"
import ProductDetail from "../ProductDetail/ProductDetail"
import Sidebar from "../Sidebar/Sidebar"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import CheckoutSuccess from "../CheckoutSuccess/CheckoutSuccess"
import PastOrders from "../PastOrders/PastOrders"

import "./App.css"

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [isFetching, setIsFetching] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Categories")
  const [searchInputValue, setSearchInputValue] = useState("")
  const [userInfo, setUserInfo] = useState({ name: "", email: "" })

  const navigate = useNavigate()
  const location = useLocation()

  // Load products
  useEffect(() => {
    setIsFetching(true)
    fetchJSON("/products")
      .then(setProducts)
      .catch(setError)
      .finally(() => setIsFetching(false))
  }, [])

  // Clear order when navigating away from checkout-success
  useEffect(() => {
    if (location.pathname !== "/checkout-success" && order) {
      setOrder(null)
    }
  }, [location.pathname])

  // Cart logic
  const addToCart = (p) =>
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }))

  const removeFromCart = (p, removeAll = false) =>
    setCart((c) => {
      const next = { ...c }
      if (removeAll) {
        delete next[p.id]
      } else {
        next[p.id] = (next[p.id] || 0) - 1
        if (next[p.id] <= 0) delete next[p.id]
      }
      return next
    })

  const clearCart = () => setCart({})
  const getQuantity = (p) => cart[p.id] || 0
  const getTotalItems = () =>
    Object.values(cart).reduce((sum, q) => sum + q, 0)

  // Checkout logic
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
          customerEmail: userInfo.email,
          status: "pending",
          items,
        }),
      })
      setOrder(created)
      clearCart()
      setSidebarOpen(true)
      navigate("/checkout-success")
    } catch (e) {
      setError(e)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="App">
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
        <SubNavbar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchInputValue={searchInputValue}
          handleOnSearchInputChange={(e) =>
            setSearchInputValue(e.target.value)
          }
          getTotalItems={getTotalItems}
        />

        <Routes>
          {/* Home & Listing */}
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

          {/* Product detail */}
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

          {/* Cart */}
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
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            }
          />

          {/* Post‐checkout success */}
          <Route
            path="/checkout-success"
            element={<CheckoutSuccess order={order} />}
          />

          {/* Past orders listing */}
          <Route path="/orders" element={<PastOrders />} />

          {/* Optionally: you could show a detail page for one order */}
          <Route path="/orders/:orderId" element={<PastOrders />} />
        </Routes>
      </main>
    </div>
  )
}