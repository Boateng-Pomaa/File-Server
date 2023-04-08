import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyparser from "body-parser"
import route from './routes/userRoute.js'

dotenv.config()

const app = express()



app.use(express.json())
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: false }))
app.use(route)
app.use(cors())

const port = process.env.PORT ||3000
const db = process.env.DB_URL

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
}).then(() => {
    console.log('connected to MongoDB')
})


app.listen(port,()=>{
    console.log(`server listening on ${port}`)
})