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
    return bcrypt.compare( password, user.password )
}

const generateToken = async() => {
    console.log( AUTH_SECRET_KEY )
    const token = jwt.sign( { user: 'javi' }, `-----BEGIN RSA PRIVATE KEY-----${ AUTH_SECRET_KEY }-----END RSA PRIVATE KEY-----` )
    return token
}

module.exports = {
    createUser,
    findUserByUserName,
    validatePassword,
    generateToken
}
