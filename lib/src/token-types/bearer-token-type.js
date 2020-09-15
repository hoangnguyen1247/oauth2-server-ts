"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const fn_1 = require("../utils/fn");
class BearerTokenType {
    constructor(accessToken, accessTokenLifetime, refreshToken, scope, user, customAttributes) {
        if (!accessToken) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessToken`');
        }
        this.accessToken = accessToken;
        this.accessTokenLifetime = accessTokenLifetime;
        this.refreshToken = refreshToken;
        this.scope = scope;
        this.user = user;
        if (customAttributes) {
            this.customAttributes = customAttributes;
        }
    }
    /**
     * Retrieve the value representation.
     */
    valueOf() {
        const object = {
            accessToken: this.accessToken,
            tokenType: 'Bearer',
        };
        if (this.accessTokenLifetime) {
            object.expiresIn = this.accessTokenLifetime;
        }
        if (this.refreshToken) {
            object.refreshToken = this.refreshToken;
        }
        if (this.scope) {
            object.scope = this.scope;
        }
        if (this.user) {
            object.user = this.user;
        }
        for (const key in this.customAttributes) {
            if (fn_1.hasOwnProperty(this.customAttributes, key)) {
                object[key] = this.customAttributes[key];
            }
        }
        return object;
    }
}
exports.BearerTokenType = BearerTokenType;
//# sourceMappingURL=bearer-token-type.js.map