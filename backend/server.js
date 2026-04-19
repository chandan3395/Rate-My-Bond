import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express() 

app.use(cors({
    origin: process.env.FRONTEND_URL
})) ;

app.use(express.json()) 

app.get('/',(req,res) => {
    res.json({message: 'rate my bond API is running'})
}) ;

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`backend running on port ${PORT}`)
});