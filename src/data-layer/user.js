const mongoApi = require( '../lib/mongodbApi' )
const bcrypt = require( 'bcrypt' )
const jwt = require( 'jsonwebtoken' )
const User = require( '../model/User' )

const { AUTH_SECRET_KEY } = process.env

const USER_COLLECTION = 'User'
const SALT_ROUNDS = 10

const createUser = async( userName, password ) => {
    const encryptedPassword = await bcrypt.hash( password, SALT_ROUNDS )
    const user = new User( { userName, password: encryptedPassword } )

    return mongoApi.insertOne( { document: user, collectionName: USER_COLLECTION } )
}

const findUserByUserName = ( userName ) => {
    const query = { userName }
    return mongoApi.findOne( { query, collectionName: USER_COLLECTION } )
}

const validatePassword = async( userName, password ) => {
    const user = await findUserByUserName( userName )
    if ( !user ) {
        return Promise.resolve( false )
    }
    return bcrypt.compare( password, user.password ) && new User( user ).getFormattedUser()
}

const generateToken = async( data ) => {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${ AUTH_SECRET_KEY }\n-----END RSA PRIVATE KEY-----`
    const options = { algorithm: 'RS256' }
    return jwt.sign( data, privateKey, options )
}

module.exports = {
    createUser,
    findUserByUserName,
    validatePassword,
    generateToken
}
