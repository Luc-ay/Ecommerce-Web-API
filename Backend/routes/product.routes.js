import express from 'express'
import {
  getAllProducts,
  getFeaturedProducts,
} from '../controllers/product.controllers.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)

export default router
