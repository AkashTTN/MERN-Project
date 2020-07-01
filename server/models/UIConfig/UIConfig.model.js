const mongoose = require('mongoose')
const Schema = mongoose.Schema

const uiconfigSchema = new Schema({
    formConfig: {
        teams: Array,
        buzz: {
            category: {
                type: Array,
                default: []
            }
        },
        complaint: {
            statusTypes: {
                type: Array,
                default: []
            },
            departments: {
                type: Array,
                default: []
            },
            types: {
                type: Array,
                default: []
            }
        }
    }
})

const UIConfigModel = mongoose.model('uiconfig', uiconfigSchema)

module.exports = UIConfigModel