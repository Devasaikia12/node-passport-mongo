const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
})

//--- get database connection
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const db = require('./config/db')
const flash = require('connect-flash')
const app = express()

//--set layouts view engin
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', [
    path.join(__dirname, '../views/'),
    path.join(__dirname, '../views/auth/'),
])
//-- express static middleware
app.use(express.static('public'));

//--app setup body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//app set session & cookie
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            autoRemove: 'interval',
            autoRemoveInterval: 10,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)

// passport initialization
app.use(passport.initialize())
app.use(passport.session())
require('./config/passportLocal')(passport)
require('./config/passport-google-oauth2')(passport)
require('./config/passportJWT')(passport)

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//-- routes start here
app.use('/', require('./routes/index.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/users', require('./routes/users.route'))
app.use('/dashboard', require('./routes/dashboard.route'))

db.connectDB()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('App is connected to port', PORT)
})