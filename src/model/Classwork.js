const { v1: uuidV1 } = require( 'uuid' )
const statusEnum = require( '../shared/classWorkStatusEnum' )
const FileTypes = require( './FileTypes' )

module.exports = class Classwork {
    constructor( {
        _id,
        id,
        userId,
        fileName,
        cloudStorageFileName,
        url,
        title,
        subject,
        professorName,
        status,
        deadline,
        description,
        createdAt,
        updatedAt
    } ){
        const now = new Date()
        this._id = _id || id || uuidV1()
        this.userId = userId
        this.title = title
        this.subject = subject
        this.professorName = professorName
        this.fileName = fileName
        this.cloudStorageFileName = cloudStorageFileName
        this.url = url || null
        this.description = description || null
        this.status = status || statusEnum.ongoing
        this.deadline = new Date( deadline )
        this.createdAt = new Date( createdAt ) || now
        this.updatedAt = new Date( updatedAt ) || now
    }

    static createDeleteResponse( { deleted = false, exists = false, deletedCount = 0 } ) {
        return {
            deleted,
            exists,
            deletedCount
        }
    }


    static getFormattedClasswork( {
        _id,
        userId,
        fileName,
        cloudStorageFileName,
        url,
        title,
        subject,
        professorName,
        description,
        deadline,
        status,
        createdAt,
        updatedAt
    } ) {
        return {
            id: _id,
            userId,
            title,
            subject,
            professorName,
            fileName,
            cloudStorageFileName,
            url,
            description,
            deadline,
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
            cloudStorageFileName: 1,
            url: 1,
            title: 1,
            subject: 1,
            professorName: 1,
            description: 1,
            deadline: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1
        }
    }

    static validateFileType( file ) {
        const { originalname: fileName } = file
        const extension = fileName?.split( '.' )?.pop()
        return FileTypes.allAcceptedTypes.includes( extension )
    }
}
