const userDataLayer = require( '../data-layer/user' )
const User = require('../model/User')
const strings = require( '../shared/strings' )

const createUser = async( req, res ) => {
    try{
        const { userName, password } = req.body
        const userAlreadyExists = await userDataLayer.findUserByUserName( userName )

        if ( userAlreadyExists ) {
            return res.status( 409 ).send( { msg: 'Este nome de usuario já está sendo usado!' } )
        }

        const user = await userDataLayer.createUser( userName, password )
        return res.status( 201 ).send( new User( user ).getFormattedUser() )
    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: strings.SERVER_ERROR } )
    }
}

module.exports = {
    createUser
}