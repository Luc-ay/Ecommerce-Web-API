import express from 'express'
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from '../controllers/product.controllers.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/recommendations', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)
router.post('/create', protectRoute, adminRoute, createProduct)
router.put('/"id', protectRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectRoute, adminRoute, deleteProduct)

export default router
