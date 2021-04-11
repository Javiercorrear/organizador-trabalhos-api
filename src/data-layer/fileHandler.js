const { v1: uuidV1 } = require( 'uuid' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const gcsApi = require( '../lib/google-cloud-storage/gcsApi' )
const Classwork = require( '../model/Classwork' )

const MEDIA_COLLECTION = 'Media'

const fileUpload = async( file, userId, description ) => {
    const { originalname } = file
    file.originalname = `${ uuidV1() }_${ originalname }`
    const fileUrl = await gcsApi.uploadImage( file )
    const media = new Classwork( { userId, fileName: originalname, url: fileUrl, description } )
    const insertedMedia = await mongoApi.insertOne( { document: media, collectionName: MEDIA_COLLECTION } )
    return Classwork.getFormattedClasswork( insertedMedia )
}

module.exports = { fileUpload }
