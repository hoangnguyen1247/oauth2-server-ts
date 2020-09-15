"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "If the request lacks any authentication information (e.g., the client
 * was unaware that authentication is necessary or attempted using an
 * unsupported authentication method), the resource server SHOULD NOT
 * include an error code or other error information."
 *
 * @see https://tools.ietf.org/html/rfc6750#section-3.1
 */
class UnauthorizedRequestError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 401, name: 'unauthorized_request' }, properties));
    }
}
exports.UnauthorizedRequestError = UnauthorizedRequestError;
//# sourceMappingURL=unauthorized-request-error.js.map