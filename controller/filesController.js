import Downloader from 'nodejs-file-downloader'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { fileModel } from '../models/fileSchema.js'
const __dirname = dirname(fileURLToPath(import.meta.url))




  //uploading the files
  export async function uploadFile(req,res){
    try {
        var img = req.file.originalName
    var encode_img = img.toString()
    var final_image = {
        contentType:req.file.mimetype,
        image:new Buffer.from(encode_img,'base64')
    }
        const file = await fileModel.create(final_image)
        if(file){
        res.send('file uploaded successfully.')
        res.send(final_image.image)
        console.log('file uploaded successfully')
    }
      } catch (error) {
        res.status(400).send('Error while uploading file. Try again later.')
        console.log(error)
      }
    }
    
  



export async function downloadFile(req,res){
    try {
       const {filename} = req.params
       const filePath = __dirname + 'public' + filename
       await Downloader(filePath,filename,(err) => {
                if (err) {
                    res.send({
                        error : err,
                        message   : "Problem downloading the file"
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
export async function searchFile(req,res){
    try {
        const {filename} = req.params

    } catch (error) {
        
    }
}