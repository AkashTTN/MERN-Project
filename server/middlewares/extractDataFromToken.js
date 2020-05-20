const keys = require('../config/keys')
const jwt = require('jsonwebtoken')

function extractDataFromToken(req, res, next) {
    jwt.verify(req.token, keys.jwt.secret, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.body = {
                authData
            };
            next()
        }
    });
}

module.exports = extractDataFromToken