const constants = {
    dev: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        }
    },
    stage: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        }
    },
    prod: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/testdb'
        }
    }
}

module.exports = constants[process.env.NODE_ENV || 'dev']