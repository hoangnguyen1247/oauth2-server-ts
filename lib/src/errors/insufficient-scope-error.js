"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * Constructor.
 *
 * "The request requires higher privileges than provided by the access token.."
 *
 * @see https://tools.ietf.org/html/rfc6750.html#section-3.1
 */
class InsufficientScopeError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 403, name: 'insufficient_scope' }, properties));
    }
}
exports.InsufficientScopeError = InsufficientScopeError;
//# sourceMappingURL=insufficient-scope-error.js.map