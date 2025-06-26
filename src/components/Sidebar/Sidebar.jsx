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
    <aside className={`Sidebar${isOpen ? " open" : " closed"}`}>
      <div className="sidebar-wrapper">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="codepath logo" />
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/orders" className="past-orders-link">
            Past Orders
          </Link>
        </nav>
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
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