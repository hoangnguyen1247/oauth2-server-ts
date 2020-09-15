export declare class Response {
    body: any;
    headers: any;
    status: number;
    constructor(options?: any);
    /**
     * Get a response header.
     */
    get(field: string): any;
    /**
     * Redirect response.
     */
    redirect(url: string): void;
    /**
     * Set a response header.
     */
    set(field: string, value: string): void;
}
