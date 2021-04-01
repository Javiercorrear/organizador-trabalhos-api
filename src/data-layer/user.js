const mongoApi = require( '../lib/mongodbApi' )
const bcrypt = require( 'bcrypt' )

const USER_COLLECTION = 'User'
const SALT_ROUNDS = 10

const createUser = async( userName, password ) => {
    const encryptedPassword = await bcrypt.hash( password, SALT_ROUNDS )
    const user = { userName, password: encryptedPassword }

    return mongoApi.insertOne( { document: user, collectionName: USER_COLLECTION } )
}

const findUserByUserName = ( userName ) => {
    const query = { userName }
    return mongoApi.findOne( { query, collectionName: USER_COLLECTION } )
}

module.exports = {
    createUser,
    findUserByUserName
}