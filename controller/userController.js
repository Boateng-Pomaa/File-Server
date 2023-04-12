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








// // send user password reset email
// const data = {
//     to: user.email,
//     from: process.env.EMAIL_USERNAME,
//     template: 'passwordResetRequest',
//     subject: 'Request to Reset Password',
//     context: {
//       link: `http://localhost:${process.env.PORT || 3000}/resetpassword/token=${token}`,
//       name: user.email
//     }
//   }
//   await transporter.sendMail(data)














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
    // const link = `${process.env.BASE_URL}/user/verify/${user._id}/${user.token}`
    // await sendEmail(user.email,"Account Verification",{email:user.email,link:link},'/templates')
    
    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        template: 'accountVerification',
        subject: 'Account Verification',
        context:{link:`${process.env.BASE_URL}/user/verify/${tokens}`,
        email: user.email}
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.send({
            status: "success",
            data: "Reset Link sent successfully",
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
    try{const {email} = req.body
    const user = await userModel.findOne({email})

    if (!user){
        res.status(400).json({
            message:"User does not exist"
        })
    }

    user = await userModel.findOneAndDelete({token})
    const resetToken = jwt.sign({email},process.env.JWT_SECRET, {
        expiresIn: "2hr"
       })

    const hashedToken = bcrypt.hash(resetToken,10) 
    user = await userModel.updateOne({
        token:hashedToken
    })  

    // const data = {
    //     to: user.email,
    //     from: process.env.EMAIL_USERNAME,
    //     template: 'passwordResetRequest',
    //     subject: 'Request to Reset Password',
    //     context: {
    //       link: `http://localhost:${process.env.PORT || 3000}/resetpassword/token=${resetToken}`,
    //       name: user.email
    //     }
    //   }
    //   await transporter.sendMail(data)
    

    res.send("Email sent successfully")
}catch(error){
    console.error(err.message)
    res.status(500).json({
        message:'server error'
})
}
}

//setting a new password
