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


app.listen(port,()=>{
    console.log(`server listening on ${port}`)
})