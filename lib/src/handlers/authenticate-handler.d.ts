import { Model, Token } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
export declare class AuthenticateHandler {
    addAcceptedScopesHeader: any;
    addAuthorizedScopesHeader: any;
    allowBearerTokensInQueryString: any;
    model: Model;
    scope: any;
    constructor(options?: any);
    /**
     * Authenticate Handler.
     */
    handle(request: Request, response: Response): Promise<any>;
    /**
     * Get the token from the header or body, depending on the request.
     *
     * "Clients MUST NOT use more than one method to transmit the token in each request."
     *
     * @see https://tools.ietf.org/html/rfc6750#section-2
     */
    getTokenFromRequest(request: Request): any;
    /**
     * Get the token from the request header.
     *
     * @see http://tools.ietf.org/html/rfc6750#section-2.1
     */
    getTokenFromRequestHeader(request: Request): any;
    /**
     * Get the token from the request query.
     *
     * "Don't pass bearer tokens in page URLs:  Bearer tokens SHOULD NOT be passed in page
     * URLs (for example, as query string parameters). Instead, bearer tokens SHOULD be
     * passed in HTTP message headers or message bodies for which confidentiality measures
     * are taken. Browsers, web servers, and other software may not adequately secure URLs
     * in the browser history, web server logs, and other data structures. If bearer tokens
     * are passed in page URLs, attackers might be able to steal them from the history data,
     * logs, or other unsecured locations."
     *
     * @see http://tools.ietf.org/html/rfc6750#section-2.3
     */
    getTokenFromRequestQuery(request: Request): any;
    /**
     * Get the token from the request body.
     *
     * "The HTTP request method is one for which the request-body has defined semantics.
     * In particular, this means that the "GET" method MUST NOT be used."
     *
     * @see http://tools.ietf.org/html/rfc6750#section-2.2
     */
    getTokenFromRequestBody(request: Request): any;
    /**
     * Get the access token from the model.
     */
    getAccessToken(token: string): Promise<Token>;
    /**
     * Validate access token.
     */
    validateAccessToken(accessToken: Token): Token;
    /**
     * Verify scope.
     */
    verifyScope(accessToken: Token): Promise<true>;
    /**
     * Update response.
     */
    updateResponse(response: Response, accessToken: Token): void;
}
