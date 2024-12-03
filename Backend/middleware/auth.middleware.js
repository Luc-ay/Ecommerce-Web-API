import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.params.accessToken
    if (!accessToken) {
      res.status(500).json({ message: 'Token not found' })
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) {
        res.status(500).json({ message: 'User not found' })
      }
      req.user = user
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(500).json({ message: 'Token Expired' })
      }
      throw error
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Invalid Token' })
  }
}

export const adminRoute = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ Message: 'Access Denied - Admin Only' })
  }
}
