import passport from 'passport'
import { Strategy as JwtStrategy } from "passport-jwt"
import { ExtractJwt } from "passport-jwt"
import {userModel}  from '../models/userSchema.js'
const opts = {}




opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET


  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      userModel.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => console.log(err))
    })
  )



  export default passport