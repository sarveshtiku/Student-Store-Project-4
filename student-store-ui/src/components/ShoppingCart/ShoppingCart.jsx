// src/components/ShoppingCart/ShoppingCart.jsx

import React from "react"
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
  // Look up product data by ID
  const productMap = products.reduce((map, p) => {
    map[p.id] = p
    return map
  }, {})

  // Build rows for items in cart
  const rows = Object.entries(cart).map(([pid, qty]) => {
    const p = productMap[pid]
    return {
      ...p,
      quantity: qty,
      totalPrice: p.price * qty,
    }
  })

  // Totals
  const subTotal = rows.reduce((sum, r) => sum + r.totalPrice, 0)
  const fees = calculateTaxesAndFees(subTotal)
  const total = calculateTotal(subTotal)

  // If order just placed, show success screen
  if (order) {
    return <CheckoutSuccess order={order} />
  }

  return (
    <div className="ShoppingCart">
      {rows.length === 0 ? (
        <div className="notification">
          No items in cart. Add some from the catalog!
        </div>
      ) : (
        <>
          {/* Cart Items Table */}
          <div className="CartTable">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="center">Qty</th>
                  <th className="center">Unit Price</th>
                  <th className="center">Cost</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td className="center">{r.quantity}</td>
                    <td className="center">{formatPrice(r.price)}</td>
                    <td className="center">{formatPrice(r.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Receipt */}
          <div className="receipt">
            <div className="row">
              <span>Subtotal</span>
              <span>{formatPrice(subTotal)}</span>
            </div>
            <div className="row">
              <span>Taxes & Fees</span>
              <span>{formatPrice(fees)}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <PaymentInfo
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleOnCheckout={handleOnCheckout}
            isCheckingOut={isCheckingOut}
            error={error}
          />
        </>
      )}
    </div>
  )
}
