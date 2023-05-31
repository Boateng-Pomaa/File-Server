import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import { protect } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import { registerUser, loginUser ,adminView} from '../controller/adminController.js'
import { uploadFile } from '../controller/filesController.js'





router.post('/register/admin', registerUser)
  .post('/login/admin', [
    check("A valid password is required").isLength({ min: 4 })
  ], loginUser)
  .post('/admin/upload', protect, upload.single('file'), uploadFile)
  .get('/admin/downloads', adminView)



  
export default router