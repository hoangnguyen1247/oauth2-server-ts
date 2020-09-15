"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fn_1 = require("./utils/fn");
class Response {
    constructor(options = {}) {
        this.body = options.body || {};
        this.headers = {};
        this.status = 200;
        // Store the headers in lower case.
        for (const field in options.headers) {
            if (fn_1.hasOwnProperty(options.headers, field)) {
                this.headers[field.toLowerCase()] = options.headers[field];
            }
        }
        // Store additional properties of the response object passed in
        for (const property in options) {
            if (fn_1.hasOwnProperty(options, property) && !this[property]) {
                this[property] = options[property];
            }
        }
    }
    /**
     * Get a response header.
     */
    get(field) {
        return this.headers[field.toLowerCase()];
    }
    /**
     * Redirect response.
     */
    redirect(url) {
        this.set('Location', url);
        this.status = 302;
    }
    /**
     * Set a response header.
     */
    set(field, value) {
        this.headers[field.toLowerCase()] = value;
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map