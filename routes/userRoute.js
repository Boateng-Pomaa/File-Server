import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import {registerUser, verifyUser, loginUser, requestPasswordReset} from '../controller/userController.js'




router.post('/signup', registerUser)
router.post('/login', [
    check("A valid password is required").isLength({min:4})
      ],loginUser)
router.get('/user/verify/:token',verifyUser)
router.post('/user/passwordresetrequest',requestPasswordReset)

export default router