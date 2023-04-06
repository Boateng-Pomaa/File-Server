import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyparser from "body-parser"

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyparser)


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