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

    static getFormattedClasswork( { _id, fileName, url, description, status } ) {
        return {
            id: _id,
            fileName,
            url,
            description,
            status
        }
    }
}