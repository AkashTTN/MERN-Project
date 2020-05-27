import extractToken from './extractToken'
import extractDataFromToken from './extractDataFromToken'

function isAuthenticated(req, res, next) {
    extractToken()

}

module.exports = verifyToken