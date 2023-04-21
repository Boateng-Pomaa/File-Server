import Downloader from 'nodejs-file-downloader'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import url from "url"
import path from "path"
import fs from 'fs'
import { fileModel } from '../models/fileSchema.js'
import { adminModel } from '../models/adminSchema.js'
const __dirname = dirname(fileURLToPath(import.meta.url))




//uploading the files
export async function uploadFile(req, res) {
    try {
        // const { id } = req.params
        // const check = await adminModel.findById({ _id:id})
        // if (check) {
        const { title, description } = req.body
        const { path, mimetype } = req.file
        const file = await fileModel.create({
            title,
            description,
            file_path: path,
            file_mimetype: mimetype
        })
        if (file) {
            res.send('file uploaded successfully.')
            console.log('file uploaded successfully')
        } else {
            res.send('file uploaded failed')
            console.log('file uploaded failed')
        }
        // }
        // console.log("not an admin")
        // return res.send("not an admin")

    }
    catch (error) {
        res.status(400).send('Error while uploading file.')
        console.log(error)
    }
}




///downloading files
export async function downloadFile(req, res) {
    try {
        const { filename } = req.params
        const filePath = __dirname + 'public/files/' + filename

        res.download(
            filePath,
            `downloaded-${filename}`,
            (err) => {
                if (err) {
                    res.send({
                        error: err,
                        msg: "Problem downloading the file"
                    })
                }
            })


    } catch (error) {
        console.error(error)
    }
}



//searching for a file
export async function searchFile(req, res) {
    try {
        const { title } = req.params
        console.log(title)
        const file = await fileModel.findOne({ title: title })
        if (!file) {
            res.send('no such file')
            console.log('no such file', file)
        } else {
            return res.send(file)
        }

    } catch (error) {
        console.log(error)
    }
}



//a feed to show list of files available for download
export async function filesFeed(req, res) {
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

    const parsedUrl = url.parse(req.url)

    if (parsedUrl.pathname === "/public/files") {
        var filesLink = "<ul>"
        res.setHeader('Content-type', 'text/html')
        var filesList = fs.readdirSync("./public/files")
        filesList.forEach(element => {
            if (fs.statSync("public/files/" + element).isFile()) {
                const path = `public/files/${element}`
                filesLink += `<br/><li><a href='./public/files/${element}'>
                ${element}
            </a></li>` + `<p><pre><a href = '/download/${element}' download = ${element}><strong>Click here to download</strong></a>    <strong>Click to preview</strong>    <a href = '/sendfile'><strong>Click to send to an email</strong></a>></pre></p>`
            }
        })
        filesLink += "</ul>"
        res.end("<h1>List of files Available</h1> " + filesLink)
    }
}


////previewing files
export async function filePreview(req, res) {

}