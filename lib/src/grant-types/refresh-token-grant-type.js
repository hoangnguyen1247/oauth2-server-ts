"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
const is = __importStar(require("../validator/is"));
class RefreshTokenGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getRefreshToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getRefreshToken()`');
        }
        if (!options.model.revokeToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `revokeToken()`');
        }
        if (!options.model.saveToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
        }
    }
    /**
     * Handle refresh token grant.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    async handle(request, client) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        const token = await this.getRefreshToken(request, client);
        await this.revokeToken(token);
        return this.saveToken(token.user, client, token.scope);
    }
    /**
     * Get refresh token.
     */
    async getRefreshToken(request, client) {
        if (!request.body.refreshToken) {
            throw new errors_1.InvalidRequestError('Missing parameter: `refreshToken`');
        }
        if (!is.vschar(request.body.refreshToken)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `refreshToken`');
        }
        const token = await this.model.getRefreshToken(request.body.refreshToken);
        if (!token) {
            throw new errors_1.InvalidGrantError('Invalid grant: refresh token is invalid');
        }
        if (!token.client) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `client` object');
        }
        if (!token.user) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `user` object');
        }
        if (token.client.id !== client.id) {
            throw new errors_1.InvalidGrantError('Invalid grant: refresh token is invalid');
        }
        if (token.refreshTokenExpiresAt &&
            !(token.refreshTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }
        if (token.refreshTokenExpiresAt &&
            token.refreshTokenExpiresAt < new Date()) {
            throw new errors_1.InvalidGrantError('Invalid grant: refresh token has expired');
        }
        return token;
    }
    /**
     * Revoke the refresh token.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    async revokeToken(token) {
        if (this.alwaysIssueNewRefreshToken === false) {
            return token;
        }
        const status = await this.model.revokeToken(token);
        if (!status) {
            throw new errors_1.InvalidGrantError('Invalid grant: refresh token is invalid');
        }
        return token;
    }
    /**
     * Save token.
     */
    async saveToken(user, client, scope) {
        const accessToken = await this.generateAccessToken(client, user, scope);
        const refreshToken = await this.generateRefreshToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
        const token = {
            accessToken,
            accessTokenExpiresAt,
            scope,
        };
        if (this.alwaysIssueNewRefreshToken !== false) {
            token.refreshToken = refreshToken;
            token.refreshTokenExpiresAt = refreshTokenExpiresAt;
        }
        const savedToken = await this.model.saveToken(token, client, user);
        return savedToken;
    }
}
exports.RefreshTokenGrantType = RefreshTokenGrantType;
//# sourceMappingURL=refresh-token-grant-type.js.map