import { OAuthError } from './oauth-error';
/**
 * Constructor.
 *
 * "The authenticated client is not authorized to use this authorization grant type."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
export declare class UnauthorizedClientError extends OAuthError {
    constructor(message?: string | Error, properties?: {
        code?: number;
        message?: string;
    });
}
