"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const statuses = __importStar(require("statuses"));
class OAuthError extends Error {
    constructor(messageOrError, properties) {
        super();
        let message = messageOrError instanceof Error ? messageOrError.message : messageOrError;
        const error = messageOrError instanceof Error ? messageOrError : undefined;
        let props = {};
        if (!lodash_1.isEmpty(properties)) {
            props = properties;
        }
        lodash_1.defaults(props, { code: 500 });
        if (error) {
            props.inner = error;
            this.data = error["error"] || error["data"] || {};
        }
        if (lodash_1.isEmpty(message)) {
            message = statuses[props.code];
        }
        this.code = this.status = this.statusCode = props.code;
        this.message = message;
        for (const key in props) {
            if (key !== 'code') {
                this[key] = props[key];
            }
        }
        Error.captureStackTrace(this, OAuthError);
    }
}
exports.OAuthError = OAuthError;
//# sourceMappingURL=oauth-error.js.map