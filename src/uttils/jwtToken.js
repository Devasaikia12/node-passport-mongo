const jwt = require('jsonwebtoken')

const expirationtimeInMs = process.env.JWT_EXPIRATION_TIME
const secret = process.env.JWT_SECRET

const issueToken = (user) => {
    const payload = {
        email: user.email,
        name: user.name,
        sub: user.id,
        expiration: Date.now() + parseInt(expirationtimeInMs),
    }

    const options = {
        expiresIn: expirationtimeInMs,
        //algorithm: 'HS256',
    }
    const token = jwt.sign(payload, secret, options)

    return {
        token: token,
        expires: expirationtimeInMs,
    }
}

module.exports = { issueToken }