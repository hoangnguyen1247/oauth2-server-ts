"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const handlers_1 = require("./handlers");
class OAuth2Server {
    constructor(options = {}) {
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        this.options = options;
    }
    async authenticate(request, response, options) {
        let opt = options;
        if (typeof opt === 'string') {
            opt = { scope: opt };
        }
        opt = Object.assign({ addAcceptedScopesHeader: true, addAuthorizedScopesHeader: true, allowBearerTokensInQueryString: false }, this.options, opt);
        return new handlers_1.AuthenticateHandler(opt).handle(request, response);
    }
    /**
     * Authorize a request.
     */
    async authorize(request, response, options) {
        const opts = Object.assign({ allowEmptyState: false, accessTokenLifetime: 60 * 60, authorizationCodeLifetime: 5 * 60 }, this.options, options);
        return new handlers_1.AuthorizeHandler(opts).handle(request, response);
    }
    /**
     * Create a token.
     */
    async token(request, response, options) {
        const opts = Object.assign({ accessTokenLifetime: 60 * 60, refreshTokenLifetime: 60 * 60 * 24 * 14, allowExtendedTokenAttributes: false, requireClientAuthentication: {} }, this.options, options);
        return new handlers_1.TokenHandler(opts).handle(request, response);
    }
    /**
     * Revoke a token.
     */
    async revoke(request, response, options) {
        const opt = Object.assign({}, this.options, options);
        return new handlers_1.RevokeHandler(opt).handle(request, response);
    }
}
exports.OAuth2Server = OAuth2Server;
//# sourceMappingURL=server.js.map