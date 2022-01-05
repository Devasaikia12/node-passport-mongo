const Joi = require('joi')

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    const valid = error == null

    if (valid) {
      next()
    } else {
      const { details } = error
      const message = details.map((i) => i.message).join(',')
      console.log('error', error)
      res.status(402).send({ errors: message })
    }
  }
}

module.exports = validationMiddleware
