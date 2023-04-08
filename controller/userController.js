import {userModel} from '../models/userSchema.js'
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

//   // Hash Password
//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(password, salt)

  // CREATING USER
    const user = await userModel.create({
        email,
        password,
        userRole: "user"
    })

    /// function to generate accesstoken
  const token = jwt.sign({user_id:user._id,email:user.email},process.env.JWT_SECRET, {
      expiresIn: "1d"
     });

     user.token = token

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


