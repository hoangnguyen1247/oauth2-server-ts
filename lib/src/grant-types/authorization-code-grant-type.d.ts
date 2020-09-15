import { AbstractGrantType } from '.';
import { AuthorizationCode, Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class AuthorizationCodeGrantType extends AbstractGrantType {
    constructor(options?: any);
    /**
     * Handle authorization code grant.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
     */
    handle(request: Request, client: Client): Promise<Token>;
    /**
     * Get the authorization code.
     */
    getAuthorizationCode(request: Request, client: Client): Promise<AuthorizationCode>;
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
    validateRedirectUri(request: Request, code: AuthorizationCode): void;
    /**
     * Revoke the authorization code.
     *
     * "The authorization code MUST expire shortly after it is issued to mitigate
     * the risk of leaks. [...] If an authorization code is used more than once,
     * the authorization server MUST deny the request."
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.1.2
     */
    revokeAuthorizationCode(code: AuthorizationCode): Promise<AuthorizationCode>;
    /**
     * Save token.
     */
    saveToken(user: User, client: Client, authorizationCode: string, scope: string): Promise<Token>;
}
