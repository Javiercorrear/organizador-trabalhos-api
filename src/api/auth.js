const authDataLayer = require( '../data-layer/auth' )

const REQUIRED_TOKEN_PREFIX = 'Bearer'

const authenticate = async( req, res ) => {
    const { userName, password } = req.body

    if ( !userName || !password ) {
        return res.status( 400 ).send( { msg: `userName e password são obrigatórios.` } )
    }

    const authenticatedUser = await authDataLayer.validatePassword( userName, password )
    if ( !authenticatedUser ) {
        return res.status( 401 ).send( { msg: 'Nome de usuário ou senha incorreta.' } )
    }

    const token = await authDataLayer.generateToken( authenticatedUser )
    return res.status( 200 ).send( { token } )
}

const authorize = async( req, res, next ) => {
    try {
        const { Authorization, authorization } = req.headers
        const bearerToken = Authorization || authorization

        if ( !bearerToken ) {
            return res.status( 400 ).send( { msg: 'O cabeçalho authorization é necessário.' } )
        }

        const [ bearerPrefix, token ] = bearerToken && bearerToken.split( ' ' )

        if ( bearerPrefix !== REQUIRED_TOKEN_PREFIX || !token ) {
            return res.status( 400 ).send( { msg: `O token informado precisa ser um token válido com o prefixo ${ REQUIRED_TOKEN_PREFIX }.` } )
        }

        const decodedToken = await authDataLayer.verifyToken( token )
        req.user = decodedToken
        return next()
    } catch ( error ) {
        console.log( error.stack )
        return res.status( 403 ).send( { msg: 'Usuário não autorizado.' } )
    }
}

module.exports = {
    authenticate,
    authorize
}