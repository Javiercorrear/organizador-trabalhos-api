const classworkDataLayer = require( '../data-layer/classwork' )
const { createServerErrorResponse } = require( './apiResponses' )
const Classwork = require( '../model/Classwork' )

const uploadClasswork = async( req, res ) => {
    console.log( req.headers )
    const { file, user } = req
    const { title, subject, professorName, description, status, deadline } = req?.body || {}

    const missingRequiredFields = !file || !subject || !title || !professorName || !status || !deadline

    if ( missingRequiredFields  ) {
        return res.status( 400 )
            .send( { msg: 'The fields file, subject, title, professorName, status and deadline are required.' } )
    }

    if ( !Classwork.validateFileType( file ) ) {
        return res.status( 415 ).send( { msg: 'The file type is not supported.' } )
    }

    try {
        const classworkAlreadyExists = Boolean( await classworkDataLayer.getUserClassWorkByTitle( user.id, title ) )

        if ( classworkAlreadyExists ) {
            return res.status( 409 ).send( {
                msg: `This user already has a classwork with the selected title(${ title }).`,
                title
            } )
        }

        const newMedia = await classworkDataLayer.uploadClasswork( {
            file, userId: user.id, title, subject, professorName, description, status, deadline
        } )
        return res.status( 201 ).send( newMedia )
    } catch ( error ) {
        return createServerErrorResponse( res, error )
    }
}

const getClassWorks = async( req, res ) => {
    const { user: { id: userId } } = req

    try{
        const classWorkList = await classworkDataLayer.getClassWorks( userId )
        return res.status( 200 ).send( classWorkList )
    } catch ( err ) {
        return createServerErrorResponse( res, err )
    }
}

const getClassWorkDetails = async( req, res ) => {
    const { classworkId } = req.params
    try{
        const classwork = await classworkDataLayer.getClassWorkDetails( classworkId )
        if ( !classwork ) {
            console.error( `Classwork with id ${ classworkId } not found.` )
            return res.status( 404 ).send( { msg: 'Classwork not found.' } )
        }
        return res.status( 200 ).send( classwork )
    } catch ( err ) {
        return createServerErrorResponse( res, err )
    }
}

const updateClasswork = async( req, res ) => {
    try {
        const { file } = req
        const { classwork } = req.body
        const { classworkId } = req.params
console.log( 'CLASSWORK >>>>>>>>>>>>>>\n', classwork )
        const parsedClasswork = JSON.parse( classwork )
        const { userId, cloudStorageFileName } = parsedClasswork

        if ( !userId || !cloudStorageFileName ) {
            return res.status( 400 ).send( {
                msg: 'One of the following fields are missing in the classwork: userId, id, cloudStorageFileName'
            } )
        }
        if ( file && !Classwork.validateFileType( file ) ) {
            return res.status( 415 ).send( { msg: 'The file type is not supported.' } )
        }
        const updatedClasswork = await classworkDataLayer.updateClasswork( userId, classworkId, parsedClasswork, file )
        return updatedClasswork
            ? res.status( 200 ).send( updatedClasswork )
            : res.status( 404 ).send( { msg: 'Classwork not found.' } )
    } catch ( err ) {
        return createServerErrorResponse( res, err )
    }
}

const deleteClassWork = async( req, res ) => {
    try{
        const { user: { id: userId } } = req
        const { classWorkId } = req.params
        const { cloudStorageFileName } = req.query
        const { deleted, exists } = await classworkDataLayer
            .deleteClassWork( userId, classWorkId, cloudStorageFileName )

        if ( !exists ) {
            return res.status( 404 ).send( { deleted, msg: `Classwork with id ${ classWorkId } was not found.` } )
        } else if ( !deleted ) {
            return res.status( 403 ).send( { deleted, msg: `Classwork with id ${ classWorkId } is owned by another user.` } )
        }

        return res.status( 200 ).send( { deleted, msg: `Classwork with id ${ classWorkId } was successfully deleted.` } )
    } catch ( err ) {
        console.error( err.stack )
        return createServerErrorResponse( res, err )
    }
}

module.exports = {
    uploadClasswork,
    getClassWorks,
    deleteClassWork,
    getClassWorkDetails,
    updateClasswork
}
