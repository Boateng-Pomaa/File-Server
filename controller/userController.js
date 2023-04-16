import {userModel} from '../models/userSchema.js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import {sendEmail} from '../utils/sendMail.js'
import nodemailer from "nodemailer"
import hbs from "nodemailer-express-handlebars"
import path from "path"

dotenv.config()

const transporter = nodemailer.createTransport({
    host:'smpt.gmail.com',
    service:'gmail',
    port: 465,
    secure: true,
    logger:true,
    debugger:true,
    secureConnection:false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, 
    },
  })

  const handlebarsOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve( "utils/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve( "utils/templates"),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarsOptions))







export async function registerUser(req,res){
    try{
        const {email, password, userRole} = req.body;

    // Validation
  if (!email || !password ) {
    res.status(400).json({
        message:'Please include all fields'})
  }
  // Find if user already exists
  const userExists = await userModel.findOne({ email })

  if (userExists){
    res.status(400).send({
        message:'User already exists'})
  }
  // CREATING USER

    /// function to generate accesstoken
    const tokens = jwt.sign({email},process.env.JWT_SECRET, {
        expiresIn: "1d"
       })

    const user = await userModel.create({
        email,
        password,
        userRole: "user",
        token:tokens
    })
    
    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        template: 'accountVerification',
        subject: 'Account Verification',
        context:{link:`${process.env.BASE_URL}/user/verify/${user._id}/${tokens}`,
        email: user.email}
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.send({
            status: "success",
            data: "Verification Link sent successfully",
          });
          console.log("Email sent: " + info.response);
        }
      })

    if (user){
        res.status(200).json({
            message:'Registration Successful',
            user
        })

        
    }else{
        res.status(400).json({
            message:"Registration unsuccessful"
        })
    }
    }catch(err){
        console.log(err)
    }
    
}


//verifying account
export async function verifyUser(req,res){
    try{
        var {id,token} = req.params
        var user = await userModel.findById({_id:id},{token})
        if(user){
            //todo : fix database update
            console.log(id)
           user = await userModel.findByIdAndUpdate({_id:id},{verified:true})
            res.send("Welcome")
        }
        else{
            res.status(400).json({
                message:"Invalid link"
            })
        }
    }catch(error){
        console.log(error)
    }
}



///LOGGING IN A USER

export async function loginUser(req,res){
    
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(user && (await bcrypt.compare(password, user.password)))
           {

            const token = jwt.sign({user_id:user._id,email:user.email},process.env.JWT_SECRET, {
                expiresIn: "5d"
               });
          
               user.token = token

                res.status(401).json({
                    message:"Logged in successful",
                    user
                    
                })
               
            }else{
                res.status(400).json({
                    message:'Invalid Credentials'
                })
                   }
        }
     catch (err) {
        console.error(err.message)
        res.status(500).json({
            message:'server error'
        })
    }
}

//requesting for password reset

export async function requestPasswordReset(req,res){
    try{
        const {email} = req.body
    var user = await userModel.findOne({email})

    if (!user){
        res.status(400).json({
            message:"User does not exist"
        })
    }
    
    const resetToken = jwt.sign({email},process.env.JWT_SECRET, {
        expiresIn: "1hr"
       })

    const hashedToken = await bcrypt.hash(resetToken,10) 
    user = await userModel.findByIdAndUpdate({_id:user._id},{token:hashedToken})  

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        template: 'passwordResetRequest',
        subject: 'Password Reset Request',
        context:{link:`${process.env.BASE_URL}/user/passwordreset/${user._id}/${resetToken}`,
        email: user.email}
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          res.send({
            status: "success",
            data: "Reset Link sent successfully",
          });
          console.log("Email sent: " + info.response)
        }})
}catch(error){
    console.error(error.message)
    res.status(500).json({
        message:'server error'
})
}
}

//setting a new password
export async function resetPassword(req, res){
  try {
    const {id,resetToken} = req.params
    var user = await userModel.findOne({_id:id})
    if(!user){
      res.send("Invalid or expired Link")
      console.log("Invalid or expired Link")
    }else{
      console.log(resetToken)
      const isValid = bcrypt.compare(resetToken, user.token)
      if(!isValid){
        res.send("Invalid or expired Link")
      }
      user.password = req.body.password
      console.log(user.password)
      const hash = await bcrypt.hash(user.password,10)
      user = await userModel.findByIdAndUpdate({_id:user._id}, {password:hash})
      if(user){
        res.send("password updated")
      }

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        template: 'passwordReset',
        subject: 'Password Reset Successfully',
        context:{email: user.email}
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          res.send({
            status: "success",
            data: "Password Reset successfully",
          });
          console.log("Email sent: " + info.response)
        }})
    }

  } catch (error) {
    console.log(error.message)
  }
}