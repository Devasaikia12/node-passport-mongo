const Joi = require('joi')

const authSchema = {
    register: Joi.object().keys({
        name: Joi.string().required().label('Name'),
        email: Joi.string().lowercase().email().required().label('Email'),
        password: Joi.string().min(9).required().label('Password'),
        password2: Joi.any()
            .valid(Joi.ref('password'))
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
    }),
}

module.exports = { authSchema }