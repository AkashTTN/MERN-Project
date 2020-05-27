const config = require('../config/config')
const jwt = require('jsonwebtoken')

function extractDataFromToken(req) {
    jwt.verify(req.token, config.jwt.secret, (err, authData) => {
        if (err) {
            return new Error(err);
        } else {
            req.user = {
                authData
            };
        }
    });
}

module.exports = extractDataFromToken