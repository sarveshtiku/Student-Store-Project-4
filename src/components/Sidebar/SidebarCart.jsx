import "./Sidebar.css"

export default function SidebarCart({
  cart,
  products,
  getQuantity,
  handleOnCheckout,
  isCheckingOut,
  order,
  error,
  userInfo,
  setUserInfo,
}) {
  // Calculate subtotal, taxes, total
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)
  const taxes = +(subtotal * 0.0875).toFixed(2)
  const total = +(subtotal + taxes).toFixed(2)

  return (
    <div className="sidebar-cart">
      <h3>Your Cart</h3>
      <div className="sidebar-cart-items">
        {cart.length === 0 && <div className="empty">Cart is empty</div>}
        {cart.map(item => {
          const product = products.find(p => p.id === item.id)
          if (!product) return null
          return (
            <div className="sidebar-cart-item" key={item.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <div className="name">{product.name}</div>
                <div className="qty-controls">
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="price">${(product.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="sidebar-cart-summary">
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Taxes & Fees: ${taxes.toFixed(2)}</div>
        <div className="total">Total: ${total.toFixed(2)}</div>
      </div>
      <form className="sidebar-cart-payment" onSubmit={e => { e.preventDefault(); handleOnCheckout(); }}>
        <input
          type="text"
          placeholder="Student ID"
          value={userInfo.studentId}
          onChange={e => setUserInfo({ ...userInfo, studentId: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
        />
        <button type="submit" disabled={isCheckingOut}>
          {isCheckingOut ? "Processing..." : "Submit"}
        </button>
        {error && <div className="error">{error}</div>}
        {order && <div className="success">Order placed!</div>}
      </form>
    </div>
  )
} 