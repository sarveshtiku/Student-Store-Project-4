// src/routes/orderItems.js
const express = require('express')
const router = express.Router()
const prisma = require('../db/db')

// GET /order-items — list every order item, with its product & order
router.get('/', async (req, res) => {
  try {
    const items = await prisma.orderItem.findMany({
      include: {
        product: true,
        order: true,
      },
    })
    res.json(items)
  } catch (err) {
    console.error('GET /order-items error:', err)
    res.status(500).json({ error: 'Failed to fetch order items' })
  }
})

// 2️⃣ POST /orders/:orderId/items — add one item to an existing order
router.post('/orders/:orderId/items', async (req, res) => {
  const orderId = Number(req.params.orderId)
  const { productId, quantity, price } = req.body

  if (!productId || !quantity || !price) {
    return res.status(400).json({ error: 'productId, quantity and price are required' })
  }

  try {
    const newItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
      include: { product: true }, // if you want the product joined back
    })
    res.status(201).json(newItem)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item to order' })
  }
})

module.exports = router
