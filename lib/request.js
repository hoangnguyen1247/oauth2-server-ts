"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_is_1 = __importDefault(require("type-is"));
const errors_1 = require("./errors");
const fn_1 = require("./utils/fn");
class Request {
    constructor(options = {}) {
        if (!options.headers) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `headers`');
        }
        if (!options.method) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `method`');
        }
        if (!options.query) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `query`');
        }
        this.body = options.body || {};
        this.headers = {};
        this.method = options.method;
        this.query = options.query;
        // Store the headers in lower case.
        for (const field in options.headers) {
            if (fn_1.hasOwnProperty(options.headers, field)) {
                this.headers[field.toLowerCase()] = options.headers[field];
            }
        }
        // Store additional properties of the request object passed in
        for (const property in options) {
            if (fn_1.hasOwnProperty(options, property) && !this[property]) {
                this[property] = options[property];
            }
        }
    }
    /**
     * Get a request header.
     */
    get(field) {
        return this.headers[field.toLowerCase()];
    }
    is(...args) {
        let types = args;
        if (Array.isArray(types[0])) {
            types = types[0];
        }
        return type_is_1.default(this, types) || false;
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map