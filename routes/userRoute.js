import express from 'express'
const router = express.Router()
import { check } from 'express-validator'
import passport from '../middlewares/passport.js'
import { registerUser, verifyUser, loginUser, requestPasswordReset, resetPassword, fileEmail,renderForgot, renderLogins ,renderRegister} from '../controller/userController.js'




router.post('/signup', registerUser)
  .post('/login', [
    check("A valid password is required").isLength({ min: 4 })
  ], loginUser)
  .get('/user/verify/:id/:token', verifyUser)
  .post('/user/passwordresetrequest', requestPasswordReset)
  .get('/user/passwordreset/:id/:resetToken', resetPassword)
  .post('/sendfile', fileEmail)
  .get('/logins',renderLogins)
  .get('/register',renderRegister)
  .get('/forgotpassword',renderForgot)
  
  // passport.authenticate('jwt', { session: true }),

  
export default router