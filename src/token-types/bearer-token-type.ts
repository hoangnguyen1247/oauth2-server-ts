import { InvalidArgumentError } from '../errors';
import { hasOwnProperty } from '../utils/fn';

export class BearerTokenType {
    accessToken: string;
    accessTokenLifetime: number;
    refreshToken: string;
    scope: string;
    user: any;
    customAttributes: any;
    constructor(
        accessToken: string,
        accessTokenLifetime: number,
        refreshToken: string,
        scope: string,
        user: any,
        customAttributes: any,
    ) {
        if (!accessToken) {
            throw new InvalidArgumentError('Missing parameter: `accessToken`');
        }

        this.accessToken = accessToken;
        this.accessTokenLifetime = accessTokenLifetime;
        this.refreshToken = refreshToken;
        this.scope = scope;
        this.user = user;

        if (customAttributes) {
            this.customAttributes = customAttributes;
        }
    }

    /**
     * Retrieve the value representation.
     */

    valueOf() {
        const object: any = {
            accessToken: this.accessToken,
            tokenType: 'Bearer',
        };

        if (this.accessTokenLifetime) {
            object.expiresIn = this.accessTokenLifetime;
        }

        if (this.refreshToken) {
            object.refreshToken = this.refreshToken;
        }

        if (this.scope) {
            object.scope = this.scope;
        }

        if (this.user) {
            object.user = this.user;
        }

        for (const key in this.customAttributes) {
            if (hasOwnProperty(this.customAttributes, key)) {
                object[key] = this.customAttributes[key];
            }
        }

        return object;
    }
}
