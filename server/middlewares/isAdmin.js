const response = require('v-response').ApiResponse

function isAdmin(req, res, next) {
    if (req.user.authData.role !== 'admin') {
        return res.status(200).json(
            response(
                false,
                403,
                'You are not authorized to make this request.'
            )
        )
    }
    next()
}

module.exports = isAdmin