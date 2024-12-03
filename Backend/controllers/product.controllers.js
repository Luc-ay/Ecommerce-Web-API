import Redis from 'ioredis'
import Product from '../models/product.model.js'

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findOne({})
    res.json({ products })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: 'Error in Get all Product API', error: error.message })
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Redis.get('featured_products')
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts))
    }
    // if not in redis, fetch from MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean()
    if (!featuredProducts) {
      return res.status(404).json({ Message: 'No Featured Product Found' })
    }

    // Store in Redis
    await Redis.set('featured_product', JSON_stringify(featuredProducts))
    res.json({ featuredProducts })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: 'Error in Get all Product API', error: error.message })
  }
}

export const getSingleProduct = async (req, res) => {}
