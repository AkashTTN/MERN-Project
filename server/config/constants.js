const constants = {
    dev: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        },
        UIConfig: {
            formConfig: {
                buzz: {
                    category: ['Activity', 'Lost & Found']
                },
                complaint: {
                    statusTypes: ['Open', 'Resolved', 'In Progress'],
                    departments: ['Admin', 'HR', 'IT', 'Management'],
                    types: ['Hardware', 'Infrastructure', 'Others']
                }
            }
        }
    },
    stage: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        },
        UIConfig: {
            formConfig: {
                buzz: {
                    category: ['Activity', 'Lost & Found']
                },
                complaint: {
                    statusTypes: ['Open', 'Resolved', 'In Progress'],
                    departments: ['Admin', 'HR', 'IT', 'Management'],
                    types: ['Hardware', 'Infrastructure', 'Others']
                }
            }
        }
    },
    prod: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        },
        UIConfig: {
            formConfig: {
                buzz: {
                    category: ['Activity', 'Lost & Found']
                },
                complaint: {
                    statusTypes: ['Open', 'Resolved', 'In Progress'],
                    departments: ['Admin', 'HR', 'IT', 'Management'],
                    types: ['Hardware', 'Infrastructure', 'Others']
                }
            }
        }
    }
}

module.exports = constants[process.env.NODE_ENV || 'dev']