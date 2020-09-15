import { OAuthError } from './oauth-error';
/**
 * Constructor.
 *
 * "Client authentication failed (e.g., unknown client, no client
 * authentication included, or unsupported authentication method)"
 *
 * @see https://tools.ietf.org/html/rfc6749#section-5.2
 */
export declare class InvalidClientError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
