import { userModel } from '../models/userSchema.js'
import { fileCount } from '../models/countSchema.js'
import { transporter } from '../middlewares/handlebarConfig.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'


dotenv.config()






export async function registerUser(req, res) {
  try {
    const { email, password, userRole } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please include all fields'
      })
    }
    // Find if user already exists
    const userExists = await userModel.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }
    // CREATING USER

    /// function to generate accesstoken
    const tokens = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    const user = await userModel.create({
      email,
      password,
      userRole: "user",
      token: tokens
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      template: 'accountVerification',
      subject: 'Account Verification',
      context: {
        link: `${process.env.BASE_URL}/user/verify/${user._id}/${tokens}`,
        email: user.email
      }
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ message: "Failed to send email " + error })

      } else {
        console.log("Email sent: " + info.response)
        return res.json({
          status: "success",
          data: "Verification Link sent successfully",
        })

      }
    })

    if (user) {
     return res.status(200).send(
        'Registration Successful  Please Check Your Email to Verify Your Account'
      
      )


    } else {
      return res.status(400).json({
        message: "Registration unsuccessful"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal server error')
  }

}


//verifying account
export async function verifyUser(req, res) {
  try {
    var { id, token } = req.params
    var user = await userModel.findById({ _id: id }, { token })
    if (user) {
      user = await userModel.findByIdAndUpdate({ _id: id }, { verified: true })
      res.redirect('/logins')
    }
    else {
      return res.status(400).json({
        message: "Invalid link"
      })
    }
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
}



///LOGGING IN A USER

export async function loginUser(req, res) {

  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {

      const token = jwt.sign({id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      })
      user.token = token
      res.redirect('/home')
      // return res.status(200).json({
      //   message: "Logged in successful",
      //   user

      // })

    } else {
      return res.status(400).json({
        message: 'Invalid Credentials'
      })
    }
  }
  catch (err) {
    return res.status(500).json({
      message: 'server error'
    })
  }
}

//requesting for password reset

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body
    var user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      })
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30mins"
    })

    const hashedToken = await bcrypt.hash(resetToken, 10)
    user = await userModel.findByIdAndUpdate({ _id: user._id }, { token: hashedToken })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      template: 'passwordResetRequest',
      subject: 'Password Reset Request',
      context: {
        link: `${process.env.BASE_URL}/user/passwordreset/${user._id}/${resetToken}`,
        email: user.email
      }
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json(error)
      } else {
        res.json({
          status: "success",
          data: "Reset Link sent successfully",
        })
        console.log("Email sent: " + info.response)
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error'
    })
  }
}

//setting a new password
export async function resetPassword(req, res) {
  try {
    const { id, resetToken } = req.params
    var user = await userModel.findOne({ _id: id })
    if (!user) {
      return res.send("Invalid or expired Link")
    } else {
      const isValid = bcrypt.compare(resetToken, user.token)
      if (!isValid) {
        return res.send("Invalid or expired Link")
      }
      user.password = req.body.password
      const hash = await bcrypt.hash(user.password, 10)
      user = await userModel.findByIdAndUpdate({ _id: user._id }, { password: hash })
      if (user) {
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        template: 'passwordReset',
        subject: 'Password Reset Successfully',
        context: { email: user.email }
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(400).json({ error })
        } else {
          res.send({
            status: "success",
            data: "Password Reset successfully",
          })
          console.log("Email sent: " + info.response)
        }
      })
    }
  }

  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
}


function isValidToken(token) {
  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET)
   const expired =userToken.exp
    if (expired < Date.now()/1000) {
      return false
    }
    else {
      return true
    }
  } catch (error) {
    return false
  }


}
///sending file to an email
export async function fileEmail(req, res) {
  try {
    // const token = req.headers.authorization.split(' ')[1]
    // if (!token || !isValidToken(token)) {
    //   return res.status(401).json({ message: "Please login to continue" })
    // }
    const { email, filename } = req.body
    const path = `./public/files/${filename}`
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USERNAME,
      template: 'sendFile',
      subject: 'File From Lizzy Business Center',
      context: { email: email },
      attachments: [
        {
          filename: filename,
          path: path
        }
      ]
    }
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(400).json({ error })
      } else {
        const sent = await fileCount.updateOne({ filename: filename },
          { $inc: { email_count: 1 } }, { upsert: true })
        if (sent) {
          console.log("Email sent: " + info.response)
        }
        res.json({
          status: "success",
          data: "File sent successfully",

        })

      }
    })
  }
  catch (error) {
    res.status(500).send("Internal Server Error")
    console.log(error)
  }
}


export function renderLogins(req, res){
  res.render('login')
}

export function renderRegister(req, res){
  res.render('signup')
}

export function renderForgot(req,res){
  res.render('password')
}