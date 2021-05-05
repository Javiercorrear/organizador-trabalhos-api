const text = [ 'txt', 'doc', 'docx', 'odt', 'pdf' ]
const sheet = [ 'xls', 'xlsx' ]
const image = [ 'png', 'jpg', 'jpeg' ]
const compressed = [ 'zip', 'rar' ]


module.exports = Object.freeze( {
    text,
    sheet,
    image,
    compressed,

    allAcceptedTypes: text.concat( compressed, sheet, image, compressed )
} )
