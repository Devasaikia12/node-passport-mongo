const router = require('express').Router()
const passport = require('passport')
const { validationResult } = require('express-validator')
const {
    registrationValidationRules,
    loginValidationRules,
} = require('../helpers/validation-rules')
const {
    registerUser,
    passportAuthenticate,
    getUserProfile,
} = require('../controllers/users.controllers')

//login routes
router.get('/login', (req, res) => {
    res.render('login')
})

router.post(
    '/login',
    loginValidationRules(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map((err) => extractedErrors.push(err.msg))
        return res.render('login', { errors: extractedErrors })
    },
    passportAuthenticate
)

router.get('/register', (req, res) => {
    //console.log(req.body)
    res.render('register')
})
router.post(
    '/register',
    registrationValidationRules(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map((err) => extractedErrors.push(err.msg))

        return res.render('register', { errors: extractedErrors })
    },
    registerUser
)

router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    getUserProfile
)
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are successfuly logout')
    res.redirect('/users/login')
})

module.exports = router