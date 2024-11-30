import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
// routes
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  await connectDb()
  console.log('Server is running on http://localhost:' + PORT)
})