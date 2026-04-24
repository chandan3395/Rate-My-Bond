import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import analyzeRouter from './src/routes/analyze.js'
import rateLimit from 'express-rate-limit'
import issuersRouter from './src/routes/issuers.js'
import mongoose from 'mongoose'


const app = express() 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests' }
})

app.use(cors({
    origin: process.env.FRONTEND_URL
})) ;

app.use(express.json()) 
app.use('/api/analyze', limiter)

app.get('/',(req,res) => {
    res.json({message: 'rate my bond API is running'})
}) ;

app.use('/api/analyze', analyzeRouter)
app.use('/api/issuers', issuersRouter)
dotenv.config()

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`backend running on port ${PORT}`)
});