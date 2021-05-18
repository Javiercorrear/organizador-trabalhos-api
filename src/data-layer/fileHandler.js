const { v1: uuidV1 } = require( 'uuid' )
const gcsApi = require( '../lib/google-cloud-storage/gcsApi' )

const fileUpload = async( file ) => {
    const { originalname } = file
    const formattedName = originalname.replace( / /g, '-' )

    const cloudStorageFileName = `${ uuidV1() }_${ formattedName }`
    file.originalname = cloudStorageFileName
    const fileUrl = await gcsApi.uploadImage( file )
    return { fileUrl, cloudStorageFileName }
}

const removeFile = ( fileName ) => gcsApi.removeFile( fileName )

module.exports = {
    fileUpload,
    removeFile
}
