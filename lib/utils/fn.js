"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity = (v) => v;
const reverser = (promise) => promise.then(v => Promise.reject(v), identity);
exports.oneSuccess = (promises) => Promise.all(promises.map(reverser)).then(e => Promise.reject(AggregateError.from(e)), identity);
exports.hasOwnProperty = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
class AggregateError extends Array {
    constructor() {
        super(...arguments);
        this.name = 'AggregateError';
    }
    get message() {
        return this.map(e => e.message).join('\n');
    }
}
exports.AggregateError = AggregateError;
//# sourceMappingURL=fn.js.map