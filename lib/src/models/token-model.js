"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const fn_1 = require("../utils/fn");
const modelAttributes = [
    'accessToken',
    'accessTokenExpiresAt',
    'client',
    'refreshToken',
    'refreshTokenExpiresAt',
    'scope',
    'user',
];
class TokenModel {
    constructor(data = {}, options = {}) {
        if (!data.accessToken) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessToken`');
        }
        if (!data.client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        if (!data.user) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `user`');
        }
        if (data.accessTokenExpiresAt &&
            !(data.accessTokenExpiresAt instanceof Date)) {
            throw new errors_1.InvalidArgumentError('Invalid parameter: `accessTokenExpiresAt`');
        }
        if (data.refreshTokenExpiresAt &&
            !(data.refreshTokenExpiresAt instanceof Date)) {
            throw new errors_1.InvalidArgumentError('Invalid parameter: `refreshTokenExpiresAt`');
        }
        this.accessToken = data.accessToken;
        this.accessTokenExpiresAt = data.accessTokenExpiresAt;
        this.client = data.client;
        this.refreshToken = data.refreshToken;
        this.refreshTokenExpiresAt = data.refreshTokenExpiresAt;
        this.scope = data.scope;
        this.user = data.user;
        if (options && options.allowExtendedTokenAttributes) {
            this.customAttributes = {};
            for (const key in data) {
                if (fn_1.hasOwnProperty(data, key) && modelAttributes.indexOf(key) < 0) {
                    this.customAttributes[key] = data[key];
                }
            }
        }
        if (this.accessTokenExpiresAt) {
            this.accessTokenLifetime = Math.floor((this.accessTokenExpiresAt.getTime() - new Date().getTime()) / constants_1.MS_IN_S);
        }
    }
}
exports.TokenModel = TokenModel;
//# sourceMappingURL=token-model.js.map