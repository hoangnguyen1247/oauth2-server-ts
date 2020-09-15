"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = __importStar(require("url"));
const _1 = require(".");
const errors_1 = require("../errors");
const request_1 = require("../request");
const response_1 = require("../response");
const response_types_1 = require("../response-types");
const fn_1 = require("../utils/fn");
const is = __importStar(require("../validator/is"));
/**
 * Response types.
 */
const responseTypes = {
    code: response_types_1.CodeResponseType,
    token: response_types_1.TokenResponseType,
};
/**
 * Constructor.
 */
class AuthorizeHandler {
    constructor(options = {}) {
        if (options.authenticateHandler && !options.authenticateHandler.handle) {
            throw new errors_1.InvalidArgumentError('Invalid argument: authenticateHandler does not implement `handle()`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
        }
        this.options = options;
        this.allowEmptyState = options.allowEmptyState;
        this.authenticateHandler =
            options.authenticateHandler || new _1.AuthenticateHandler(options);
        this.model = options.model;
    }
    /**
     * Authorize Handler.
     */
    async handle(request, response) {
        if (!(request instanceof request_1.Request)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
        }
        if (!(response instanceof response_1.Response)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
        }
        if (request.query.allowed === 'false') {
            throw new errors_1.AccessDeniedError('Access denied: user denied access to application');
        }
        // Extend model object with request
        this.model.request = request;
        const client = await this.getClient(request);
        const user = await this.getUser(request, response);
        let scope;
        let state;
        let RequestedResponseType;
        let responseType;
        const uri = this.getRedirectUri(request, client);
        try {
            const requestedScope = this.getScope(request);
            const validScope = await this.validateScope(user, client, requestedScope);
            scope = validScope;
            state = this.getState(request);
            RequestedResponseType = this.getResponseType(request, client);
            responseType = new RequestedResponseType(this.options);
            const codeOrAccessToken = await responseType.handle(request, client, user, uri, scope);
            const redirectUri = this.buildSuccessRedirectUri(uri, responseType);
            this.updateResponse(response, redirectUri, responseType, state);
            return codeOrAccessToken;
        }
        catch (e) {
            if (!(e instanceof errors_1.OAuthError)) {
                e = new errors_1.ServerError(e);
            }
            const redirectUri = this.buildErrorRedirectUri(uri, responseType, e);
            this.updateResponse(response, redirectUri, responseType, state);
            throw e;
        }
    }
    /**
     * Get the client from the model.
     */
    async getClient(request) {
        const clientId = request.body.clientId || request.query.clientId;
        if (!clientId) {
            throw new errors_1.InvalidRequestError('Missing parameter: `clientId`');
        }
        if (!is.vschar(clientId)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `clientId`');
        }
        const redirectUri = request.body.redirectUri || request.query.redirectUri;
        if (redirectUri && !is.uri(redirectUri)) {
            throw new errors_1.InvalidRequestError('Invalid request: `redirectUri` is not a valid URI');
        }
        const client = await this.model.getClient(clientId);
        if (!client) {
            throw new errors_1.InvalidClientError('Invalid client: client credentials are invalid');
        }
        if (!client.grants) {
            throw new errors_1.InvalidClientError('Invalid client: missing client `grants`');
        }
        const responseType = request.body.responseType || request.query.responseType;
        const requestedGrantType = responseType === 'token' ? 'implicit' : 'authorization_code';
        if (!client.grants.includes(requestedGrantType)) {
            throw new errors_1.UnauthorizedClientError('Unauthorized client: `grantType` is invalid');
        }
        if (!client.redirectUris || client.redirectUris.length === 0) {
            throw new errors_1.InvalidClientError('Invalid client: missing client `redirectUri`');
        }
        if (redirectUri && !client.redirectUris.includes(redirectUri)) {
            throw new errors_1.InvalidClientError('Invalid client: `redirectUri` does not match client value');
        }
        return client;
    }
    /**
     * Validate requested scope.
     */
    async validateScope(user, client, scope) {
        if (this.model.validateScope) {
            const validatedScope = await this.model.validateScope(user, client, scope);
            if (!validatedScope) {
                throw new errors_1.InvalidScopeError('Invalid scope: Requested scope is invalid');
            }
            return validatedScope;
        }
        return scope;
    }
    /**
     * Get scope from the request.
     */
    getScope(request) {
        const scope = request.body.scope || request.query.scope;
        if (!is.nqschar(scope)) {
            throw new errors_1.InvalidScopeError('Invalid parameter: `scope`');
        }
        return scope;
    }
    /**
     * Get state from the request.
     */
    getState(request) {
        const state = request.body.state || request.query.state;
        if (!this.allowEmptyState && !state) {
            throw new errors_1.InvalidRequestError('Missing parameter: `state`');
        }
        if (!is.vschar(state)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `state`');
        }
        return state;
    }
    /**
     * Get user by calling the authenticate middleware.
     */
    async getUser(request, response) {
        if (this.authenticateHandler instanceof _1.AuthenticateHandler) {
            const data = await this.authenticateHandler.handle(request, response);
            return data.user;
        }
        const user = await this.authenticateHandler.handle(request, response);
        if (!user) {
            throw new errors_1.ServerError('Server error: `handle()` did not return a `user` object');
        }
        return user;
    }
    /**
     * Get redirect URI.
     */
    getRedirectUri(request, client) {
        return (request.body.redirectUri ||
            request.query.redirectUri ||
            client.redirectUris[0]);
    }
    /**
     * Get response type.
     */
    getResponseType(request, client) {
        const responseType = request.body.responseType || request.query.responseType;
        if (!responseType) {
            throw new errors_1.InvalidRequestError('Missing parameter: `responseType`');
        }
        if (!fn_1.hasOwnProperty(responseTypes, responseType)) {
            throw new errors_1.UnsupportedResponseTypeError('Unsupported response type: `responseType` is not supported');
        }
        if (responseType === 'token' &&
            (!client || !client.grants.includes('implicit'))) {
            throw new errors_1.UnauthorizedClientError('Unauthorized client: `grantType` is invalid');
        }
        return responseTypes[responseType];
    }
    /**
     * Build a successful response that redirects the user-agent to the client-provided url.
     */
    buildSuccessRedirectUri(redirectUri, responseType) {
        const uri = url.parse(redirectUri);
        return responseType.buildRedirectUri(uri);
    }
    /**
     * Build an error response that redirects the user-agent to the client-provided url.
     */
    buildErrorRedirectUri(redirectUri, responseType, error) {
        let uri = url.parse(redirectUri, true);
        if (responseType) {
            uri = responseType.setRedirectUriParam(uri, 'error', error.name);
            if (error.message) {
                uri = responseType.setRedirectUriParam(uri, 'error_description', error.message);
            }
        }
        else {
            uri.query = {
                error: error.name,
            };
            if (error.message) {
                uri.query.error_description = error.message;
            }
        }
        return uri;
    }
    /**
     * Update response with the redirect uri and the state parameter, if available.
     */
    updateResponse(response, redirectUri, responseType, state) {
        if (responseType && state) {
            // tslint:disable-next-line:no-parameter-reassignment
            redirectUri = responseType.setRedirectUriParam(redirectUri, 'state', state);
        }
        else if (state) {
            redirectUri.query = redirectUri.query || {};
            redirectUri.query.state = state;
        }
        response.redirect(url.format(redirectUri));
    }
}
exports.AuthorizeHandler = AuthorizeHandler;
//# sourceMappingURL=authorize-handler.js.map