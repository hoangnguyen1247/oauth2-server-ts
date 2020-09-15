import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class AbstractGrantType {
    accessTokenLifetime: number;
    model: Model;
    refreshTokenLifetime: number;
    alwaysIssueNewRefreshToken: boolean;
    constructor(options?: any);
    /**
     * Generate access token.
     */
    generateAccessToken(client?: Client, user?: User, scope?: string): Promise<string>;
    /**
     * Generate refresh token.
     */
    generateRefreshToken(client?: Client, user?: User, scope?: string): Promise<string>;
    /**
     * Get access token expiration date.
     */
    getAccessTokenExpiresAt(): Date;
    /**
     * Get refresh token expiration date.
     */
    getRefreshTokenExpiresAt(): Date;
    /**
     * Get scope from the request body.
     */
    getScope(request: Request): any;
    /**
     * Validate requested scope.
     */
    validateScope(user: User, client: Client, scope: string): Promise<string>;
}
