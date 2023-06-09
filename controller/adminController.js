import {adminModel} from '../models/adminSchema.js'
import { fileCount } from '../models/countSchema.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'



export async function registerUser(req,res){

    try{
        const {email, password, userRole} = req.body

    // Validation
  if (!email || !password ) {
    return res.status(400).json({
        message:'Please include all fields'})
  }
  const userExists = await adminModel.findOne({ email })

  if (userExists) {
   return res.status(400).send({
        message:'User already exists'})
  }

  // CREATING USER
    const admin = await adminModel.create({
        email,
        password,
        userRole: "admin"
    })

    /// function to generate accesstoken
  const token = jwt.sign({user_id:admin._id,email:admin.email},process.env.JWT_SECRET, {
      expiresIn: "1d"
     })

     admin.token = token

    if (admin){
        res.status(200).json({
            message:'Registration Successful',
            admin
        })
    }else{
       return res.status(400).json({
            message:"Registration unsuccessful"
        })
    }
    }catch(err){
        res.status(500).send("Internal Server Error")
    }
    
}



///LOGGING IN A USER

export async function loginUser(req,res){
    
    try {
        const {email, password} = req.body
        const admin = await adminModel.findOne({email})
        if(admin && (await bcrypt.compare(password, admin.password)))
           {

            const token = jwt.sign({admin_id:admin._id,email:admin.email},process.env.JWT_SECRET, {
                expiresIn: "1d"
               });
          
               admin.token = token

                res.status(200).json({
                    message:"Logged in successful",
                    admin
                    
                })
            }else{
               return res.status(400).json({
                    message:'Invalid Credentials'
                })
                   }
        }
     catch (err) {
        res.status(500).json({
            message:'server error'
        })
    }
}


export async function adminView(req, res) {
   try {
    const files = await fileCount.find().lean()
    if (!files) {
        return res.status(400).send({message:"Error loading files"})
    }
    res.render('downloads',{files})
    

   } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error")
   }
   

}


export function adView(req,res){
    res.render('index')
}
