// src/server.js
import express from 'express'
import cors from 'cors'

import productsRouter   from './routes/products.js'
import ordersRouter     from './routes/orders.js'
import orderItemsRouter from './routes/orderItems.js'
const app = express()

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())            // allow cross-origin (adjust in production!)
app.use(express.json())    // parse JSON bodies

// ─── Routes ────────────────────────────────────────────────────────────────────
// Products CRUD
app.use('/products', productsRouter)

// Orders CRUD + nested items
app.use('/orders', ordersRouter)

// Standalone order-items listing
app.use('/order-items', orderItemsRouter)

// Health check (optional)
app.get('/', (req, res) => {
  res.send({ status: 'OK', timestamp: new Date().toISOString() })
})

// ─── Server ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
