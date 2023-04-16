import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import {registerUser, verifyUser, loginUser, requestPasswordReset, resetPassword} from '../controller/userController.js'




router.post('/signup', registerUser)
router.post('/login', [
    check("A valid password is required").isLength({min:4})
      ],loginUser)
router.get('/user/verify/:id/:token',verifyUser)
router.post('/user/passwordresetrequest',requestPasswordReset)
router.get('/user/passwordreset/:id/:resetToken',resetPassword)

export default router