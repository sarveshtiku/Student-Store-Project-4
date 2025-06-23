const express = require('express')
const router = express.Router()
const prisma = require('../db/db')

// GET /products — list, with optional filter & sort
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query
    const where = category ? { category } : {}
    const orderBy = sort === 'price'
      ? { price: 'asc' }
      : sort === 'name'
      ? { name: 'asc' }
      : undefined

    const products = await prisma.product.findMany({ where, orderBy })
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /products/:id — single product
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// POST /products — create
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body
  try {
    const newProduct = await prisma.product.create({
      data: { name, description, price, imageUrl, category },
    })
    res.status(201).json(newProduct)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// PUT /products/:id — update
router.put('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// DELETE /products/:id — remove
router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    await prisma.product.delete({ where: { id } })
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

module.exports = router
