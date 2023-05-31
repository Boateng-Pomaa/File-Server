import express from 'express'
const router = express.Router()

import { downloadFile, searchFile, filesFeed, filePreview } from '../controller/filesController.js'



router.get('/download/:filename', downloadFile)
    .get('/search/:title', searchFile)
    .get('/preview/:title', filePreview)
    .get('/public/files', filesFeed)








export default router