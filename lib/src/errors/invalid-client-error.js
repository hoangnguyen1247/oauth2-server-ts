"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "Client authentication failed (e.g., unknown client, no client
 * authentication included, or unsupported authentication method)"
 *
 * @see https://tools.ietf.org/html/rfc6749#section-5.2
 */
class InvalidClientError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_client' }, properties));
    }
}
exports.InvalidClientError = InvalidClientError;
//# sourceMappingURL=invalid-client-error.js.map