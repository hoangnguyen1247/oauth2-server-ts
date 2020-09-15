"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The authorization server does not supported obtaining an
 * authorization code using this method."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class UnsupportedResponseTypeError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'unsupported_responseType' }, properties));
    }
}
exports.UnsupportedResponseTypeError = UnsupportedResponseTypeError;
//# sourceMappingURL=unsupported-response-type-error.js.map