import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import cartRoutes from './routes/cart.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
// routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  await connectDb()
  console.log('Server is running on http://localhost:' + PORT)
})
