import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyparser from "body-parser"
import url from "url"
import fs from "fs"
import path from "path"
import route from './routes/userRoute.js'
import admins from './routes/adminRoute.js'
import files from './routes/fileRoute.js'

dotenv.config()

const app = express()


app.use(cors())
app.use(express.json())
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: false }))
app.use(admins)
app.use(files)
app.use(route)
// app.use(express.static('public'))
// app.use(express.static('files'))
const port = process.env.PORT ||3000
const db = process.env.DB_URL

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to MongoDB')
})

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
}

app.post('/public/files', (req, res)=>{
    const parsedUrl = url.parse(req.url)
   
if(parsedUrl.pathname==="/public/files"){
    var filesLink="<ul>";
    res.setHeader('Content-type', 'text/html');
    var filesList=fs.readdirSync("./public/files");
    filesList.forEach(element => {
        if(fs.statSync("public/files/"+element).isFile()){
            filesLink+=`<br/><li><a href='public/files/${element}'>
                ${element}
            </a></li>`       
        }
    })
    filesLink+="</ul>"
    res.end("<h1>List of files Available:</h1> " + filesLink)
}
})



app.listen(port,()=>{
    console.log(`server listening on ${port}`)
})