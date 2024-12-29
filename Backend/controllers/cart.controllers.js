import Product from '../models/product.model.js'
export const getCartProduct = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } })

    // add qauntity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === PerformanceResourceTiming.id
      )
      return { ...product.toJSON(), quantity: item.quantity }
    })
    res.json(cartItems)
  } catch (error) {
    console.log('Error in getting all Cart Items', error.message)
    res.status(500).json({
      Message: 'Error in getting all Cart Items',
      Error: error.message,
    })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body
    const user = req.user
    const existingItem = user.cartItems.find((item) => item.id === productId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      user.cartItems.push(productId)
    }

    await user.save()
    res.status(201).json(user.cartItems)
  } catch (error) {
    console.log(error.message)
    res
      .status(500)
      .json({ message: 'Error in Add to cart API', error: error.message })
  }
}

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body
    const user = req.user
    if (!productId) {
      user.cartItems = []
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId)
    }

    await user.save()
    res.status(201).json(user.cartItems)
  } catch (error) {
    console.log('Error in Remove cart Items API', error.message)
    res.status(500).json({
      Message: 'Error in Remove cart Items API',
      error: error.message,
    })
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const { lid: productId } = req.params
    const quantity = req.body
    const user = req.user
    const existingItem = await user.cartItems.find((item) => item === productId)
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = await user.cartItems.filter(
          (item) => item !== productId
        )
        await user.save()
        res.status(201).json(user.cartItems)
      }
      existingItem.quantity = quantity
      await user.save()
      res.json(user.cartItems)
    } else {
      res.status(404).json({ Message: 'Product not found' })
    }
  } catch (error) {
    console.log('Error in update cart item API', error.message)
    res.save(500).json({
      Message: 'Error in update cart item API',
      Error: error.message,
    })
  }
}
