import { AuthorizationCode, Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class CodeResponseType {
    code: any;
    authorizationCodeLifetime: number;
    model: Model;
    constructor(options?: any);
    /**
     * Handle code response type.
     */
    handle(request: Request, client: Client, user: User, uri: string, scope: string): Promise<AuthorizationCode>;
    /**
     * Get authorization code expiration date.
     */
    getAuthorizationCodeExpiresAt(client: Client): Date;
    /**
     * Get authorization code lifetime.
     */
    getAuthorizationCodeLifetime(client: Client): any;
    /**
     * Save authorization code.
     */
    saveAuthorizationCode(authorizationCode: string, expiresAt: Date, scope: string, client: Client, redirectUri: any, user: User): Promise<AuthorizationCode>;
    /**
     * Generate authorization code.
     */
    generateAuthorizationCode(client: Client, user: User, scope: string): Promise<string>;
    /**
     * Build redirect uri.
     */
    buildRedirectUri(redirectUri: any): any;
    /**
     * Set redirect uri parameter.
     */
    setRedirectUriParam(redirectUri: any, key: string, value: string): any;
}
