const UIConfig = require('./UIConfig.service')

module.exports.create = async (data) => {
    return await UIConfig.create(data)
}

module.exports.getUIConfig = async () => {
    return await UIConfig.getUIConfig()
}

module.exports.deleteUIConfig = async () => {
    return await UIConfig.deleteUIConfig()
}