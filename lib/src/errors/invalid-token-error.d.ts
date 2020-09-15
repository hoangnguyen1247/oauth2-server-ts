import { OAuthError } from './oauth-error';
/**
 * Constructor.invalid_token
 *
 * "The access token provided is expired, revoked, malformed, or invalid for other reasons."
 *
 * @see https://tools.ietf.org/html/rfc6750#section-3.1
 */
export declare class InvalidTokenError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
