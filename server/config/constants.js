const constants = {
    dev: {
        client: {
            url: 'http://localhost:3000'
        },
        db: {
            url: 'mongodb://localhost:27017/ttnd-buzz'
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
            url: 'mongodb://localhost:27017/ttnd-buzz'
        }
    }
}

module.exports = constants[process.env.NODE_ENV || 'dev']