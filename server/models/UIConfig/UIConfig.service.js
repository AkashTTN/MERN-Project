const UIConfigModel = require('./UIConfig.model')

module.exports.create = async ({ formConfig }) => {
    return await UIConfigModel.create({ formConfig })
}

module.exports.getUIConfig = async () => {
    return await UIConfigModel.find({}, { _id: 0 })
}

module.exports.deleteUIConfig = async () => {
    return await UIConfigModel.deleteMany({})
}