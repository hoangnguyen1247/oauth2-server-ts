import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class TokenResponseType {
    accessToken: string;
    accessTokenLifetime: number;
    model: Model;
    constructor(options?: any);
    /**
     * Handle token response type.
     */
    handle(request: Request, client: Client, user: User, uri: string, scope: string): Promise<import("../interfaces").Token>;
    /**
     * Get access token lifetime.
     */
    getAccessTokenLifetime(client: Client): number;
    /**
     * Build redirect uri.
     */
    buildRedirectUri(redirectUri: any): any;
    /**
     * Set redirect uri parameter.
     */
    setRedirectUriParam(redirectUri: any, key: string, value: any): any;
}
