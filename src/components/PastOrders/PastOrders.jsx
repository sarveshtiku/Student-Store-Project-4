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

  // Email filter state (live filtering)
  const [emailFilter, setEmailFilter] = useState("")
  const [filtering, setFiltering] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (orderId) {
      // Fetch a single order
      fetchJSON(`/orders/${orderId}`)
        .then((o) => {
          if (!o) throw new Error("Order not found")
          setOrder(o)
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    } else {
      // Fetch list, optionally filtered by email
      const base = "/orders"
      const url = emailFilter
        ? `${base}?email=${encodeURIComponent(emailFilter)}`
        : base

      setFiltering(!!emailFilter)
      fetchJSON(url)
        .then(setOrders)
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    }
  }, [orderId, emailFilter])

  if (loading) return <p>Loading…</p>
  if (error) return <p className="error">Error: {error.message}</p>

  // DETAIL VIEW
  if (orderId) {
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
        <p>
          <strong>Customer:</strong> {order.customerEmail}
        </p>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item.id}>
              {item.quantity}× {item.product.name} @ $
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

  // LIST VIEW
  return (
    <div className="PastOrders-list">
      <h2>Past Orders</h2>

      {/* Email filter */}
      <div className="email-filter">
        <input
          type="email"
          placeholder="Filter by customer email"
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
        />
        {emailFilter && (
          <button onClick={() => setEmailFilter("")}>Clear</button>
        )}
      </div>

      {orders.length === 0 ? (
        <p>
          {filtering
            ? "No orders found for that email."
            : "No orders yet."}
        </p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`}>
                #{o.id} — {o.customerEmail} —{" "}
                {o.createdAt.slice(0, 10)} — $
                {o.totalPrice.toFixed(2)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 