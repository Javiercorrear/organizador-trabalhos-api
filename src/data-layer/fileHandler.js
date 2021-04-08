const gcsApi = require( '../lib/google-cloud-storage/gcsApi' )

const fileUpload = ( file ) => gcsApi.uploadImage( file )

module.exports = { fileUpload }
