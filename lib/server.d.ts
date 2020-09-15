import { Request } from './request';
import { Response } from './response';
export declare class OAuth2Server {
    options: any;
    constructor(options?: any);
    /**
     * Authenticate a token.
     */
    authenticate(request: Request, response?: Response, scope?: string): Promise<any>;
    authenticate(request: Request, response?: Response, options?: any): Promise<any>;
    /**
     * Authorize a request.
     */
    authorize(request: Request, response: Response, options?: any): Promise<any>;
    /**
     * Create a token.
     */
    token(request: Request, response: Response, options?: any): Promise<any>;
    /**
     * Revoke a token.
     */
    revoke(request: Request, response: Response, options: any): Promise<true>;
}
