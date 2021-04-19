const { v1: uuidV1 } = require( 'uuid' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const gcsApi = require( '../lib/google-cloud-storage/gcsApi' )
const Media = require( '../model/Media' )

const MEDIA_COLLECTION = 'Media'

const fileUpload = async( file, userId, description ) => {
    const { originalname } = file
    file.originalname = `${ uuidV1() }_${ originalname }`
    const fileUrl = await gcsApi.uploadImage( file )
    const media = new Media( { userId, fileName: originalname, url: fileUrl, description } )
    const insertedMedia = await mongoApi.insertOne( { document: media, collectionName: MEDIA_COLLECTION } )
    return Media.getFormattedMedia( insertedMedia )
}

module.exports = { fileUpload }
