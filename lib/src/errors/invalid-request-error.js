"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The request is missing a required parameter, includes an invalid parameter value,
 * includes a parameter more than once, or is otherwise malformed."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.2.2.1
 */
class InvalidRequestError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_request' }, properties));
    }
}
exports.InvalidRequestError = InvalidRequestError;
//# sourceMappingURL=invalid-request-error.js.map