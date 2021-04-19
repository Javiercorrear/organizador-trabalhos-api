const { v1: uuidV1 } = require( 'uuid' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

module.exports = class Media {
    constructor( { _id, userId, fileName, url, description } ){
        this._id = _id || uuidV1()
        this.userId = userId
        this.fileName = fileName
        this.url = url || null
        this.description = description || null
    }

    static getFormattedMedia( { _id, userId, fileName, url, description } ) {
        return {
            id: _id,
            userId,
            fileName,
            url,
            description,
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
        }
    }
}
