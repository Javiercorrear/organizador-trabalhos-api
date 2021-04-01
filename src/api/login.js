const userDataLayer = require( '../data-layer/user' )

const authenticate = async( req, res ) => {
    const { userName, password } = req.body

    if ( !userName || !password ) {
        return res.status( 400 ).send( { msg: `userName e password são obrigatórios.` } )
    }

    const authenticated = await userDataLayer.validatePassword( userName, password )
    if ( !authenticated ) {
        return res.status( 401 ).send( { msg: 'Nome de usuário ou senha incorreta.' } )
    }

    const response = await userDataLayer.generateToken()
    return res.status( 200 ).send( response )
}

module.exports = {
    authenticate
}