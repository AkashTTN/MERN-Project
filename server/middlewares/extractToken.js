// Extract Token
function extractToken(req) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        
    } else {
        // Throw error
        throw new Error('Authorization Header not found');
    }

}

module.exports = extractToken