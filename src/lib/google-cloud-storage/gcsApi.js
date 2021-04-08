const { Storage } = require( '@google-cloud/storage' )

const { GCS_PRIVATE_KEY, GCS_CLIENT_EMAIL } = process.env

const privateKey = `-----BEGIN PRIVATE KEY-----\n${ GCS_PRIVATE_KEY }\n-----END PRIVATE KEY-----\n`
const storage = new Storage( {
    projectId: 'organizador-trabalhos',
    email: GCS_CLIENT_EMAIL,
    credentials: {
        private_key: privateKey,
        client_email: GCS_CLIENT_EMAIL
    }
} )

const bucket = storage.bucket( 'class-works' )

const uploadImage = async( file ) => {
    const [ response ] = await bucket.upload( file.path, { destination: file.originalname } )
    const fileUri = encodeURI( response?.metadata?.mediaLink )
    return fileUri
}

module.exports = { uploadImage }
