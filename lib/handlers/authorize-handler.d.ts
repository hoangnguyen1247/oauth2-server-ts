/// <reference types="node" />
import * as url from 'url';
import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
import { CodeResponseType, TokenResponseType } from '../response-types';
/**
 * Constructor.
 */
export declare class AuthorizeHandler {
    options: any;
    allowEmptyState: boolean;
    authenticateHandler: any;
    model: Model;
    constructor(options?: any);
    /**
     * Authorize Handler.
     */
    handle(request: Request, response: Response): Promise<any>;
    /**
     * Get the client from the model.
     */
    getClient(request: Request): Promise<Client>;
    /**
     * Validate requested scope.
     */
    validateScope(user: User, client: Client, scope: string): Promise<string>;
    /**
     * Get scope from the request.
     */
    getScope(request: Request): any;
    /**
     * Get state from the request.
     */
    getState(request: Request): any;
    /**
     * Get user by calling the authenticate middleware.
     */
    getUser(request: Request, response: Response): Promise<any>;
    /**
     * Get redirect URI.
     */
    getRedirectUri(request: Request, client: Client): any;
    /**
     * Get response type.
     */
    getResponseType(request: Request, client: Client): any;
    /**
     * Build a successful response that redirects the user-agent to the client-provided url.
     */
    buildSuccessRedirectUri(redirectUri: string, responseType: CodeResponseType | TokenResponseType): any;
    /**
     * Build an error response that redirects the user-agent to the client-provided url.
     */
    buildErrorRedirectUri(redirectUri: any, responseType: CodeResponseType | TokenResponseType, error: Error): url.UrlWithParsedQuery;
    /**
     * Update response with the redirect uri and the state parameter, if available.
     */
    updateResponse(response: Response, redirectUri: any, responseType: CodeResponseType | TokenResponseType, state: any): void;
}
