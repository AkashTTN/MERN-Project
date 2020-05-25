const express = require('express')
const app = express()
const passport = require('passport')
const cors = require('cors')
const flash = require('connect-flash')
const mongoose = require('mongoose')

const constants = require('./config/constants')
const extractToken = require('./middlewares/extractToken')
const extractDataFromToken = require('./middlewares/extractDataFromToken')
const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/user-routes')

const response = require('v-response').ApiResponse
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// connecting to our database
mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: "true",
    useUnifiedTopology: "true"
});

mongoose.connection.on("error", err => {
    console.log("err", err)
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected to the database")
});

/**
 * Setting up of middlewares
 */

// setting up cors
app.use(cors({
    "origin": constants.CLIENT_URL,
    "methods": "GET,POST,DELETE",
    "credentials": true
}))

// parsing request body
app.use(express.json())
app.use(flash())

// setup login strategies
const initializeGoogleStrategy = require('./config/passport-config')
initializeGoogleStrategy(passport)

// Not needed as we are not using sessions provided by passport
// passport.serializeUser((user, done) => { 
//     done(null, user.id) 
// })

// passport.deserializeUser((id, done) => {
//     return done(null, users.getUserById(id))
// })

// initialize passport
app.use(passport.initialize())

// setup routes
app.use('/auth', authRoutes)
app.use('/user', extractToken, extractDataFromToken, userRoutes)

// test routes 
app.post('/', upload.single('image1'), (req, res) => {
    console.log('Request body', req.body.data)

    res.status(200).json(response(true, 200, "Form data submitted successfully", req.body.data))
})

app.listen(4000, () => {
    console.log('Server listening on port 4000')
})