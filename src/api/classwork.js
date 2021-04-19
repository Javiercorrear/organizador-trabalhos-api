const classworkDataLayer = require( '../data-layer/classwork' )
const { createServerErrorResponse } = require( './apiResponses' )

const uploadClasswork = async( req, res ) => {
    console.log( req.headers )
    const { file, user } = req
    const { description, title, subject, professorName } = req?.body || {}

    if ( !file ) {
        return res.status( 400 ).send( { msg: 'O campo file é necessário.' } )
    }

    try {
        const classWork = await classworkDataLayer.uploadClasswork( {
            file,
            userId: user.id,
            description,
            title,
            subject,
            professorName
        } )
        return res.status( 201 ).send( classWork )
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

module.exports = {
    uploadClasswork,
    getClassWorks
}
