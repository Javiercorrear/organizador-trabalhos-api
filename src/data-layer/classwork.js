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
    professorName
} ) => fileHandler.fileUpload( { file, userId, description, title, subject, professorName } )

const getClassWorks = async( userId ) => {
    const query = { userId }
    const projection = Classwork.getProjection()
    const classworkList = await mongoApi.find( { collectionName: MEDIA_COLLECTION, query, projection } )
    return {
        ongoing: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.ongoing ) || [],
        finished: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.finished ) || []
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

    const fileRemoval = await fileHandler.removeFile( cloudStorageFileName )
    console.log( 'FILE REMOVAL >>>>>>>>>>>>>>>\n', fileRemoval )

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
    deleteClassWork
}
