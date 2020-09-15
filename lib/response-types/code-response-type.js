"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const tokenUtil = __importStar(require("../utils/token-util"));
class CodeResponseType {
    constructor(options = {}) {
        if (!options.authorizationCodeLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `authorizationCodeLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.saveAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveAuthorizationCode()`');
        }
        this.code = undefined;
        this.authorizationCodeLifetime = options.authorizationCodeLifetime;
        this.model = options.model;
    }
    /**
     * Handle code response type.
     */
    async handle(request, client, user, uri, scope) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        if (!user) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `user`');
        }
        if (!uri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `uri`');
        }
        const authorizationCode = await this.generateAuthorizationCode(client, user, scope);
        const expiresAt = this.getAuthorizationCodeExpiresAt(client);
        const code = await this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user);
        this.code = code.authorizationCode;
        return code;
    }
    /**
     * Get authorization code expiration date.
     */
    getAuthorizationCodeExpiresAt(client) {
        const authorizationCodeLifetime = this.getAuthorizationCodeLifetime(client);
        return new Date(Date.now() + authorizationCodeLifetime * constants_1.MS_IN_S);
    }
    /**
     * Get authorization code lifetime.
     */
    getAuthorizationCodeLifetime(client) {
        return client.authorizationCodeLifetime || this.authorizationCodeLifetime;
    }
    /**
     * Save authorization code.
     */
    async saveAuthorizationCode(authorizationCode, expiresAt, scope, client, redirectUri, user) {
        const code = {
            authorizationCode,
            expiresAt,
            redirectUri,
            scope,
        };
        return this.model.saveAuthorizationCode(code, client, user);
    }
    /**
     * Generate authorization code.
     */
    async generateAuthorizationCode(client, user, scope) {
        if (this.model.generateAuthorizationCode) {
            return this.model.generateAuthorizationCode(client, user, scope);
        }
        return tokenUtil.GenerateRandomToken();
    }
    /**
     * Build redirect uri.
     */
    buildRedirectUri(redirectUri) {
        if (!redirectUri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `redirectUri`');
        }
        redirectUri.search = undefined;
        return this.setRedirectUriParam(redirectUri, 'code', this.code);
    }
    /**
     * Set redirect uri parameter.
     */
    setRedirectUriParam(redirectUri, key, value) {
        if (!redirectUri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `redirectUri`');
        }
        if (!key) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `key`');
        }
        redirectUri.query = redirectUri.query || {};
        redirectUri.query[key] = value;
        return redirectUri;
    }
}
exports.CodeResponseType = CodeResponseType;
//# sourceMappingURL=code-response-type.js.map