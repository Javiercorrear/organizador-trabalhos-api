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

const uploadImage = async( file ) => new Promise( ( resolve, reject ) => {
    const { originalname, buffer } = file

    const blob = bucket.file( originalname.replace( / /g, '_' ) )
    const blobStream = blob.createWriteStream( {
        resumable: false
    } )
    blobStream.on( 'finish', () => {
        const publicUrl = encodeURI(
            `https://storage.googleapis.com/${ bucket.name }/${ blob.name }`
        )
        resolve( publicUrl )
    } )
        .on( 'error', () => {
            reject( `Unable to upload image, something went wrong` )
        } )
        .end( buffer )
} )


module.exports = { uploadImage }
