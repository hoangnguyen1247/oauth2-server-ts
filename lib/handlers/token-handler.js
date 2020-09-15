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
const grant_types_1 = require("../grant-types");
const models_1 = require("../models");
const request_1 = require("../request");
const response_1 = require("../response");
const token_types_1 = require("../token-types");
const fn_1 = require("../utils/fn");
const is = __importStar(require("../validator/is"));
/**
 * Grant types.
 */
const grantTypes = {
    authorizationCode: grant_types_1.AuthorizationCodeGrantType,
    client_credentials: grant_types_1.ClientCredentialsGrantType,
    password: grant_types_1.PasswordGrantType,
    refreshToken: grant_types_1.RefreshTokenGrantType,
};
class TokenHandler {
    constructor(options = {}) {
        if (!options.accessTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.refreshTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `refreshTokenLifetime`');
        }
        if (!options.model.getClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
        }
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.grantTypes = Object.assign({}, grantTypes, options.extendedGrantTypes);
        this.model = options.model;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.allowExtendedTokenAttributes = options.allowExtendedTokenAttributes;
        this.requireClientAuthentication =
            options.requireClientAuthentication || {};
        this.alwaysIssueNewRefreshToken =
            options.alwaysIssueNewRefreshToken !== false;
    }
    /**
     * Token Handler.
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
        // Extend model object with request
        this.model.request = request;
        try {
            const client = await this.getClient(request, response);
            const data = await this.handleGrantType(request, client);
            const model = new models_1.TokenModel(data, {
                allowExtendedTokenAttributes: this.allowExtendedTokenAttributes,
            });
            const tokenType = this.getTokenType(model);
            this.updateSuccessResponse(response, tokenType);
            return data;
        }
        catch (e) {
            if (!(e instanceof errors_1.OAuthError)) {
                e = new errors_1.ServerError(e);
            }
            this.updateErrorResponse(response, e);
            throw e;
        }
    }
    /**
     * Get the client from the model.
     */
    async getClient(request, response) {
        const credentials = this.getClientCredentials(request);
        const grantType = request.body.grantType;
        if (!credentials.clientId) {
            throw new errors_1.InvalidRequestError('Missing parameter: `clientId`');
        }
        if (this.isClientAuthenticationRequired(grantType) &&
            !credentials.clientSecret) {
            throw new errors_1.InvalidRequestError('Missing parameter: `clientSecret`');
        }
        if (!is.vschar(credentials.clientId)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `clientId`');
        }
        if (credentials.clientSecret && !is.vschar(credentials.clientSecret)) {
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
        const grantType = request.body.grantType;
        if (credentials) {
            return {
                clientId: credentials.name,
                clientSecret: credentials.pass,
            };
        }
        if (request.body.clientId && request.body.clientSecret) {
            return {
                clientId: request.body.clientId,
                clientSecret: request.body.clientSecret,
            };
        }
        if (!this.isClientAuthenticationRequired(grantType)) {
            if (request.body.clientId) {
                return { clientId: request.body.clientId };
            }
        }
        throw new errors_1.InvalidClientError('Invalid client: cannot retrieve client credentials');
    }
    /**
     * Handle grant type.
     */
    async handleGrantType(request, client) {
        const grantType = request.body.grantType;
        if (!grantType) {
            throw new errors_1.InvalidRequestError('Missing parameter: `grantType`');
        }
        if (!is.nchar(grantType) && !is.uri(grantType)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `grantType`');
        }
        if (!fn_1.hasOwnProperty(this.grantTypes, grantType)) {
            throw new errors_1.UnsupportedGrantTypeError('Unsupported grant type: `grantType` is invalid');
        }
        if (!client.grants.includes(grantType)) {
            throw new errors_1.UnauthorizedClientError('Unauthorized client: `grantType` is invalid');
        }
        const accessTokenLifetime = this.getAccessTokenLifetime(client);
        const refreshTokenLifetime = this.getRefreshTokenLifetime(client);
        const GrantType = this.grantTypes[grantType];
        const options = {
            accessTokenLifetime,
            model: this.model,
            refreshTokenLifetime,
            alwaysIssueNewRefreshToken: this.alwaysIssueNewRefreshToken,
        };
        return new GrantType(options).handle(request, client);
    }
    /**
     * Get access token lifetime.
     */
    getAccessTokenLifetime(client) {
        return client.accessTokenLifetime || this.accessTokenLifetime;
    }
    /**
     * Get refresh token lifetime.
     */
    getRefreshTokenLifetime(client) {
        return client.refreshTokenLifetime || this.refreshTokenLifetime;
    }
    /**
     * Get token type.
     */
    getTokenType(model) {
        return new token_types_1.BearerTokenType(model.accessToken, model.accessTokenLifetime, model.refreshToken, model.scope, model.user, model.customAttributes);
    }
    /**
     * Update response when a token is generated.
     */
    updateSuccessResponse(response, tokenType) {
        response.body = tokenType.valueOf();
        response.set('Cache-Control', 'no-store');
        response.set('Pragma', 'no-cache');
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
    /**
     * Given a grant type, check if client authentication is required
     */
    isClientAuthenticationRequired(grantType) {
        if (Object.keys(this.requireClientAuthentication).length > 0) {
            return typeof this.requireClientAuthentication[grantType] !== 'undefined'
                ? this.requireClientAuthentication[grantType]
                : true;
        }
        return true;
    }
}
exports.TokenHandler = TokenHandler;
//# sourceMappingURL=token-handler.js.map