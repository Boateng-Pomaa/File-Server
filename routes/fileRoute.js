import express from 'express'
const router = express.Router()

import {userProtect} from '../middlewares/usersAuth.js'
import { downloadFile, searchFile, filesFeed, filePreview } from '../controller/filesController.js'



router.get('/download/:filename',userProtect, downloadFile)
    .get('/search/:title', searchFile)
    .get('/preview/:filename', filePreview)
    .get('/home', filesFeed)
    








export default router