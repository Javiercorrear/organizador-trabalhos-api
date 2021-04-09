const { v1: uuidV1 } = require( 'uuid' )

module.exports = class Media {
    constructor( { _id, userId, fileName, url, description } ){
        this._id = _id || uuidV1()
        this.userId = userId
        this.fileName = fileName
        this.url = url || null
        this.description = description || null
    }

    static getFormattedMedia( { _id, fileName, url, description } ) {
        return {
            id: _id,
            fileName,
            url,
            description
        }
    }
}