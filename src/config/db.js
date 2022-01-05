const mongoose = require('mongoose')
const connectDB = async() => {
    let URI = process.env.MONGO_URI
    try {
        const connection = await mongoose.connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log('Database is connected')
    } catch (error) {
        console.log(`Connection error ${error}`)
        process.exit(1)
    }
}

const disconnectDB = async() => {
    await mongoose.connection.close()
}

module.exports = { connectDB, disconnectDB }