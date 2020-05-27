const extractToken = require('./extractToken')
const extractDataFromToken = require('./extractDataFromToken')

function isAuthenticated(req, res, next) {
    try {
        extractToken(req)
        extractDataFromToken(req)
        next()
    } catch (error) {
        console.error(error)
        // Forbidden
        res.sendStatus(403)
    }
}

module.exports = isAuthenticated