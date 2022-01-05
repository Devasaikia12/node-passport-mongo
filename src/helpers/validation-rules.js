const { check, body } = require('express-validator')
const User = require('../models/Users')
const registrationValidationRules = (req, res) => {
    return [
        body('name')
        .trim()
        .isLength(5)
        .withMessage('Name should minimun 5 character long'),

        body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email')
        .bail()
        .exists()
        .withMessage('Email is required')
        .custom((value) => {
            return User.find({ email: value }).then((user) => {
                if (user.length > 0) return Promise.reject('Email already taken')
            })
        })
        .normalizeEmail()
        .toLowerCase(),
        body('password').trim().isLength(5).withMessage('Minimun 5 charater long'),
        check('password2', 'Passwords do not match').custom(
            (value, { req }) => value === req.body.password
        ),
    ]
}

const loginValidationRules = (req, res) => {
    return [
        body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email')
        .bail()
        .exists()
        .withMessage('Email is required')
        .normalizeEmail()
        .toLowerCase(),
        body('password').trim().isLength(6).withMessage('Minimun 5 charater long'),
    ]
}

module.exports = { registrationValidationRules, loginValidationRules }