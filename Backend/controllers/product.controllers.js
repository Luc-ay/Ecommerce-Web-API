import Redis from 'ioredis'
import Product from '../models/product.model.js'
import cloudinary from '../lib/cloudinary.js'

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

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body
    if (!name || !description || !price) {
      res
        .status(400)
        .json({ Message: 'name, description & price are required' })
    }

    let cloudinaryResponse = null
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'products',
      })
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url,
      category,
    })

    res.status(200).json(product)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'Error in Create product API',
      error: error.message,
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404).json({ Messgae: 'Product not Found' })
    }

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0]
      try {
        await cloudinary.uploder.destroy(`products/${publicId}`)
        console.log('Image Deleted on Cloud')
      } catch (error) {
        console.log('Error Deleting Image from Cloudinary', error)
      }
    }

    await Product.findByIdAndDelete(req.params.id)
    res.status(201).json({ Message: 'Product Deleted' })
  } catch (error) {
    console.log('Error in Delete Product API', error.message)
    res
      .status(500)
      .json({ Message: 'Error in Delete Product API', Error: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ])

    res.json(products)
  } catch (error) {
    console.log(error.message)
    res
      .status(500)
      .json({ Message: 'Error in Recommendation API', Error: error.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params
  try {
    const products = await Product.find({ category })
    res.status(200).json(products)
  } catch (error) {
    console.log(error.message)
    res
      .status(500)
      .json({ Message: 'Error in Category API', Error: error.message })
  }
}
export const getSingleProduct = async (req, res) => {}
