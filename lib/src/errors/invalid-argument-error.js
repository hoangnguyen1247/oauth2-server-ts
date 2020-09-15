"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidArgumentError extends oauth_error_1.OAuthError {
    constructor(message, properties) {
        super(message, Object.assign({ code: 500, name: 'invalid_argument' }, properties));
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
//# sourceMappingURL=invalid-argument-error.js.map