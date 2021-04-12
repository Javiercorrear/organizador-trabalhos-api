const userDataLayer = require( '../data-layer/user' )
const User = require( '../model/User' )

const createUser = async( req, res ) => {
    try{
        const { name, email, password, passwordConfirmation } = req.body
        const userAlreadyExists = await userDataLayer.findUserByEmail( email )

        if ( userAlreadyExists ) {
            return res.status( 409 ).send( { msg: 'Este e-mail já está sendo usado!' } )
        }

        const user = await userDataLayer.createUser( name, email, password, passwordConfirmation )
        if ( user.error ) {
            return res.status( 400 ).send( { msg: user.error } )
        }
        return res.status( 201 ).send( new User( user ).getFormattedUser() )
    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: error.message } )
    }
}

module.exports = {
    createUser
}