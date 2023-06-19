import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import {userProtect} from '../middlewares/usersAuth.js'
import { registerUser, verifyUser, loginUser, requestPasswordReset, resetPassword, fileEmail } from '../controller/userController.js'




router.post('/signup', registerUser)
  .post('/login', [
    check("A valid password is required").isLength({ min: 4 })
  ], loginUser)
  .get('/user/verify/:id/:token', verifyUser)
  .post('/user/passwordresetrequest', requestPasswordReset)
  .get('/user/passwordreset/:id/:resetToken', resetPassword)
  .post('/sendfile',userProtect, fileEmail)


  
export default router