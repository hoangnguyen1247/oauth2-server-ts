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
class AuthorizationCodeGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getAuthorizationCode()`');
        }
        if (!options.model.revokeAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `revokeAuthorizationCode()`');
        }
        if (!options.model.saveToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
        }
    }
    /**
     * Handle authorization code grant.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
     */
    async handle(request, client) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        const code = await this.getAuthorizationCode(request, client);
        this.validateRedirectUri(request, code);
        await this.revokeAuthorizationCode(code);
        return this.saveToken(code.user, client, code.authorizationCode, code.scope);
    }
    /**
     * Get the authorization code.
     */
    async getAuthorizationCode(request, client) {
        if (!request.body.code) {
            throw new errors_1.InvalidRequestError('Missing parameter: `code`');
        }
        if (!is.vschar(request.body.code)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `code`');
        }
        const code = await this.model.getAuthorizationCode(request.body.code);
        if (!code) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        if (!code.client) {
            throw new errors_1.ServerError('Server error: `getAuthorizationCode()` did not return a `client` object');
        }
        if (!code.user) {
            throw new errors_1.ServerError('Server error: `getAuthorizationCode()` did not return a `user` object');
        }
        if (code.client.id !== client.id) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        if (!(code.expiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `expiresAt` must be a Date instance');
        }
        if (code.expiresAt < new Date()) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code has expired');
        }
        if (code.redirectUri && !is.uri(code.redirectUri)) {
            throw new errors_1.InvalidGrantError('Invalid grant: `redirectUri` is not a valid URI');
        }
        return code;
    }
    /**
     * Validate the redirect URI.
     *
     * "The authorization server MUST ensure that the redirectUri parameter is
     * present if the redirectUri parameter was included in the initial
     * authorization request as described in Section 4.1.1, and if included
     * ensure that their values are identical."
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
     */
    validateRedirectUri(request, code) {
        if (!code.redirectUri) {
            return;
        }
        const redirectUri = request.body.redirectUri || request.query.redirectUri;
        if (!is.uri(redirectUri)) {
            throw new errors_1.InvalidRequestError('Invalid request: `redirectUri` is not a valid URI');
        }
        if (redirectUri !== code.redirectUri) {
            throw new errors_1.InvalidRequestError('Invalid request: `redirectUri` is invalid');
        }
    }
    /**
     * Revoke the authorization code.
     *
     * "The authorization code MUST expire shortly after it is issued to mitigate
     * the risk of leaks. [...] If an authorization code is used more than once,
     * the authorization server MUST deny the request."
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.2
     */
    async revokeAuthorizationCode(code) {
        const status = await this.model.revokeAuthorizationCode(code);
        if (!status) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        return code;
    }
    /**
     * Save token.
     */
    async saveToken(user, client, authorizationCode, scope) {
        const accessScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const refreshToken = await this.generateRefreshToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
        const token = {
            accessToken,
            authorizationCode,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            scope: accessScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.AuthorizationCodeGrantType = AuthorizationCodeGrantType;
//# sourceMappingURL=authorization-code-grant-type.js.map