const { v1: uuidV1 } = require( 'uuid' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const gcsApi = require( '../lib/google-cloud-storage/gcsApi' )
const Classwork = require( '../model/Classwork' )

const MEDIA_COLLECTION = 'Media'

const fileUpload = async( { file, userId, description, title, subject, professorName, status, deadline } ) => {
    let { originalname } = file
    originalname = originalname.replace( / /g, '-' )

    const cloudStorageFileName = `${ uuidV1() }_${ originalname }`
    file.originalname = cloudStorageFileName
    const fileUrl = await gcsApi.uploadImage( file )
    const media = new Classwork( {
        userId,
        fileName: originalname,
        cloudStorageFileName,
        url: fileUrl,
        title, subject,
        professorName,
        status,
        deadline,
        description
    } )
    const insertedMedia = await mongoApi.insertOne( { document: media, collectionName: MEDIA_COLLECTION } )
    return Classwork.getFormattedClasswork( insertedMedia )
}

const removeFile = ( fileName ) => gcsApi.removeFile( fileName )

module.exports = {
    fileUpload,
    removeFile
}
