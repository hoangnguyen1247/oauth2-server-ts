"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The authorization grant type is not supported by the authorization server."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class UnsupportedGrantTypeError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'unsupported_grantType' }, properties));
    }
}
exports.UnsupportedGrantTypeError = UnsupportedGrantTypeError;
//# sourceMappingURL=unsupported-grant-type-error.js.map