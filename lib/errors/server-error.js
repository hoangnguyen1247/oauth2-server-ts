"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
/**
 * ServerError
 *
 * "The authorization server encountered an unexpected condition that prevented it from fulfilling the request."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
class ServerError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 500, name: 'server_error' }, properties));
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=server-error.js.map