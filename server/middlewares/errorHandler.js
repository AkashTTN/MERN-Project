const response = require('v-response').ApiResponse

function errorHandler(err, req, res, next) {
    res.status(200).json(response(false, 500, "Something went wrong. Please try later."))
}

module.exports = errorHandler