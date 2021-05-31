/* eslint-disable max-len */
const validateEmail = ( email ) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig
    return regex.test( email )
}

const validatePassword = ( password ) => {
    /*
        The password must contain six characters or more and has at least one lowercase and one uppercase alphabetical character or at least
        one lowercase and one numeric character or at least one uppercase and one numeric character
    */
    const regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g
    return regex.test( password )
}

module.exports = {
    validateEmail,
    validatePassword
}
