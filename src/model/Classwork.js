const { v1: uuidV1 } = require( 'uuid' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

module.exports = class Classwork {
    constructor( { _id, userId, title, subject, professorName, description, mediasIds = [], status } ) {
        this._id = _id || uuidV1()
        this.userId = userId
        this.title = title
        this.subject = subject
        this.professorName = professorName
        this.description = description || null
        this.mediasIds = Array.isArray( mediasIds ) ? mediasIds : [ mediasIds ]
        this.status = status || statusEnum.ongoing
    }

    addMedia( mediaId ) {
        return Array.isArray( mediaId ) ? this.medias.concat( mediaId ) : this.medias
    }
}
