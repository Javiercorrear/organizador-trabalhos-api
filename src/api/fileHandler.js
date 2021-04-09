const fileHandlerDataLayer = require( '../data-layer/fileHandler' )

const uploadFile = async( req, res ) => {
    const { file, user } = req
    const { description } = req?.body || {}
    if ( !file ) {
        return res.status( 400 ).send( { msg: 'O campo file é necessário.' } )
    }
    try {
        const newMedia = await fileHandlerDataLayer.fileUpload( file, user.id, description )
        return res.status( 200 ).send( { ...newMedia } )
    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: error.message } )
    }
}

module.exports = {
    uploadFile
}