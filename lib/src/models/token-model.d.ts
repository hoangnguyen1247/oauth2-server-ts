import { Client, Token, User } from '../interfaces';
export declare class TokenModel implements Token {
    accessToken: string;
    accessTokenExpiresAt?: Date;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    client: Client;
    user: User;
    customAttributes: {};
    accessTokenLifetime: number;
    constructor(data?: any, options?: any);
}
