import {userModel} from '../models/userSchema.js'
import {Token} from '../models/token.js'
import sendMail from '../utils/sendMail.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'



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

  if (userExists) {
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

  
    if (user){
        
        const link = `${process.env.BASE_URL}/user/verify/${user._id}/${user.token}`
        sendMail(user.email,"Password Reset Request",{name: user.email,link: link,},"./template/accountVerification.handlebars");
        
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


