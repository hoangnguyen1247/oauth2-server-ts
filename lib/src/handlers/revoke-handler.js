"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_auth_1 = __importDefault(require("basic-auth"));
const errors_1 = require("../errors");
const request_1 = require("../request");
const response_1 = require("../response");
const fn_1 = require("../utils/fn");
const is = __importStar(require("../validator/is"));
class RevokeHandler {
    constructor(options = {}) {
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
        }
        if (!options.model.getRefreshToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getRefreshToken()`');
        }
        if (!options.model.getAccessToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getAccessToken()`');
        }
        if (!options.model.revokeToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `revokeToken()`');
        }
        this.model = options.model;
    }
    /**
     * Revoke Handler.
     */
    async handle(request, response) {
        if (!(request instanceof request_1.Request)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
        }
        if (!(response instanceof response_1.Response)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
        }
        if (request.method !== 'POST') {
            throw new errors_1.InvalidRequestError('Invalid request: method must be POST');
        }
        if (!request.is('application/x-www-form-urlencoded')) {
            throw new errors_1.InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded');
        }
        try {
            const client = await this.getClient(request, response);
            return this.handleRevokeToken(request, client);
        }
        catch (e) {
            let error = e;
            if (!(error instanceof errors_1.OAuthError)) {
                error = new errors_1.ServerError(error);
            }
            /**
             * All necessary information is conveyed in the response code.
             *
             * Note: invalid tokens do not cause an error response since the client
             * cannot handle such an error in a reasonable way.  Moreover, the
             * purpose of the revocation request, invalidating the particular token,
             * is already achieved.
             * @see https://tools.ietf.org/html/rfc7009#section-2.2
             */
            if (!(error instanceof errors_1.InvalidTokenError)) {
                this.updateErrorResponse(response, error);
            }
            throw error;
        }
    }
    /**
     * Revoke a refresh or access token.
     *
     * Handle the revoking of refresh tokens, and access tokens if supported / desirable
     * RFC7009 specifies that "If the server is unable to locate the token using
     * the given hint, it MUST extend its search across all of its supported token types"
     */
    async handleRevokeToken(request, client) {
        try {
            let token = await this.getTokenFromRequest(request);
            token = await fn_1.oneSuccess([
                this.getAccessToken(token, client),
                this.getRefreshToken(token, client),
            ]);
            return this.revokeToken(token);
        }
        catch (errors) {
            throw errors;
        }
    }
    /**
     * Get the client from the model.
     */
    async getClient(request, response) {
        const credentials = this.getClientCredentials(request);
        if (!credentials.clientId) {
            throw new errors_1.InvalidRequestError('Missing parameter: `clientId`');
        }
        if (!credentials.clientSecret) {
            throw new errors_1.InvalidRequestError('Missing parameter: `clientSecret`');
        }
        if (!is.vschar(credentials.clientId)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `clientId`');
        }
        if (!is.vschar(credentials.clientSecret)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `clientSecret`');
        }
        try {
            const client = await this.model.getClient(credentials.clientId, credentials.clientSecret);
            if (!client) {
                throw new errors_1.InvalidClientError('Invalid client: client is invalid');
            }
            if (!client.grants) {
                throw new errors_1.ServerError('Server error: missing client `grants`');
            }
            if (!(client.grants instanceof Array)) {
                throw new errors_1.ServerError('Server error: `grants` must be an array');
            }
            return client;
        }
        catch (e) {
            // Include the "WWW-Authenticate" response header field if the client
            // attempted to authenticate via the "Authorization" request header.
            //
            // @see https://tools.ietf.org/html/rfc6749#section-5.2.
            if (e instanceof errors_1.InvalidClientError && request.get('authorization')) {
                response.set('WWW-Authenticate', 'Basic realm="Service"');
                throw new errors_1.InvalidClientError(e, { code: 401 });
            }
            throw e;
        }
    }
    /**
     * Get client credentials.
     *
     * The client credentials may be sent using the HTTP Basic authentication scheme or, alternatively,
     * the `clientId` and `clientSecret` can be embedded in the body.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-2.3.1
     */
    getClientCredentials(request) {
        const credentials = basic_auth_1.default(request);
        if (credentials) {
            return { clientId: credentials.name, clientSecret: credentials.pass };
        }
        if (request.body.clientId && request.body.clientSecret) {
            return {
                clientId: request.body.clientId,
                clientSecret: request.body.clientSecret,
            };
        }
        throw new errors_1.InvalidClientError('Invalid client: cannot retrieve client credentials');
    }
    /**
     * Get the token from the body.
     *
     * @see https://tools.ietf.org/html/rfc7009#section-2.1
     */
    getTokenFromRequest(request) {
        const bodyToken = request.body.token;
        if (!bodyToken) {
            throw new errors_1.InvalidRequestError('Missing parameter: `token`');
        }
        return bodyToken;
    }
    /**
     * Get refresh token.
     */
    async getRefreshToken(token, client) {
        const refreshToken = await this.model.getRefreshToken(token);
        if (!refreshToken) {
            throw new errors_1.InvalidTokenError('Invalid token: refresh token is invalid');
        }
        if (!refreshToken.client) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `client` object');
        }
        if (!refreshToken.user) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `user` object');
        }
        if (refreshToken.client.id !== client.id) {
            throw new errors_1.InvalidClientError('Invalid client: client is invalid');
        }
        if (refreshToken.refreshTokenExpiresAt &&
            !(refreshToken.refreshTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }
        if (refreshToken.refreshTokenExpiresAt &&
            refreshToken.refreshTokenExpiresAt < new Date()) {
            throw new errors_1.InvalidTokenError('Invalid token: refresh token has expired');
        }
        return refreshToken;
    }
    /**
     * Get the access token from the model.
     */
    async getAccessToken(token, client) {
        const accessToken = await this.model.getAccessToken(token);
        if (!accessToken) {
            throw new errors_1.InvalidTokenError('Invalid token: access token is invalid');
        }
        if (!accessToken.client) {
            throw new errors_1.ServerError('Server error: `getAccessToken()` did not return a `client` object');
        }
        if (!accessToken.user) {
            throw new errors_1.ServerError('Server error: `getAccessToken()` did not return a `user` object');
        }
        if (accessToken.client.id !== client.id) {
            throw new errors_1.InvalidClientError('Invalid client: client is invalid');
        }
        if (accessToken.accessTokenExpiresAt &&
            !(accessToken.accessTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `expires` must be a Date instance');
        }
        if (accessToken.accessTokenExpiresAt &&
            accessToken.accessTokenExpiresAt < new Date()) {
            throw new errors_1.InvalidTokenError('Invalid token: access token has expired.');
        }
        return accessToken;
    }
    /**
     * Revoke the token.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    async revokeToken(token) {
        const revokedToken = await this.model.revokeToken(token);
        if (!revokedToken) {
            throw new errors_1.InvalidTokenError('Invalid token: token is invalid');
        }
        return revokedToken;
    }
    /**
     * Update response when an error is thrown.
     */
    updateErrorResponse(response, error) {
        response.body = {
            error: error.name,
            error_description: error.message,
        };
        response.status = error.code;
    }
}
exports.RevokeHandler = RevokeHandler;
//# sourceMappingURL=revoke-handler.js.map