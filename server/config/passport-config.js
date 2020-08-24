const GoogleStrategy = require('passport-google-oauth20');
const config = require('./config');

function initialize(passport) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {

        // const userHostDomain = profile._json.hd;

        // Additional check to verify host domain of authentication user
        // if (userHostDomain === config.google.GOOGLE_USER_HOST_DOMAIN) {
        //     return done(null, profile)
        // }

        // return done(null, false, { message: 'Invalid host domain.' })

        return done(null, profile)

    }))
}

module.exports = initialize