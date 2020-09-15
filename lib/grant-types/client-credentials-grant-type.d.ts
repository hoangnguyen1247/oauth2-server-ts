import { AbstractGrantType } from '.';
import { Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class ClientCredentialsGrantType extends AbstractGrantType {
    constructor(options?: any);
    /**
     * Handle client credentials grant.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.4.2
     */
    handle(request: Request, client: Client): Promise<Token>;
    /**
     * Retrieve the user using client credentials.
     */
    getUserFromClient(client: Client): Promise<User>;
    /**
     * Save token.
     */
    saveToken(user: User, client: Client, scope: string): Promise<Token>;
}
