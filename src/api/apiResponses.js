const createServerErrorResponse = ( res, error ) => {
    console.error( error.stack )
    res.status( 500 ).send( { msg: error.message } )
}

module.exports = {
    createServerErrorResponse
}