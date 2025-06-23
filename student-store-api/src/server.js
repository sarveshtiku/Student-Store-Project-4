require('dotenv').config()
const express = require('express')
const cors = require('cors')
const prisma = require('./db/db')

const app = express()
app.use(cors())
app.use(express.json())

// Mount routers
app.use('/products', require('./routes/products'))
app.use('/orders',   require('./routes/orders'))

// Health check
app.get('/', (req, res) => {
  res.send('🎉 Student Store API is live!')
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
