import mongoose from 'mongoose'

export const connectDb = async (req, res, next) => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log('Error in connecting to data base', error.message)
    process.exit(1)
  }
}
