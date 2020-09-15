"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The provided authorization grant (e.g., authorization code, resource owner credentials)
 * or refresh token is invalid, expired, revoked, does not match the redirection URI used
 * in the authorization request, or was issued to another client."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-5.2
 */
class InvalidGrantError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_grant' }, properties));
    }
}
exports.InvalidGrantError = InvalidGrantError;
//# sourceMappingURL=invalid-grant-error.js.map