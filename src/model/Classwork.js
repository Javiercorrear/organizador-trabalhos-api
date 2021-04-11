const { v1: uuidV1 } = require( 'uuid' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

module.exports = class Classwork {
    constructor( { _id, userId, fileName, url, description, status } ){
        this._id = _id || uuidV1()
        this.userId = userId
        this.fileName = fileName
        this.url = url || null
        this.description = description || null
        this.status = status || statusEnum.ongoing
    }

    static getFormattedClasswork( { _id, userId, fileName, url, description, status } ) {
        return {
            id: _id,
            userId,
            fileName,
            url,
            description,
            status
        }
    }

    static getProjection() {
        return {
            _id: 0,
            id: '_id',
            userId: 1,
            fileName: 1,
            url: 1,
            description: 1,
            status: 1
        }
    }
}