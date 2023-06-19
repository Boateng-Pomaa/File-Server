import jwt from "jsonwebtoken"
import { userModel } from "../models/userSchema.js"

export const userProtect = async (req, res, next) => {

        try {
            const token = req.headers.authorization.split(' ')[1]
    
            const user = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await userModel.findById(user._id).select('-password')
            next()
        } catch (error) {
            res.status(401).json({
                message: "No token"
            })
        }
}