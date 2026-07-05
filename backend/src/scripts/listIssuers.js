import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Issuer from '../models/Issuer.js'

dotenv.config()

async function list() {
  await mongoose.connect(process.env.MONGO_URI)
  const issuers = await Issuer.find({}, { issuer: 1, _id: 0 }).sort({ issuer: 1 })
  issuers.forEach((i, idx) => console.log(`${idx + 1}. ${i.issuer}`))
  await mongoose.disconnect()
}

list().catch(console.error)