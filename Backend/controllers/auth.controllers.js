import { redis } from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

// Generate Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}
// Store Refresh Token
const storeRefreshToken = async (userId, refreshToken) => {
  const timeInSeconds = 7 * 24 * 60 * 60
  await redis.set(`refresh_token: ${userId}`, refreshToken, 'EX', timeInSeconds)
}

// Set Cookies
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

// Signup Controller
export const signup = async (req, res) => {
  const { email, password, name } = req.body
  try {
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(400).json({ message: 'User Already Exist' })
    }

    const user = await User.create({ email, password, name })

    //authenticate
    const { accessToken, refreshToken } = generateTokens(user._id)
    await storeRefreshToken(user._id, refreshToken)

    setCookies(res, accessToken, refreshToken)
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'User Created Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(500).json({ message: 'User Does not Exis' })
    }

    // Check for Password
    const passwordIsValid = await user.comparePassword(password)
    if (!passwordIsValid) {
      return res.status(500).json({ message: 'Invalid Password' })
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user._id)
    // Store Refresh Token
    await storeRefreshToken(user._id, refreshToken)
    // Set Cookies
    setCookies(res, accessToken, refreshToken)

    //Success Message
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Login Successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// Logout Controller
export const logout = async (req, res) => {
  try {
    // Check if the refreshToken exists in cookies
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' })
    }

    // Verify the refresh token
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired refresh token' })
    }

    // Delete the refresh token from Redis
    await redis.del(`refresh_token:${decoded.userId}`)

    // Clear the cookies
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    // Send success response
    res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Logout Error:', error) // More specific error logging
    res.status(500).json({
      message: 'An error occurred while logging out. Please try again later.',
    })
  }
}

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken = await redis.get(`refresh_token: ${decoded.userId}`)

    if (storedToken !== refreshToken) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired refresh token' })
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      }
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.status(200).json({ message: 'Token Refreshed Successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}
