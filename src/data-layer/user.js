const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const bcrypt = require( 'bcrypt' )
const User = require( '../model/User' )


const USER_COLLECTION = 'User'
const SALT_ROUNDS = 10

const createUser = async( name, email, password ) => {
    const encryptedPassword = await bcrypt.hash( password, SALT_ROUNDS )
    const user = new User( { name, email, password: encryptedPassword } )

    return mongoApi.insertOne( { document: user, collectionName: USER_COLLECTION } )
}

const findUserByEmail = ( email ) => {
    const query = { email }
    return mongoApi.findOne( { query, collectionName: USER_COLLECTION } )
}

module.exports = {
    createUser,
    findUserByEmail
}
