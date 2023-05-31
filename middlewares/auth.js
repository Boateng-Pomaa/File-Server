import jwt from "jsonwebtoken"
import { adminModel } from "../models/adminSchema.js"

export const protect = async (req, res, next) => {

        try {
            const token = req.headers.authorization.split(' ')[1]
    
            const admin = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await adminModel.findById(admin._id).select('-password')
            next()
        } catch (error) {
            res.status(401).json({
                message: "Not an admin"
            })
        }
}