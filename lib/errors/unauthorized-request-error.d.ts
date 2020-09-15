import { OAuthError } from './oauth-error';
/**
 * Constructor.
 *
 * "If the request lacks any authentication information (e.g., the client
 * was unaware that authentication is necessary or attempted using an
 * unsupported authentication method), the resource server SHOULD NOT
 * include an error code or other error information."
 *
 * @see https://tools.ietf.org/html/rfc6750#section-3.1
 */
export declare class UnauthorizedRequestError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
