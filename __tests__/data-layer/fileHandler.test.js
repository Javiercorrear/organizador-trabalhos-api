jest.mock( 'uuid' )
const mongoApi = require( '../../src/lib/mongodb-api/mongodbApi' )
const gcsApi = require( '../../src/lib/google-cloud-storage/gcsApi' )
const { fileUpload } = require( '../../src/data-layer/fileHandler' )
const Media = require( '../../src/model/Media' )
const uuid = require( 'uuid' )

const MOCK_GENERATED_UUID = 'mock_uuid'
const MOCK_USER_ID = 'mock_user_id'
const MOCK_DESCRIPTION = 'This is a mock file description.'
const MOCK_FILE = Object.freeze( {
    fieldname: 'file',
    originalname: 'mock_file.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from( 'mock_buffer' ),
    size: 33035
} )

describe( 'Testing file handler data layer', () => {
    test( 'fileUpload should call functions with right parameters and return Media formatted data.', async() => {
        const mockFileUrl = `${ MOCK_USER_ID }_${ MOCK_FILE.originalname }`
        const file = { ...MOCK_FILE }
        const mockInsertedData = new Media( {
            _id: MOCK_GENERATED_UUID,
            userId: MOCK_USER_ID,
            fileName: MOCK_FILE.originalname,
            url: mockFileUrl,
            description: MOCK_DESCRIPTION
        } )
        const insertSpy = jest.spyOn( mongoApi, 'insertOne' )
        const uploadImageSpy = jest.spyOn( gcsApi, 'uploadImage' )
        uuid.v1.mockReturnValue( MOCK_GENERATED_UUID )
        insertSpy.mockResolvedValue( mockInsertedData )
        uploadImageSpy.mockResolvedValue( mockFileUrl )

        const response = await fileUpload( file, MOCK_USER_ID, MOCK_DESCRIPTION )

        expect( response ).toEqual( Media.getFormattedMedia( mockInsertedData ) )
        expect( insertSpy ).toBeCalledWith( { document: mockInsertedData, collectionName: 'Media' } )
        expect( uploadImageSpy ).toBeCalledWith( file )
    } )
} )