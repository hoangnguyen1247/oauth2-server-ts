"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The resource owner or authorization server denied the request"
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class AccessDeniedError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'access_denied' }, properties));
    }
}
exports.AccessDeniedError = AccessDeniedError;
//# sourceMappingURL=access-denied-error.js.map