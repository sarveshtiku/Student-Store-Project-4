const express = require('express')
const router = express.Router()
const prisma = require('../db/db')

// ─── LIST ORDERS (with optional email filter) ────────────────────────────────
router.get('/', async (req, res) => {
  const { email } = req.query
  try {
    const orders = await prisma.order.findMany({
      where: email ? { customerEmail: email } : {},
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// ─── GET ONE ORDER ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { product: true } } },
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// ─── CREATE ORDER ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { customerEmail, status, items } = req.body
  if (!customerEmail || !items?.length) {
    return res
      .status(400)
      .json({ error: 'customerEmail and items are required' })
  }

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  try {
    const created = await prisma.order.create({
      data: {
        customerEmail,
        status,
        totalPrice,
        createdAt: new Date(),
        orderItems: { create: items },
      },
      include: { orderItems: { include: { product: true } } },
    })
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// ─── UPDATE ORDER ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: req.body,
      include: { orderItems: { include: { product: true } } },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// ─── DELETE ORDER ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.order.delete({ where: { id } })
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

// ─── ORDER-ITEMS ENDPOINTS ─────────────────────────────────────────────────────

// GET /order-items — list every OrderItem
router.get('/items/all', async (_req, res) => {
  try {
    const items = await prisma.orderItem.findMany({
      include: { product: true, order: true },
    })
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order items' })
  }
})

// POST /orders/:id/items — add item to existing order
router.post('/:id/items', async (req, res) => {
  const orderId = Number(req.params.id)
  const { productId, quantity, price } = req.body
  if (!productId || !quantity || !price) {
    return res
      .status(400)
      .json({ error: 'productId, quantity and price are required' })
  }

  try {
    const newItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
    })
    res.status(201).json(newItem)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item to order' })
  }
})

module.exports = router
