const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function seed() {
  try {
    console.log('🌱 Seeding database...\n')

    // Clear existing data (using raw SQL to reset tables and IDs)
    await prisma.$executeRawUnsafe(
      `TRUNCATE "OrderItem", "Order", "Product" RESTART IDENTITY CASCADE;`
    )

    // Load JSON data from the data directory
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8')
    )
    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8')
    )

    // Seed products
    for (const prod of productsData.products) {
      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          imageUrl: prod.image_url,
          category: prod.category,
        },
      })
    }

    // Seed orders and nested order items
    for (const ord of ordersData.orders) {
      const created = await prisma.order.create({
        data: {
          customer: ord.customer_id,
          totalPrice: ord.total_price,
          status: ord.status,
          createdAt: new Date(ord.created_at),
          orderItems: {
            create: ord.items.map(item => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { orderItems: true },
      })

      console.log(`✅ Created order #${created.id} with ${created.orderItems.length} item(s)`)
    }

    console.log('\n🎉 Seeding complete!')
  } catch (err) {
    console.error('❌ Error seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()