class ApiError {
  constructor(code, message, err) {
    // Class properties to be passed in as parameters/arguments
    ((this.code = code), (this.message = message), (this.err = err));
  }

  // [400] Bad Request
  // Parameters: We just pass in our custom message & status code is set as part of the function
  static badRequest(msg) {
    return new ApiError(400, `Bad Request: ${msg}`);
  }
  // [404] Not Found
  // Parameters: Takes no arguments as it is a static error(only ever going to give one message!)
  static notFound() {
    return new ApiError(404, "Resource Not Found");
  }

  // [500] Internal Server Error
  // Paramenters: This takes two arguments - our custom message to the client + the error stack passed from the server/DB. We will need this for debugging, so we console.log this out!
  static internal(msg, err) {
    console.error(err);
    return new ApiError(500, `Internal Server Error: ${msg}`);
  }
}
module.exports = ApiError;
