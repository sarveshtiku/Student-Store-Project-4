// src/components/Sidebar/Sidebar.jsx
import { Link } from "react-router-dom"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import logo from "../../assets/codepath.svg"
import "./Sidebar.css"

export default function Sidebar({
  isOpen,
  toggleSidebar,
  cart,
  products,
  getQuantity,
  getTotalItems,
  handleOnCheckout,
  isCheckingOut,
  order,
  error,
  userInfo,
  setUserInfo,
}) {
  return (
    <section className={`Sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="wrapper">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="codepath logo" />
          </Link>
        </div>

        {/* ── Past Orders Link ───────────────────────── */}
        <nav className="sidebar-nav">
          <Link to="/orders" className="past-orders-link">
            Past Orders
          </Link>
        </nav>

        <span
          className={`toggle-button button ${isOpen ? "open" : "closed"}`}
          onClick={toggleSidebar}
        >
          <i className="material-icons md-48">arrow_forward</i>
        </span>

        <ShoppingCart
          isOpen={isOpen}
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
      </div>
    </section>
  )
}
