var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt

const secret = process.env.JWT_SECRET

const User = require('../models/Users')

var cookieExtractor = function (req) {
  var token = null
  if (req && req.cookies) token = req.cookies['jwt'].token
  //console.log(token)
  return token
}

var opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
}

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //console.log(jwt_payload)
      User.findOne({ id: jwt_payload.sub })
        .select({ email: 1, name: 1, _id: 1 })
        .then((user) => {
          if (user) {
            return done(null, user)
          } else {
            return done(null, false)
            // or you could create a new account
          }
        })
        .catch((err) => {
          return done(err, false)
        })
    })
  )
}
