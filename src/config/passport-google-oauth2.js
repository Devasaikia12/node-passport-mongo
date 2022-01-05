const google = require('./googleOAUTH2.json')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const User = require('../models/Users')
const config = {
    clientID: google.web.client_id,
    clientSecret: google.web.client_secret,
    callbackURL: '/auth/google/callback',
}

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            config,
            async(accessToken, refreshToken, profile, done) => {
                try {
                    const userdata = {
                        provider: profile.provider,
                        provider_id: profile.id,
                        name: profile.displayName,
                        image: profile.photos[0].value,
                    }

                    let user = await User.findOne({ provider_id: profile.id })
                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(userdata)
                        done(null, user)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.googleId || user.id)
    })

    passport.deserializeUser((googleId, done) => {
        database.findOne({ googleId: googleId }, function(err, user) {
            done(null, user)
        })
    })
}