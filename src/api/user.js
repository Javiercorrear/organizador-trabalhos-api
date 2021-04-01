const userDataLayer = require( '../data-layer/user' )

module.exports = {
    createUser: async( req, res ) => {
        const { userName, password } = req.body
        const userAlreadyExists = await userDataLayer.findUserByUserName( userName )

        if ( userAlreadyExists ) {
            return res.status( 409 ).send( { msg: 'Este nome de usuario já está sendo usado!' } )
        }
        try{
            await userDataLayer.createUser( userName, password )
        } catch ( error ) {
            console.error( error.stack )
            res.status( 500 ).send( { msg: 'Aconteceu um erro do lado servidor.' } )
        }
        return res.status( 201 ).end()
    }
}