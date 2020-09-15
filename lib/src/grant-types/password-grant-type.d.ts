import { AbstractGrantType } from '.';
import { Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class PasswordGrantType extends AbstractGrantType {
    constructor(options?: any);
    /**
     * Retrieve the user from the model using a username/password combination.
     *
     * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
     */
    handle(request: any, client: any): Promise<Token>;
    /**
     * Get user using a username/password combination.
     */
    getUser(request: Request): Promise<User>;
    /**
     * Save token.
     */
    saveToken(user: User, client: Client, scope: string): Promise<Token>;
}
