const express = require('express')
const app = express()
const passport = require('passport')
const cors = require('cors')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;
require('custom-env').env()

// importing middlerwares
const isAuthenticated = require('./middlewares/isAuthenticated')
const isAdmin = require('./middlewares/isAdmin')
const logErrors = require('./middlewares/logErrors')
const clientErrorHandler = require('./middlewares/clientErrorHandler')
const errorHandler = require('./middlewares/errorHandler')

// importing routes
const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/user-routes')
const adminRoutes = require('./routes/admin-routes')

// importing seeds
const initializeUIConfig = require('./seeds/uiConfig')
const setAdmin = require('./seeds/setAdmin')

const constants = require('./config/constants')
const config = require('./config/config')

// connecting to our database
mongoose.connect(constants.db.url, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
    useFindAndModify: false
});

mongoose.connection.on("error", err => {
    console.log("err", err)
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected to the database")
});

mongoose.connection.on("open", (err, res) => {
    if (err) throw new Error(err)

    // Run seeds on db startup
    try {
        initializeUIConfig()
        setAdmin()
    } catch (error) {
        throw new Error(error)
    }
});

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.secret
});

/**
 * Setting up of middlewares
 */

// setting up cors
app.use(cors({
    "origin": constants.client.url,
    "methods": "GET,PUT,POST,DELETE,PATCH",
}))

// parsing request body
app.use(express.json())
app.use(flash())

// setup login strategies
const initializeGoogleStrategy = require('./config/passport-config')
initializeGoogleStrategy(passport)

// initialize passport
app.use(passport.initialize())

// setup routes
app.use('/auth', authRoutes)
app.use('/user', isAuthenticated, userRoutes)
app.use('/admin', isAuthenticated, isAdmin, adminRoutes)

// setting up error handling middlewares
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(4000, () => {
    console.log('Server listening on port 4000')
})