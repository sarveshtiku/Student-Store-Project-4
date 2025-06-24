// src/components/PastOrders/PastOrders.jsx
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { fetchJSON } from "../../services/api"
import "./PastOrders.css"

export default function PastOrders() {
  const { orderId } = useParams()
  const [orders, setOrders] = useState([])
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (orderId) {
      fetchJSON(`/orders/${orderId}`)
        .then((o) => {
          if (!o) throw new Error("Order not found")
          setOrder(o)
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    } else {
      fetchJSON("/orders")
        .then(setOrders)
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    }
  }, [orderId])

  // If we're waiting on data:
  if (loading) return <p>Loading…</p>
  // If there was an error fetching either the list or a single order
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>

  // DETAIL view for a specific order
  if (orderId) {
    // guard against missing order
    if (!order) {
      return (
        <div className="PastOrders-detail">
          <p>Order #{orderId} not found.</p>
          <Link to="/orders">← Back to all orders</Link>
        </div>
      )
    }

    return (
      <div className="PastOrders-detail">
        <h2>Order #{order.id}</h2>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item.id}>
              {item.quantity}× {item.product.name} @{" "}
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>
          <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
        </p>
        <Link to="/orders">← Back to all orders</Link>
      </div>
    )
  }

  // Otherwise LIST view of all orders
  return (
    <div className="PastOrders-list">
      <h2>Past Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`}>
                Order #{o.id} — {o.createdAt.slice(0, 10)} — $
                {o.totalPrice.toFixed(2)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
