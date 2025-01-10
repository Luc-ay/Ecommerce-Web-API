import express from 'express'
import {
  getProfile,
  login,
  logout,
  refreshToken,
  signup,
} from '../controllers/auth.controllers.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refreshToken', refreshToken)
router.get('/profile', protectRoute, getProfile)
export default router
