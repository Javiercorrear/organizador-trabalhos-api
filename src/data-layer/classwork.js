const fileHandler = require( './fileHandler' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const Classwork = require( '../model/Classwork' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

const MEDIA_COLLECTION = 'Media'

const uploadClasswork = ( {
    file,
    userId,
    description,
    title,
    subject,
    professorName,
    status,
    deadline
} ) => fileHandler.fileUpload( { file, userId, description, title, subject, professorName, status, deadline } )

const getUserClassWorkByTitle = ( userId, title ) => {
    const query = { userId, title }
    return mongoApi.findOne( { collectionName: MEDIA_COLLECTION, query } )
}

const getClassWorks = async( userId ) => {
    const query = { userId }
    const projection = Classwork.getProjection()
    const classworkList = await mongoApi.find( { collectionName: MEDIA_COLLECTION, query, projection } )
    return {
        ongoing: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.ongoing ) || [],
        done: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.done ) || []
    }
}

const deleteClassWork = async( userId, classWorkId, cloudStorageFileName ) => {
    const findQuery = { _id: classWorkId }
    const deleteQuery = { _id: classWorkId, userId }

    const classWork = await mongoApi.findOne( { query: findQuery, collectionName: MEDIA_COLLECTION } )
    // classwork not found
    if( !classWork ) {
        return Classwork.createDeleteResponse( {} )
    }

    // classwork found, but the requester user doesn't owns it
    if ( classWork?.userId !== userId ) {
        return Classwork.createDeleteResponse( { exists: true } )
    }

    await fileHandler.removeFile( cloudStorageFileName )
    const response = await mongoApi.deleteOne( { query: deleteQuery, collectionName: MEDIA_COLLECTION } )
    return Classwork.createDeleteResponse( {
        deleted: Boolean( response.deletedCount ),
        exists: true,
        deletedCount: response.deletedCount
    } )
}

module.exports = {
    uploadClasswork,
    getClassWorks,
    getUserClassWorkByTitle,
    deleteClassWork
}
