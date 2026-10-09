// Error Handling middleware
// All errors are passed to this middleware.
// It sends an appropriate response and provides a
// catch-all response for unexpected errors.

const ApiError = require("../utilities/ApiError");

const apiErrorHandler = (err, req, res, next) => {
  // Check if the error is a custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
  // Log unexpected errors to the server console
  console.error(err);

  // Handle unexpected server errors
  return res.status(500).json({
    success: false,
    message: "Oops! Something went wrong - Please try again later",
  });
};

module.exports = apiErrorHandler;
