import { AbstractGrantType } from '.';
import { Client, RefreshToken, User } from '../interfaces';
import { Request } from '../request';
export declare class RefreshTokenGrantType extends AbstractGrantType {
    constructor(options?: any);
    /**
     * Handle refresh token grant.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    handle(request: Request, client: Client): Promise<import("../interfaces").Token>;
    /**
     * Get refresh token.
     */
    getRefreshToken(request: Request, client: Client): Promise<RefreshToken>;
    /**
     * Revoke the refresh token.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-6
     */
    revokeToken(token: RefreshToken): Promise<RefreshToken>;
    /**
     * Save token.
     */
    saveToken(user: User, client: Client, scope: string): Promise<import("../interfaces").Token>;
}
