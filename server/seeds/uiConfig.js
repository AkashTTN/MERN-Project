const UIConfig = require('../models/UIConfig/UIConfig.controller')

const formConfig = {
    buzz: {
        category: ['Activity', 'Lost & Found'],
    },
    complaint: {
        statusTypes: ['Open', 'Resolved', 'In Progress', 'Golum'],
        departments: ['Admin', 'HR', 'IT', 'Management'],
        types: ['Hardware', 'Infrastructure', 'Others']
    }
}

module.exports = initializeUIConfig = async () => {
    // Remove previously stored config
    await UIConfig.deleteUIConfig()

    // Create new config
    await UIConfig.create({ formConfig })
}