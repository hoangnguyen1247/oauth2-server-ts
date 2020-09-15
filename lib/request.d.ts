export declare class Request {
    body: any;
    headers: any;
    method: any;
    query: any;
    constructor(options?: any);
    /**
     * Get a request header.
     */
    get(field: string): any;
    /**
     * Check if the content-type matches any of the given mime type.
     */
    is(args: string[]): string | false;
    is(...args: string[]): string | false;
}
