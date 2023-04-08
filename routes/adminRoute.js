import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import {registerUser, loginUser} from '../controller/adminController.js'




router.post('/register/admin', registerUser)
router.post('/login/admin', [
    check("A valid password is required").isLength({min:4})
      ],loginUser)


export default router