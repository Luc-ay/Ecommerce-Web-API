import express from 'express'
import {
  login,
  logout,
  refreshToken,
  signup,
} from '../controllers/auth.controllers.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refreshToken', refreshToken)

export default router
