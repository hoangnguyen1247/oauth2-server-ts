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
const is = __importStar(require("../validator/is"));
class AbstractGrantType {
    constructor(options = {}) {
        if (!options.accessTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.model = options.model;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken;
    }
    /**
     * Generate access token.
     */
    async generateAccessToken(client, user, scope) {
        if (this.model.generateAccessToken) {
            const token = await this.model.generateAccessToken(client, user, scope);
            return token || tokenUtil.GenerateRandomToken();
        }
        return tokenUtil.GenerateRandomToken();
    }
    /**
     * Generate refresh token.
     */
    async generateRefreshToken(client, user, scope) {
        if (this.model.generateRefreshToken) {
            const token = await this.model.generateRefreshToken(client, user, scope);
            return token || tokenUtil.GenerateRandomToken();
        }
        return tokenUtil.GenerateRandomToken();
    }
    /**
     * Get access token expiration date.
     */
    getAccessTokenExpiresAt() {
        return new Date(Date.now() + this.accessTokenLifetime * constants_1.MS_IN_S);
    }
    /**
     * Get refresh token expiration date.
     */
    getRefreshTokenExpiresAt() {
        return new Date(Date.now() + this.refreshTokenLifetime * constants_1.MS_IN_S);
    }
    /**
     * Get scope from the request body.
     */
    getScope(request) {
        if (!is.nqschar(request.body.scope)) {
            throw new errors_1.InvalidArgumentError('Invalid parameter: `scope`');
        }
        return request.body.scope;
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
}
exports.AbstractGrantType = AbstractGrantType;
//# sourceMappingURL=abstract-grant-type.js.map