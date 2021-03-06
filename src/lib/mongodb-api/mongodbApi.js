
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

    deleteOne: async( { collectionName, query } ) => {
        try {
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )
            return dbCollection.deleteOne( query )
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    find: async( { collectionName, query, projection, skip, limit, sort } ) => {
        try {
            let options = {
                limit: limit || 0,
                projection,
                skip: skip || 0
            }
            options = sort ? { ...options, sort } : options
            const db = await connectToDatabase()
            const dbCollection = db.collection( collectionName )
            const cursor = await dbCollection.find( query, options )
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
            const response = await dbCollection.insertOne( document )
            const [ insertedDocument ] = response.ops
            return insertedDocument
        } catch ( error ) {
            console.error( error.stack )
            return null
        }
    },

    updateOne: async( collectionName, query, document, additionalOptions = {} ) => {
        try {
            const db = await connectToDatabase()
            const collection = db.collection( collectionName )

            const documentToBeUpdated = document

            documentToBeUpdated._updated_at = new Date()
            delete documentToBeUpdated.id
            delete documentToBeUpdated._id

            const update = { '$set': documentToBeUpdated }

            const options = {
                returnOriginal: false,
                ...additionalOptions
            }

            const updatedDocument = await collection.findOneAndUpdate( query, update, options )

            if ( updatedDocument.value ) {
                console.log( `Updated document ${ updatedDocument?.value?._id } into ${ collectionName }.` )
            } else {
                console.log( `No documents were found` )
            }
            return updatedDocument.value
        } catch( error ) {
            console.error( error.stack )
            throw new Error( error.message )
        }
    }
}
