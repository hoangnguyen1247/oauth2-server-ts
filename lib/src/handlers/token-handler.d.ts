import { OAuthError } from '../errors';
import { Client, Model } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
import { BearerTokenType } from '../token-types';
export declare class TokenHandler {
    accessTokenLifetime: any;
    grantTypes: {
        [key: string]: any;
    };
    model: Model;
    refreshTokenLifetime: number;
    allowExtendedTokenAttributes: boolean;
    requireClientAuthentication: any;
    alwaysIssueNewRefreshToken: boolean;
    constructor(options?: any);
    /**
     * Token Handler.
     */
    handle(request: Request, response: Response): Promise<any>;
    /**
     * Get the client from the model.
     */
    getClient(request: any, response: any): Promise<Client>;
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
    } | {
        clientId: any;
        clientSecret?: undefined;
    };
    /**
     * Handle grant type.
     */
    handleGrantType(request: Request, client: Client): Promise<any>;
    /**
     * Get access token lifetime.
     */
    getAccessTokenLifetime(client: Client): any;
    /**
     * Get refresh token lifetime.
     */
    getRefreshTokenLifetime(client: Client): number;
    /**
     * Get token type.
     */
    getTokenType(model: any): BearerTokenType;
    /**
     * Update response when a token is generated.
     */
    updateSuccessResponse(response: Response, tokenType: BearerTokenType): void;
    /**
     * Update response when an error is thrown.
     */
    updateErrorResponse(response: Response, error: OAuthError): void;
    /**
     * Given a grant type, check if client authentication is required
     */
    isClientAuthenticationRequired(grantType: string): any;
}
