const fileHandler = require( './fileHandler' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const Classwork = require( '../model/Classwork' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

const MEDIA_COLLECTION = 'Media'

// TODO: Separate document insertion, file upload and object creation.
const uploadClasswork = async( {
    file,
    userId,
    description,
    title,
    subject,
    professorName,
    status,
    deadline
} ) => {
    const { originalname } = file || {}
    const { fileUrl, cloudStorageFileName } = file ? await fileHandler.fileUpload( file ) : {}

    const media = new Classwork( {
        userId,
        fileName: originalname,
        cloudStorageFileName,
        url: fileUrl,
        title, subject,
        professorName,
        status,
        deadline,
        description
    } )
    const insertedMedia = await mongoApi.insertOne( { document: media, collectionName: MEDIA_COLLECTION } )
    return Classwork.getFormattedClasswork( insertedMedia )
}

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

const getClassWorkDetails = async( classworkId ) => {
    const query = { _id: classworkId }
    const classwork = await mongoApi.findOne( { collectionName: MEDIA_COLLECTION, query } )
    return classwork ? Classwork.getFormattedClasswork( classwork ) : null
}

const deleteClassWork = async( userId, classWorkId, cloudStorageFileName ) => {
    //TODO: separate concerns. The deletion itself should be isolated from the rest of the logic.
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

const updateClasswork = async( userId, classworkId, classwork, newFile ) => {
    if ( newFile ) {
        const { originalname } = newFile
        const [ fileUploadResponse ] = await Promise.all( [
            fileHandler.fileUpload( newFile ),
            fileHandler.removeFile( classwork.cloudStorageFileName )
        ] )
        classwork.fileName = originalname
        classwork.url = fileUploadResponse.fileUrl
        classwork.cloudStorageFileName = fileUploadResponse.cloudStorageFileName
    }

    const classworkToUpdate = new Classwork( { ...classwork, updatedAt: new Date() } )

    const query = { _id: classworkId }
    const updatedClasswork = await mongoApi.updateOne( MEDIA_COLLECTION, query, classworkToUpdate )
    if ( updatedClasswork ) {
        return Classwork.getFormattedClasswork( updatedClasswork )
    } else if ( newFile ) {
        // remove previously inserted file if the classwork is not found
        fileHandler.removeFile( classwork.cloudStorageFileName )
    }
    return null
}

module.exports = {
    uploadClasswork,
    getClassWorks,
    getUserClassWorkByTitle,
    deleteClassWork,
    getClassWorkDetails,
    updateClasswork
}
