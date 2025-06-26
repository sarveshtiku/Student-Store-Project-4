import { Link } from "react-router-dom"
import SidebarCart from "./SidebarCart"
import logo from "../../assets/codepath.svg"
import "./Sidebar.css"

export default function Sidebar({
  isOpen,
  toggleSidebar,
  cart,
  products,
  getQuantity,
  handleOnCheckout,
  isCheckingOut,
  order,
  error,
  userInfo,
  setUserInfo,
  removeFromCart,
}) {
  return (
    <aside className={`Sidebar${isOpen ? " open" : " closed"}`} aria-label="Sidebar">
      <div className="sidebar-wrapper">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Student Store Logo" />
          </Link>
        </div>
        <nav className="sidebar-nav" aria-label="Sidebar Navigation">
          <Link to="/orders" className="past-orders-link">
            Past Orders
          </Link>
        </nav>
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <span className="material-icons">arrow_forward</span>
        </button>
        {isOpen && (
          <SidebarCart
            cart={cart}
            products={products}
            getQuantity={getQuantity}
            handleOnCheckout={handleOnCheckout}
            isCheckingOut={isCheckingOut}
            order={order}
            error={error}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            removeFromCart={removeFromCart}
          />
        )}
      </div>
    </aside>
  )
}