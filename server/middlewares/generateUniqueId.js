const shortid = require('shortid')

const generateUniqueId = (req, res, next) => {
    req.uniqueId = shortid.generate()
    next()
}

module.exports = generateUniqueId