// errors/AuthError.js
const { GraphQLError } = require("graphql");

class AuthError extends GraphQLError {
  constructor(message = "Authentication failed", code = 401) {
    super(message, {
      extensions: {
        code: "AUTH_FAILED",
        http: {
          status: code
        }
      }
    });
  }
}

module.exports = AuthError;
