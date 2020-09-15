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
class PasswordGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getUser) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
        }
        if (!options.model.saveToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
        }
    }
    /**
     * Retrieve the user from the model using a username/password combination.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
     */
    async handle(request, client) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        const scope = this.getScope(request);
        const user = await this.getUser(request);
        return this.saveToken(user, client, scope);
    }
    /**
     * Get user using a username/password combination.
     */
    async getUser(request) {
        if (!request.body.thirdpartyType && !request.body.thirdpartyToken) {
            if (!request.body.username) {
                throw new errors_1.InvalidRequestError('Missing parameter: `username`');
            }
            if (!request.body.password) {
                throw new errors_1.InvalidRequestError('Missing parameter: `password`');
            }
            if (!is.uchar(request.body.username)) {
                throw new errors_1.InvalidRequestError('Invalid parameter: `username`');
            }
            if (!is.uchar(request.body.password)) {
                throw new errors_1.InvalidRequestError('Invalid parameter: `password`');
            }
        }
        const user = await this.model.getUser(request.body.username, request.body.password, request.body.thirdpartyType, request.body.thirdpartyToken, request.body.additionalOptions);
        if (!user) {
            throw new errors_1.InvalidGrantError('Invalid grant: user credentials are invalid');
        }
        return user;
    }
    /**
     * Save token.
     */
    async saveToken(user, client, scope) {
        const accessScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const refreshToken = await this.generateRefreshToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
        const token = {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            scope: accessScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.PasswordGrantType = PasswordGrantType;
//# sourceMappingURL=password-grant-type.js.map