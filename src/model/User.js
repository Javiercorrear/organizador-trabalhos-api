const { v1: uuidV1 } = require( 'uuid' )

class User {
    constructor( { _id, userName, password } ) {
        this._id = _id || uuidV1()
        this.userName = userName
        this.password = password
    }

    getFormattedUser() {
        return {
            id: this._id,
            userName: this.userName
        }
    }
}

module.exports = User
