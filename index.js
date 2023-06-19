import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyparser from "body-parser"
import route from './routes/userRoute.js'
import admins from './routes/adminRoute.js'
import files from './routes/fileRoute.js'
import exphbs from 'express-handlebars'


dotenv.config()

const app = express()
const hbs = exphbs.create({defaultLayout: false})

app.use(cors())
app.use(express.json())
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: false }))
app.engine('handlebars',hbs.engine)
app.set('view engine','.handlebars')
app.set('views', './templates')
app.use(admins)
app.use(files)
app.use(route)
app.use(express.static('public'))
app.use(express.static('files'))





const port = process.env.PORT ||3000
const db = process.env.DB_URL.toString()


mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to MongoDB')
})



app.listen(port,()=>{
    console.log(`server listening on ${process.env.NODE_ENV} port ${port}`)
})