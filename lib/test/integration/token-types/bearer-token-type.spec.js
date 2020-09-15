"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const should = __importStar(require("should"));
const errors_1 = require("../../../src/errors");
const token_types_1 = require("../../../src/token-types");
/**
 * Test `BearerTokenType` integration.
 */
describe('BearerTokenType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `accessToken` is missing', () => {
            try {
                new token_types_1.BearerTokenType(undefined, undefined, undefined, undefined, undefined, undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessToken`');
            }
        });
        it('should set the `accessToken`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined, undefined);
            responseType.accessToken.should.equal('foo');
        });
        it('should set the `accessTokenLifetime`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined, undefined);
            responseType.accessTokenLifetime.should.equal('bar');
        });
        it('should set the `refreshToken`', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined, undefined);
            responseType.refreshToken.should.equal('biz');
        });
    });
    describe('valueOf()', () => {
        it('should return the value representation', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', undefined, undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                tokenType: 'Bearer',
            });
        });
        it('should not include the `expiresIn` if not given', () => {
            const responseType = new token_types_1.BearerTokenType('foo', undefined, undefined, undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                accessToken: 'foo',
                tokenType: 'Bearer',
            });
        });
        it('should set `refreshToken` if `refreshToken` is defined', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                refreshToken: 'biz',
                tokenType: 'Bearer',
            });
        });
        it('should set `expiresIn` if `accessTokenLifetime` is defined', () => {
            const responseType = new token_types_1.BearerTokenType('foo', 'bar', 'biz', undefined, undefined, undefined);
            const value = responseType.valueOf();
            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                refreshToken: 'biz',
                tokenType: 'Bearer',
            });
        });
    });
});
//# sourceMappingURL=bearer-token-type.spec.js.map