import Downloader from 'nodejs-file-downloader'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { fileModel } from '../models/fileSchema.js'
const __dirname = dirname(fileURLToPath(import.meta.url))




//uploading the files
export async function uploadFile(req, res) {
    try {

        const { title, description } = req.body
        const { path, mimetype } = req.file
        const file = await fileModel.create({
            title,
            description,
            file_path:path,
            file_mimetype:mimetype
        })
        if (file) {
            res.send('file uploaded successfully.')
            console.log('file uploaded successfully')
        } else {
            res.send('file uploaded failed')
            console.log('file uploaded failed')
        }

    } catch (error) {
        res.status(400).send('Error while uploading file.')
        console.log(error)
    }
}




///downloading files
export async function downloadFile(req, res) {
    try {
        const { filename } = req.params
        const filePath = __dirname + 'public' + filename
        await Downloader(filePath, filename, (err) => {
            if (err) {
                res.send({
                    error: err,
                    message: "Problem downloading the file"
                })
            }
        })


        // const downloader = new Downloader({
        //     url: "/download/:filename", //If the file name already exists, a new file with the name 200MB1.zip is created.
        //     directory: "./downloads", //This folder will be created, if it doesn't exist.
        //   });
        //   try {
        //      {filePath,downloadStatus} = await downloader.download(); //Downloader.download() resolves with some useful properties.

        //     console.log("All done");
        //   } catch (error) {
        //     //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        //     console.log("Download failed", error);




    } catch (error) {
        console.error(error)
    }
}



//searching for a file
export async function searchFile(req, res) {
    try {
        const { title} = req.params
        console.log(title)
        const file = await fileModel.findOne({title: title})
        if (!file){
            res.send('no such file')
            console.log('no such file', file)
        }else{
           return res.send(file)
            // res.json({
            //     message: 'file found',
            //     file
            // })
        }

    } catch (error) {
        console.log(error)
    }
}