// src/components/ShoppingCart/ShoppingCart.jsx
import { useNavigate } from "react-router-dom"
import PaymentInfo from "../PaymentInfo/PaymentInfo"
import CheckoutSuccess from "../CheckoutSuccess/CheckoutSuccess"
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
}) {
  const navigate = useNavigate()

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
      quantity: qty,
      totalPrice: p.price * qty,
    }
  })

  const subtotal = rows.reduce((sum, r) => sum + r.totalPrice, 0)
  const taxesAndFees = calculateTaxesAndFees(subtotal)
  const total = calculateTotal(subtotal)

  if (order) {
    // You could also <Navigate to="/checkout-success" /> here
    navigate("/checkout-success")
    return null
  }

  // If cart is empty
  if (rows.length === 0) {
    return (
      <div className="ShoppingCart notification">
        No items in cart. Add some from the catalog!
      </div>
    )
  }

  return (
    <div className="ShoppingCart">
      {/* Cart table */}
      <div className="CartTable">
        <div className="header-row">
          <span className="flex-2">Name</span>
          <span className="center">Qty</span>
          <span className="center">Unit</span>
          <span className="center">Cost</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="product-row">
            <span className="flex-2">{r.name}</span>
            <span className="center">{r.quantity}</span>
            <span className="center">{formatPrice(r.price)}</span>
            <span className="center">{formatPrice(r.totalPrice)}</span>
          </div>
        ))}
      </div>

      {/* Receipt summary with tax */}
      <div className="receipt">
        <div className="row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="row">
          <span>Taxes & Fees</span>
          <span>{formatPrice(taxesAndFees)}</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment form */}
      <PaymentInfo
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        handleOnCheckout={handleOnCheckout}
        isCheckingOut={isCheckingOut}
        error={error}
      />
    </div>
  )
}
