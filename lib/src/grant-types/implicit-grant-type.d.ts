import { AbstractGrantType } from '.';
import { Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class ImplicitGrantType extends AbstractGrantType {
    scope: string;
    user: User;
    constructor(options?: any);
    /**
     * Handle implicit token grant.
     */
    handle(request: Request, client: Client): Promise<Token>;
    /**
     * Save token.
     */
    saveToken(user: User, client: Client, scope: string): Promise<Token>;
}
