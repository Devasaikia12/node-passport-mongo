const passport = require('passport')
const { issueToken } = require('../uttils/jwtToken')
const User = require('../models/Users')

const expirationtimeInMs = process.env.JWT_EXPIRATION_TIME
const secret = process.env.JWT_SECRET

const registerUser = async(req, res) => {
    const { name, email, password } = req.body
    try {
        const userExist = User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    return res
                        .status(404)
                        .render('register', { error: 'Email is already exist' })
                }
            })
            .catch((err) => {
                return res
                    .status(404)
                    .render('register', { error: 'Something went wrong' })
            })

        const user = User.create({
            name,
            email,
            password,
        })

        if (user) {
            const jwtToken = issueToken(user)
                //console.log(jwtToken)
            req.flash(
                'success_msg',
                'You are sucessfuly registered, now you can login'
            )

            res.cookie(
                'jwt', { token: jwtToken.token }, {
                    maxAge: new Date(Date.now() + parseInt(jwtToken.expires)),
                    httpOnly: true,
                }
            )
            res.redirect('/users/login')
        }
    } catch (error) {
        res.status(404).render('register', { error: error.message })
    }
}

const loginUser = async(req, res) => {
    const { email, password } = req.body
    try {
        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.render('login', { error: 'Invalid User' })
        }
        const matchPassword = await userExist.matchPassword(password)
        if (matchPassword) {
            res.redirect('/dashboard')
        } else {
            req.flash('error_msg', 'Invalid User')
            res.render('login', { error: 'Invalid User' })
        }
    } catch (error) {
        console.log(error.message)
        res.render('login', { error: error.message })
    }
}

const passportAuthenticate = async(req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res.redirect('/user/login', {
                error_msg: 'Email and password is not valid',
            })
        }
        req.logIn(user, (err) => {
            if (err) return next(err)
            const jwtToken = issueToken(user)
            res.cookie(
                'jwt', { token: jwtToken.token }, {
                    maxAge: new Date(Date.now() + parseInt(jwtToken.expires)),
                    httpOnly: true,
                }
            )
            res.setHeader('Authorization', jwtToken.token)
            res.redirect('/dashboard')
        })
    })(req, res, next)
}

const getUserProfile = (req, res) => {
    res.send(req.user.profile)
}
module.exports = {
    registerUser,
    loginUser,
    passportAuthenticate,
    getUserProfile,
}