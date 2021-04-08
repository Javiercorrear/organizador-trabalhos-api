const { v1: uuidV1 } = require( 'uuid' )

module.exports = class Media {
    constructor( { _id, userId, url, description } ){
        this._id = _id || uuidV1()
        this.userId = userId
        this.url = url || null
        this.description = description || null
    }

    static getFormattedMedia( { _id, userId, url, description } ) {
        return {
            id: _id,
            userId,
            url,
            description
        }
    }
}