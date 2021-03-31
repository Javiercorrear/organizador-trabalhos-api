const mongoApi = require( '../lib/mongodbApi' )
module.exports = {
    createUser: async( req, res ) => {
        console.log( req.body )
        const response = await mongoApi.insertOne( { document: req.body, collectionName: 'User' } )
        res.send( response )
    }
}