import Coupon from '../models/coupon.model.js'

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ userId: req.user._id, Active: true })
    res.json(coupon || null)
  } catch (error) {
    console.log('Error in getting all coupons', error.message)
    res.status(500).json({
      Message: 'Error in getting all coupons',
      Error: error.message,
    })
  }
}

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      Active: true,
    })
    if (!coupon) {
      return res.status(400).json({ message: ' Coupon not Found' })
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false
      await coupon.save()
      return res.status(400).json({ message: ' Coupon Expired' })
    }
    res.json({
      message: 'Coupon Valid',
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    })
  } catch (error) {
    console.log('Error in validating coupon', error.message)
    res.status(500).json({
      Message: 'Error in validating coupon',
      Error: error.message,
    })
  }
}
