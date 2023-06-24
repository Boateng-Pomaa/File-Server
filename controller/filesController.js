import fs from 'fs'
import mime from 'mime'
import path from 'path'
import {fileURLToPath} from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { fileModel } from '../models/fileSchema.js'
import { fileCount } from '../models/countSchema.js'





//uploading the files
export async function uploadFile(req, res) {
    try {
        const { title, description } = req.body
        const { path, mimetype } = req.file
        const file = await fileModel.create({
            title,
            description,
            file_path: path,
            file_mimetype: mimetype
        })
        if (file) {
            res.json('file uploaded successfully.')

        } else {
            return res.json('file uploaded failed')

        }
    }
    catch (error) {
        res.status(500).send('Internal Server Error')
    }
}


function isValidToken(token) {
    try {
        const userToken = jwt.verify(token, process.env.JWT_SECRET)
        if (userToken.exp < Date.now() / 1000) {
            return false
        }
        else {
            return true
        }
    } catch (error) {
        return false
    }
}

///downloading files
export async function downloadFile(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token || !isValidToken(token)) {
            return res.status(401).json({ message: "Please login to continue" })
        }
        const { filename } = req.params
        res.download(
            filename,
            `downloaded-${filename}`,
            async (err) => {
                if (err) {
                    return res.send({
                        error: err,
                        msg: "Problem downloading the file"
                    })
                } else {
                    await fileCount.updateOne({ filename: filename }, { $inc: { download_count: 1 } }, { upsert: true })

                }
            })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

}

function searchFiles(directory, search) {
    const files = fs.readdirSync(directory)
    const searchPattern = new RegExp(search, 'i')
    const matchFiles = files.filter(files => searchPattern.test(files))
    return matchFiles
}

//searching for a file
export async function searchFile(req, res) {
    try {
        const { title } = req.params
        const directory = './public/files'
        const matchingFiles = searchFiles(directory, title)
        res.json({ files: matchingFiles })

    } catch (error) {
        res.status(500).send("Internal Server Error" + error)
    }
}


//a feed to show list of files available for download
export async function filesFeed(req, res) {
    try {
        const Path = "public/files"
        fs.readdir(Path, (err, files) => {
            if (err) {
                return res.status(400).send("Error Loading Files")
            } else {
                res.render('home',{ files })
            }
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Error"
        })
    }


}


////previewing files
export async function filePreview(req, res) {
    try {
        const { filename } = req.params
        const filePath = `./public/files/${filename}`
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(404).send('File Not Found')
            } else {
                const contentType = mime.getType(filename)
                if (contentType) {
                    return res.setHeader('Content-Type', contentType)
                }
                res.send(data)

            }
        })
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

}




