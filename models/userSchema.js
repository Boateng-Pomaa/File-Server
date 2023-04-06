import mongoose from "mongoose"
import bcrypt from "bcrypt"


const {Schema,model} = mongoose

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select:true
    },
    userRole:{
        type: String,
        enum:["admin","user"],
        default:"user"
    },
    accessToken:{
        type:String
    }
    
},
{
  timestamps:true
}
)

userSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })


export const userModel = model("users",userSchema)
