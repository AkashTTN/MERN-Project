const config = {
    dev: {
        google: {
            clientID: '546037694521-nh1ugs3igucc46oggj1t1hpu5o2fvbjv.apps.googleusercontent.com',
            clientSecret: 'TUXti15jl3_BdwewagLEcH7i',
            // allow google users with only this domain
            GOOGLE_USER_HOST_DOMAIN: 'tothenew.com',
        },
        jwt: {
            secret: 'sh'
        }
    },
    stage: {
        google: {
            clientID: '546037694521-nh1ugs3igucc46oggj1t1hpu5o2fvbjv.apps.googleusercontent.com',
            clientSecret: 'TUXti15jl3_BdwewagLEcH7i',
            // allow google users with only this domain
            GOOGLE_USER_HOST_DOMAIN: 'tothenew.com',
        },
        jwt: {
            secret: 'shh'
        }
    },
    prod: {
        google: {
            clientID: '546037694521-nh1ugs3igucc46oggj1t1hpu5o2fvbjv.apps.googleusercontent.com',
            clientSecret: 'TUXti15jl3_BdwewagLEcH7i',
            // allow google users with only this domain
            GOOGLE_USER_HOST_DOMAIN: 'tothenew.com',
        },
        jwt: {
            secret: 'shhh'
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'dev']