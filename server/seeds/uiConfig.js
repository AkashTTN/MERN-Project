const UIConfig = require('../models/UIConfig/UIConfig.controller')

const formConfig = {
    buzz: {
        category: ['Activity', 'Lost & Found'],
    },
    complaint: {
        statusTypes: ['Open', 'Resolved', 'In Progress'],
        departments: ['Admin', 'HR', 'IT', 'Management'],
        types: ['Hardware', 'Infrastructure', 'Others']
    },
    teams: ['DEVELOPMENT', 'HR', 'IT', 'MANAGEMENT', 'ADMIN']
}

module.exports = initializeUIConfig = async () => {
    // Remove previously stored config
    await UIConfig.deleteUIConfig()

    // Create new config
    await UIConfig.create({ formConfig })
}