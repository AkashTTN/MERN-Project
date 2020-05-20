const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const constants = require('./constants')

function initialize(passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {

        const userHostDomain = profile._json.hd;

        // Additional check to verify host domain of authentication user
        if (userHostDomain === constants.GOOGLE_USER_HOST_DOMAIN) {
            return done(null, profile)
        }

        return done(null, false, { message: 'Invalid host domain.' })

    }))
}

module.exports = initialize