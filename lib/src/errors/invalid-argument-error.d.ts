import { OAuthError } from './oauth-error';
export declare class InvalidArgumentError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
