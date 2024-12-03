import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Product Image is Required'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Product = mongoose.model('product', productSchema)

export default Product
