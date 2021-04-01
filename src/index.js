require( 'dotenv' ).config()
const express = require( 'express' )
const cors = require( 'cors' )
const { json, urlencoded } = require( 'body-parser' )

const userApi = require( './api/user' )
const authApi = require( './api/auth' )

const port = process.env.PORT || 80
const app = express()

app.use( json() )
app.use( urlencoded( { extended: true } ) )
app.use( cors() )

app.post( '/user', userApi.createUser )
app.post( '/auth/token', authApi.authenticate )

app.get( '/', ( req, res ) => {
    res.status( 200 ).send( {
        system: 'Organizador de trabalhos acadêmicos',
        team: 'Javier Correa, Kerollyn, Thiago Lacerda'
    } )
} )
app.get( '/test', authApi.authorize, ( req, res ) => {
    res.status( 200 ).send( { ...req.user } )
} )

app.listen( port, function() {
    console.log( `App rodando em http://localhost:${ port }` )
} )