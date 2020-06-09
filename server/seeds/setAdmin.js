const users = require('../models/User/user.controller')
const { admin } = require('../config/config')

module.exports = setAdmin = async () => {

    const adminCount = await users.getAdminUsersCount()
    const { googleId, name, email } = admin

    if (adminCount === 0) {
        try {
            await users.createAdmin({
                googleId,
                name,
                email
            }).then(
                () => console.log('Default admin created with email id:', email),
                (err) => {
                    console.error(err.message)
                    throw new Error('Default admin could not be created. Please create an admin.')
                }
            )
        } catch (error) {
            console.error(error.message)
        }
    }
}