require( 'dotenv' ).config()
const path = require( 'path' )
const express = require( 'express' )
const cors = require( 'cors' )
const multer = require( 'multer' )

const userApi = require( './api/user' )
const authApi = require( './api/auth' )
const classworkApi = require( './api/classwork' )

const port = process.env.PORT || 3000
const app = express()
const megaByteUnit = 1024 * 1024
const upload = multer( {
    storage: multer.memoryStorage(),
    // file no larger than 10mb
    limits: { fileSize: 10 * megaByteUnit }
} )

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( cors() )

app.use( express.static( path.join( __dirname, '..', 'docs' ) ) )

app.post( '/user', userApi.createUser )
app.post( '/auth/token', authApi.authenticate )

app.post( '/classworks', authApi.authorize, upload.single( 'file' ), classworkApi.uploadClasswork )
app.get( '/classworks', authApi.authorize, classworkApi.getClassWorks )
app.patch( '/classworks/:classworkId', authApi.authorize, upload.single( 'file' ), classworkApi.updateClasswork )
app.get( '/classworks/:classworkId', authApi.authorize, classworkApi.getClassWorkDetails )
app.delete( '/classworks/:classWorkId', authApi.authorize, classworkApi.deleteClassWork )

app.get( '/test', authApi.authorize, upload.single( 'file' ), ( req, res ) => {
    console.log( req.file )
    res.status( 200 ).send( { ...req.user } )
} )

app.listen( port, () => {
    console.log( `Server running on http://localhost:${ port }` )
} )
