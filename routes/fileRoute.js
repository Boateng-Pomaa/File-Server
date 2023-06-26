import express from 'express'
const router = express.Router()
import passport from '../middlewares/passport.js'
import { downloadFile, searchFile, filesFeed, filePreview } from '../controller/filesController.js'



router.get('/download/:filename', downloadFile)
    .get('/search/:title', searchFile)
    .get('/preview/:filename', filePreview)
    .get('/home', filesFeed)
    








export default router