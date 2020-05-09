
//we export it to error.js since it is the main middleware
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode= statusCode;
    }
}
module.exports= ErrorResponse