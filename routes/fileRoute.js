import express from 'express'
const router = express.Router()
import passport from '../middlewares/passport.js'
import { downloadFile, searchFile, filesFeed, filePreview } from '../controller/filesController.js'
import { userProtect } from '../middlewares/usersAuth.js'



router.get('/download/:filename',userProtect, downloadFile)
    .get('/search/:title', searchFile)
    .get('/preview/:filename', filePreview)
    .get('/home', filesFeed)
    








export default router