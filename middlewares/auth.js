import jwt from "jsonwebtoken"
import userModel from "../models/userSchema"

export const protect = async(req,res,next) =>{

    let token
    //get token from header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        try {
            //getting token from header
            token = req.headers.authorization.split(' ')[1]

            //verifying the token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            //assigning user to request object
            req.user = await userModel.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            res.status(401).json({
                message:"Token is not valid"
            })
        }
        if(!token){
            res.status(401).json({
                message:"Authorization Denied, No token"
            })
        }
    }