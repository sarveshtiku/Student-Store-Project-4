// src/routes/orders.js
const express = require('express')
const router = express.Router()
const prisma = require('../db/db')

// GET /orders — list all orders (you probably don’t need product details here)
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { /* you can omit product here if you only need totals in the list view */ },
        },
      },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /orders/:id — one order + its items + each item’s product
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: true },    // <<<<< make sure to include product
        },
      },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /orders — create a new order with items
router.post('/', async (req, res) => {
  const { customer, status, items } = req.body
  if (!customer || !status || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ error: 'customer, status and items[] are required' })
  }

  // compute total price server-side
  const totalPrice = items.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  )

  try {
    const created = await prisma.order.create({
      data: {
        customer,
        status,
        totalPrice,
        createdAt: new Date(),
        orderItems: {
          create: items.map(({ productId, quantity, price }) => ({
            product: { connect: { id: productId } },
            quantity,
            price,
          })),
        },
      },
      include: {
        orderItems: { include: { product: true } },
      },
    })
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// PUT /orders/:id — update order fields (e.g. status)
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: req.body,
      include: {
        orderItems: { include: { product: true } },
      },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// DELETE /orders/:id — delete order (cascades to items)
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

//
// ─── ORDER-ITEM SUB-RESOURCE ────────────────────────────────────────────────────
//

// GET /orders/:id/items — list items for a given order
router.get('/:id/items', async (req, res) => {
  const orderId = Number(req.params.id)
  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true },
    })
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order items' })
  }
})

// POST /orders/:id/items — add a new item to an existing order
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
        order: { connect: { id: orderId } },
        product: { connect: { id: productId } },
        quantity,
        price,
      },
      include: { product: true },
    })
    res.status(201).json(newItem)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item to order' })
  }
})

module.exports = router
