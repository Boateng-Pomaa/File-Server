import jwt from "jsonwebtoken"
import { userModel } from "../models/userSchema.js"

export const userProtect = async (req, res, next) => {

        try {
            const token = req.headers.authorization.split(' ')[1]
    
            const user = jwt.verify(token, process.env.JWT_SECRET)
            console.log(`VERIFIED:`,user)
            const currentTime = Math.floor(Date.now() / 1000)
            if (user.exp && user.exp < currentTime) {
                return res.status(401).json({
                    mes:"Token has Expired"
                })
            }
            req.user = await userModel.findById(user._id).select('-password')
            next()
        } catch (error) {
            res.status(401).json({
                message: "No token"
            })
        }
}