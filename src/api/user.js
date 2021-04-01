const userDataLayer = require( '../data-layer/user' )
const strings = require( '../shared/strings' )

const createUser = async( req, res ) => {
    try{
        const { userName, password } = req.body
        const userAlreadyExists = await userDataLayer.findUserByUserName( userName )

        if ( userAlreadyExists ) {
            return res.status( 409 ).send( { msg: 'Este nome de usuario já está sendo usado!' } )
        }
        await userDataLayer.createUser( userName, password )

    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: strings.SERVER_ERROR } )
    }
    return res.status( 201 ).end()
}

module.exports = {
    createUser
}