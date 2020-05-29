const extractToken = require('./extractToken')
const extractDataFromToken = require('./extractDataFromToken')
const response = require('v-response').ApiResponse

function isAuthenticated(req, res, next) {
    try {
        extractToken(req)
        extractDataFromToken(req)
        next()
    } catch (error) {
        console.error(error)
        // Forbidden
        res.status(200).json(response(false, 403, 'You are unauthorized.'))
    }
}

module.exports = isAuthenticated