
const MongoClient = require( 'mongodb' ).MongoClient
const ObjectID = require( 'mongodb' ).ObjectID
const { v1: uuidV1 } = require( 'uuid' )

const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true }
const connectionString = process.env.MONGO_URI
const MONGODB_NAME = process.env.MONGO_DB_NAME

// https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
let cachedDb = null
const connectToDatabase = () => {
    if ( cachedDb && cachedDb.serverConfig.isConnected() ) {
        return Promise.resolve( cachedDb )
    }
    return MongoClient.connect( connectionString, OPTIONS )
        .then( client => {
            cachedDb = client.db( MONGODB_NAME )
            return cachedDb
        } )
}

module.exports = {

    ObjectID,

    aggregate: async( collectionName, pipeline ) => {
        try {
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )
            const cursor = await dbCollection.aggregate( pipeline )
            return cursor.toArray()
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    delete: async params => {
        try {
            const db = await connectToDatabase()
            const dbCollection = db.collection( params.collectionName )
            return dbCollection.deleteMany( params.query )
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    find: async params => {
        try {
            const { collectionName, query, projection, skip, limit, sort } = params
            let options = {
                limit: limit || 0,
                projection,
                skip: skip || 0
            }
            options = sort ? { ...options, sort } : options
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )
            const cursor = await dbCollection.find( query, { ...options } )
            return cursor.toArray()
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    findOne: async( { collectionName, query, options } ) => {
        try {
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )

            return dbCollection.findOne( query, options )
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    insertOne: async( { document, collectionName } ) => {
        try {
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )

            document._id = document._id || uuidV1()
            return dbCollection.insertOne( document )
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    }
}
