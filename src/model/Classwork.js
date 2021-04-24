const { v1: uuidV1 } = require( 'uuid' )
const statusEnum = require( '../shared/classWorkStatusEnum' )

module.exports = class Classwork {
    constructor( {
        _id, userId, fileName, url, title, subject, professorName, description, status, createdAt, updatedAt
    } ){
        const now = new Date()

        this._id = _id || uuidV1()
        this.userId = userId
        this.title = title
        this.subject = subject
        this.professorName = professorName
        this.fileName = fileName
        this.url = url || null
        this.description = description || null
        this.status = status || statusEnum.ongoing
        this.createdAt = createdAt || now
        this.updatedAt = updatedAt || now
    }

    static getFormattedClasswork( {
        _id, userId, fileName, url, title, subject, professorName, description, status, createdAt, updatedAt
    } ) {
        return {
            id: _id,
            userId,
            title,
            subject,
            professorName,
            fileName,
            url,
            description,
            status,
            createdAt,
            updatedAt
        }
    }

    static getProjection() {
        return {
            _id: 0,
            id: '$_id',
            userId: 1,
            fileName: 1,
            url: 1,
            title: 1,
            subject: 1,
            professorName: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1
        }
    }
}
