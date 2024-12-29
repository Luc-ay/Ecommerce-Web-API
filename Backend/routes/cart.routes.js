import express from 'express'
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProduct,
} from '../controllers/cart.controllers.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protectRoute, getCartProduct)
router.post('/', protectRoute, addToCart)
router.delete('/', protectRoute, removeAllFromCart)
router.put('/:id', protectRoute, updateQuantity)

export default router
