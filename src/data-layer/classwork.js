const fileHandler = require( './fileHandler' )
const mongoApi = require( '../lib/mongodb-api/mongodbApi' )
const Media = require( '../model/Media' )
const Classwork = require( '../model/ClassWork' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

const MEDIA_COLLECTION = 'Media'
const CLASS_WORK_COLLECTION = 'ClassWork'

const uploadClasswork = async( file, userId, description ) => {
    const media = await fileHandler.fileUpload( { file, userId, description, title, subject, professorName } )
    const classWork = new Classwork( {
        userId,
        subject,
        professorName,
        title,
        description,
        mediasIds: media.id
    } )

}

const getClassWorks = async( userId ) => {
    const query = { userId }
    const projection = Media.getProjection()
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
