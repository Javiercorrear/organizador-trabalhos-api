const { v1: uuidV1 } = require( 'uuid' )

class User {
    constructor( { _id, name, email, password } ) {
        this._id = _id || uuidV1()
        this.name = name
        this.email = email
        this.password = password
    }

    getFormattedUser() {
        return {
            id: this._id,
            name: this.name,
            email: this.email
        }
    }
}

module.exports = User
