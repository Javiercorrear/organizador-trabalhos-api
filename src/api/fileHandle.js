const axios = require( 'axios' ).default
const fs  = require( 'fs' )
const FormData = require( 'form-data' )

const uploadFile = async( req, res ) => {
    const { file } = req
    if ( !file ) {
        return res.status( 400 ).send( { msg: 'O campo file é necessário.' } )
    }
    console.log( 'FILE >>>>>>>>>>\n', file )
    const fileStream = fs.createReadStream( file.path )
    const formData = new FormData()
    const url = '/api/2/path/data/files'
    const axiosConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Length': file.size
        }
    }

    formData.append( 'classWork', fileStream )
    try {
        const response = await axios.post( url, formData, axiosConfig )
        return res.status( 201 ).send( response )
    } catch ( error ) {
        console.error( error.stack )
        return res.status( 500 ).send( { msg: 'Um erro aconteceu no lado servidor.' } )
    }
}

module.exports = {
    uploadFile
}