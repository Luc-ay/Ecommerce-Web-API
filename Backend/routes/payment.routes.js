import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import {
  createCheckoutSession,
  orderSession,
} from '../controllers/payment.controllers.js'

const router = express.Router()

router.post('/create-checkout-session', protectedRoute, createCheckoutSession)
router.post('/checkout-success', protectedRoute, orderSession)

export default router
