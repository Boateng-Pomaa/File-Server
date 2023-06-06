import fs from 'fs'
import mime from 'mime'
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
            res.send('file uploaded successfully.')

        } else {
            return res.send('file uploaded failed')

        }
    }
    catch (error) {
        res.status(500).send('Internal Server Error')
    }
}




///downloading files
export async function downloadFile(req, res) {
    try {
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
                return res.status().send("Error Loading Files")
            } else {
                res.json({ files: files })
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
        const filePath = `/public/files/${filename}`
        fs.readFile(filePath, (err, data) => {
            if (err) {
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
        res.status(500).send("Internal Server Error: " + error)
    }

}




