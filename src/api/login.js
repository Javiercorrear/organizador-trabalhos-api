const userDataLayer = require( '../data-layer/user' )

const authenticate = async( req, res ) => {
    const { userName, password } = req.body

    if ( !userName || !password ) {
        return res.status( 400 ).send( { msg: `userName e password são obrigatórios.` } )
    }

    const authenticatedUser = await userDataLayer.validatePassword( userName, password )
    if ( !authenticatedUser ) {
        return res.status( 401 ).send( { msg: 'Nome de usuário ou senha incorreta.' } )
    }

    const token = await userDataLayer.generateToken( authenticatedUser )
    return res.status( 200 ).send( token )
}

module.exports = {
    authenticate
}