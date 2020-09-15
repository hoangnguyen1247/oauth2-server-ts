"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The authenticated client is not authorized to use this authorization grant type."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class UnauthorizedClientError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'unauthorized_client' }, properties));
    }
}
exports.UnauthorizedClientError = UnauthorizedClientError;
//# sourceMappingURL=unauthorized-client-error.js.map