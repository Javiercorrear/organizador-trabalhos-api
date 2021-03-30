const express = require('express')
const cors = require( 'cors' )
const { json, urlencoded } = require( 'body-parser' )

const port = process.env.PORT || 80
const app = express()

app.use( json() )
app.use( urlencoded( { extended: true } ) )
app.use( cors() )

app.get('/', (req, res) => {
    res.send( {
        system: 'Organizador de trabalhos acadêmicos',
        team: 'Javier Correa, Kerollyn, Thiago Lacerda'
    } )
})

app.listen(port, function() {
    console.log(`App rodando em http://localhost:${ port }`)
})