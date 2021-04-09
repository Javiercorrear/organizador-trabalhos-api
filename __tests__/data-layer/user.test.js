const mongoApi = require( '../../src/lib/mongodb-api/mongodbApi' )
const userDataLayer = require( '../../src/data-layer/user' )
const bcrypt = require( 'bcrypt' )

const USER_COLLECTION = 'User'
const SALT_ROUNDS = 10

const MOCK_USER_NAME = 'user_name'
const MOCK_EMAIL = 'email@mock.com'
const MOCK_PASSWORD = 'some_password'

describe( 'Testing user data layer', () => {
    test( 'funçao createUser deve chamar as funçoes com os parametros corretos.', async() => {
        const hashSpy = jest.spyOn( bcrypt, 'hash' )
        const insertSpy = jest.spyOn( mongoApi, 'insertOne' )
        await userDataLayer.createUser( MOCK_USER_NAME, MOCK_EMAIL, MOCK_PASSWORD )

        expect( hashSpy ).toBeCalledWith( MOCK_PASSWORD, SALT_ROUNDS )
        expect( insertSpy ).toBeCalled()
    } )

    test( 'Função findUserByUserName deve chamar as funçoes com os parametros corretos.', async() => {
        const findOneSpy = jest.spyOn( mongoApi, 'findOne' )
        await userDataLayer.findUserByEmail( MOCK_EMAIL )

        const expectedQuery = { email: MOCK_EMAIL }
        expect( findOneSpy ).toBeCalledWith( { query: expectedQuery, collectionName: USER_COLLECTION } )
    } )
} )