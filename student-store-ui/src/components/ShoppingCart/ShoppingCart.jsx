import PaymentInfo from "../PaymentInfo/PaymentInfo"
import { calculateTaxesAndFees, calculateTotal } from "../../utils/calculations"
import { formatPrice } from "../../utils/format"
import "./ShoppingCart.css"

export default function ShoppingCart({
  products,
  cart,
  userInfo,
  setUserInfo,
  clearCart,
  error,
  isCheckingOut,
  handleOnCheckout,
  order,
  addToCart,
  removeFromCart,
}) {
  // Build lookup map for products
  const productMap = products.reduce((map, p) => {
    map[p.id] = p
    return map
  }, {})

  // Turn cart object into an array of rows
  const rows = Object.entries(cart).map(([pid, qty]) => {
    const p = productMap[pid]
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      quantity: qty,
      totalPrice: p.price * qty,
    }
  })

  const subtotal = rows.reduce((sum, r) => sum + r.totalPrice, 0)
  const taxesAndFees = calculateTaxesAndFees(subtotal)
  const total = calculateTotal(subtotal)

  if (order) {
    window.location.href = "/checkout-success"
    return null
  }

  if (rows.length === 0) {
    return (
      <div className="ShoppingCart notification">
        No items in cart. Add some from the catalog!
      </div>
    )
  }

  return (
    <div className="ShoppingCart amazon-cart">
      <div className="cart-main">
        {/* LEFT: Cart Items */}
        <div className="cart-items">
          <h2>Your Cart</h2>
          {rows.map((r) => (
            <div key={r.id} className="cart-item">
              <img src={r.imageUrl} alt={r.name} className="cart-item-image" />
              <div className="cart-item-info">
                <div className="cart-item-name">{r.name}</div>
                <div className="cart-item-qty-controls">
                  <button onClick={() => removeFromCart(productMap[r.id])} disabled={r.quantity <= 1}>-</button>
                  <span className="cart-item-qty">{r.quantity}</span>
                  <button onClick={() => addToCart(productMap[r.id])}>+</button>
                  <button className="cart-item-remove" onClick={() => removeFromCart(productMap[r.id], true)}>Remove</button>
                </div>
                <div className="cart-item-price">{formatPrice(r.price)} each</div>
                <div className="cart-item-total">Total: {formatPrice(r.totalPrice)}</div>
              </div>
            </div>
          ))}
        </div>
        {/* RIGHT: Summary and Checkout */}
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Fees</span>
            <span>{formatPrice(taxesAndFees)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <PaymentInfo
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleOnCheckout={handleOnCheckout}
            isCheckingOut={isCheckingOut}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}