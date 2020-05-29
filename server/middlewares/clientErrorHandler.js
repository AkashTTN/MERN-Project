const response = require('v-response').ApiResponse

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(200).json(response(false, 500, 'Something went wrong. Please try again later.'))
    } else {
        next(err)
    }
}

module.exports = clientErrorHandler