const express = require('express')
const router = express.Router()
const prisma = require('../db/db')

// GET /orders — list all orders + items
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
    })
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /orders/:id — one order + its items
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// POST /orders — create an order with items
router.post('/', async (req, res) => {
  const { customer, status, items } = req.body
  // items = [ { productId, quantity, price }, ... ]
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  try {
    const created = await prisma.order.create({
      data: {
        customer,
        status,
        totalPrice,
        createdAt: new Date(),
        orderItems: { create: items },
      },
      include: { orderItems: true },
    })
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// PUT /orders/:id — update order fields
router.put('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: req.body,
      include: { orderItems: true },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// DELETE /orders/:id — delete order + cascade items
router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    await prisma.order.delete({ where: { id } })
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

module.exports = router
