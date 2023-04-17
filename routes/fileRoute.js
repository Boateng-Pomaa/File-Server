import express from 'express'
const router = express.Router()
import upload from '../middlewares/upload.js'
import {downloadFile,uploadFile, searchFile} from '../controller/filesController.js'
import { protect } from '../middlewares/auth.js'


router.get('/download/:filename', downloadFile)
router.post('/admin/upload',upload.single('file'), uploadFile)
router.get('/search/:title', searchFile)







export default router