/** Custom error type mappings for error handling */
const customErrors = {
  /** JWT token has expired */
  tokenExpired: 'TokenExpiredError',
  /** JWT token is invalid or malformed */
  invalidToken: 'JsonWebTokenError',
  /** Data type validation error */
  typeError: 'TypeError',
};

export default customErrors;
