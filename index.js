import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyparser from "body-parser"
import route from './routes/userRoute.js'
import admins from './routes/adminRoute.js'
import files from './routes/fileRoute.js'
import exphbs from 'express-handlebars'
import passport from "./middlewares/passport.js"
import session from "express-session"

dotenv.config()

const app = express()
const hbs = exphbs.create({   helpers: {
    isImage: function(fileType) {
      return fileType === 'image'
    },
    isAudio: function(fileType) {
      return fileType === 'audio'
    },
    isVideo: function(fileType) {
      return fileType === 'video'
    },
    isPDF: function(fileType) {
      return fileType === 'pdf'
    }
  },defaultLayout: false})

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
app.use(session({
    secret: process.env.JWT_SECRET,
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())



const port = process.env.PORT ||5000
const db = process.env.DB_URL



mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to MongoDB')
})



app.listen(port,()=>{
    console.log(`server listening on ${process.env.NODE_ENV} port ${port}`)
})