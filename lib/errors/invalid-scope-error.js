"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The requested scope is invalid, unknown, or malformed."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class InvalidScopeError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_scope' }, properties));
    }
}
exports.InvalidScopeError = InvalidScopeError;
//# sourceMappingURL=invalid-scope-error.js.map