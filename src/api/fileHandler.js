const fileHandlerDataLayer = require( '../data-layer/fileHandler' )

const uploadFile = async( req, res ) => {
    const { file } = req
    if ( !file ) {
        return res.status( 400 ).send( { msg: 'O campo file é necessário.' } )
    }
    try {
        const response = await fileHandlerDataLayer.fileUpload( file )
        return res.status( 200 ).send( { fileUri: response } )
    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: 'Um erro aconteceu no lado servidor.' } )
    }
}

module.exports = {
    uploadFile
}