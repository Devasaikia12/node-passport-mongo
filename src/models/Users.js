const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const validator = require('validator')
const { use } = require('passport')
const userSchema = mongoose.Schema({
    provider: {
        type: String,
        require: true,
        default: 'local',
    },
    provider_id: {
        type: String,
        default: 'local',
    },
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is not valid')
            }
        },
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 6,
        validate(val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('Password filed cant contain password')
            }
        },
    },
    image: {
        type: String,
        default: '',
    },
}, {
    timestapms: true,
})

//--user intance function/methods
userSchema.methods.matchPassword = async function(inputPassword) {
    return bcryptjs.compare(inputPassword, this.password)
}

//--- pre save hash password
userSchema.pre('save', async function(next) {
    const user = this
    if (!user.isModified('password')) {
        next()
    }
    const salt = await bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash(user.password, salt)
})

module.exports = mongoose.model('User', userSchema)