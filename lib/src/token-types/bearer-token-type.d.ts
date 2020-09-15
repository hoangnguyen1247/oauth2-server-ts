export declare class BearerTokenType {
    accessToken: string;
    accessTokenLifetime: number;
    refreshToken: string;
    scope: string;
    user: any;
    customAttributes: any;
    constructor(accessToken: string, accessTokenLifetime: number, refreshToken: string, scope: string, user: any, customAttributes: any);
    /**
     * Retrieve the value representation.
     */
    valueOf(): any;
}
