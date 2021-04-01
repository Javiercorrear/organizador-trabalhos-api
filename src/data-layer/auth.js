const jwt = require( 'jsonwebtoken' )
const bcrypt = require( 'bcrypt' )
const userDataLayer = require( '../data-layer/user' )
const User = require( '../model/User' )

const { AUTH_SECRET_KEY, AUTH_PUBLIC_KEY } = process.env
const ALGORITHM = 'RS256'

const validatePassword = async( userName, password ) => {
    const user = await userDataLayer.findUserByUserName( userName )
    if ( !user ) {
        return Promise.resolve( false )
    }
    const comparisonResult = await bcrypt.compare( password, user.password )
    return comparisonResult && new User( user ).getFormattedUser()
}

const generateToken = async( data ) => {
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${ AUTH_SECRET_KEY }\n-----END RSA PRIVATE KEY-----`
    const options = { algorithm: ALGORITHM }
    return jwt.sign( data, privateKey, options )
}

const verifyToken = ( token ) => {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${ AUTH_PUBLIC_KEY }\n-----END PUBLIC KEY-----`
    const options = { algorithms: [ ALGORITHM ] }

    return new Promise( ( resolve, reject ) => {
        jwt.verify( token, publicKey, options, ( error, decodedToken ) => {
            if ( error ) {
                console.error( error.stack )
                return reject( error )
            }
            return resolve( decodedToken )
        } )
    } )
}

module.exports = {
    validatePassword,
    generateToken,
    verifyToken
}