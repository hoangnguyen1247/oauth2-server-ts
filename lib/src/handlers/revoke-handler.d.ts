import { OAuthError } from '../errors';
import { Client, Model } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
export declare class RevokeHandler {
    model: Model;
    constructor(options?: any);
    /**
     * Revoke Handler.
     */
    handle(request: Request, response: Response): Promise<true>;
    /**
     * Revoke a refresh or access token.
     *
     * Handle the revoking of refresh tokens, and access tokens if supported / desirable
     * RFC7009 specifies that "If the server is unable to locate the token using
     * the given hint, it MUST extend its search across all of its supported token types"
     */
    handleRevokeToken(request: Request, client: Client): Promise<true>;
    /**
     * Get the client from the model.
     */
    getClient(request: Request, response: Response): Promise<Client>;
    /**
     * Get client credentials.
     *
     * The client credentials may be sent using the HTTP Basic authentication scheme or, alternatively,
     * the `clientId` and `clientSecret` can be embedded in the body.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-2.3.1
     */
    getClientCredentials(request: Request): {
        clientId: any;
        clientSecret: any;
    };
    /**
     * Get the token from the body.
     *
     * @see https://tools.ietf.org/html/rfc7009#section-2.1
     */
    getTokenFromRequest(request: Request): any;
    /**
     * Get refresh token.
     */
    getRefreshToken(token: any, client: Client): Promise<import("../interfaces").RefreshToken>;
    /**
     * Get the access token from the model.
     */
    getAccessToken(token: string, client: Client): Promise<import("../interfaces").Token>;
    /**
     * Revoke the token.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    revokeToken(token: any): Promise<true>;
    /**
     * Update response when an error is thrown.
     */
    updateErrorResponse(response: Response, error: OAuthError): void;
}
