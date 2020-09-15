"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
class ImplicitGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.saveToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
        }
        if (!options.user) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `user`');
        }
        this.scope = options.scope;
        this.user = options.user;
    }
    /**
     * Handle implicit token grant.
     */
    async handle(request, client) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        return this.saveToken(this.user, client, this.scope);
    }
    /**
     * Save token.
     */
    async saveToken(user, client, scope) {
        const validatedScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const token = {
            accessToken,
            accessTokenExpiresAt,
            scope: validatedScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.ImplicitGrantType = ImplicitGrantType;
//# sourceMappingURL=implicit-grant-type.js.map