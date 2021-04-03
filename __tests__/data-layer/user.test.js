jest.mock( '../../src/lib/mongodbApi' )
const mongoApi = require( '../../src/lib/mongodbApi' )
const userDataLayer = require( '../../src/data-layer/user' )
const bcrypt = require( 'bcrypt' )
const User = require( '../../src/model/User' )

const USER_COLLECTION = 'User'
const SALT_ROUNDS = 10

const MOCK_USER_NAME = 'user_name'
const MOCK_PASSWORD = 'some_password'

describe( 'Testing user data layer', () => {
    test( 'test 1', async() => {
        const hashSpy = jest.spyOn( bcrypt, 'hash' )
        const insertSpy = jest.spyOn( mongoApi, 'insertOne' )
        await userDataLayer.createUser( MOCK_USER_NAME, MOCK_PASSWORD )

        expect( hashSpy ).toBeCalledWith( MOCK_PASSWORD, SALT_ROUNDS )
        expect( insertSpy ).toBeCalled()
    } )
} )