const fileHandler = require( './fileHandler' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const Classwork = require( '../model/Classwork' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

const MEDIA_COLLECTION = 'Media'

const uploadClasswork = ( file, userId, description ) => fileHandler.fileUpload( file, userId, description )

const getClassWorks = async( userId ) => {
    const query = { userId }
    const projection = Classwork.getProjection()
    const classworkList = await mongoApi.find( { collectionName: MEDIA_COLLECTION, query, projection } )
    return {
        ongoing: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.ongoing ) || [],
        finished: classworkList?.filter( ( classwork ) => classwork.status === statusEnum.finished ) || []
    }
}

module.exports = {
    uploadClasswork,
    getClassWorks
}