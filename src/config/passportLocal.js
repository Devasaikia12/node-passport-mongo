const LocalStrategy = require('passport-local').Strategy
const bcryptjs = require('bcryptjs')
const User = require('../models/Users')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: 'That email is not registered',
                        })
                    }
                    if (!user.matchPassword(password)) {
                        return done(null, false, { message: 'Incorrect password.' })
                    }
                    return done(null, user)
                })
                .catch((err) => console.log(err))
        })
    )

    //serialize and deserialize user

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })
}