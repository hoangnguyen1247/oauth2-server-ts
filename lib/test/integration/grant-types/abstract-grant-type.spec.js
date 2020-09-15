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
const grant_types_1 = require("../../../src/grant-types");
const request_1 = require("../../../src/request");
/**
 * Test `AbstractGrantType` integration.
 */
describe('AbstractGrantType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `options.accessTokenLifetime` is missing', () => {
            try {
                new grant_types_1.AbstractGrantType();
                should.fail('no error was thrown', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessTokenLifetime`');
            }
        });
        it('should throw an error if `options.model` is missing', () => {
            try {
                new grant_types_1.AbstractGrantType({ accessTokenLifetime: 123 });
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should set the `accessTokenLifetime`', () => {
            const grantType = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
            });
            grantType.accessTokenLifetime.should.equal(123);
        });
        it('should set the `model`', () => {
            const model = {};
            const grantType = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model,
            });
            grantType.model.should.equal(model);
        });
        it('should set the `refreshTokenLifetime`', () => {
            const grantType = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            grantType.refreshTokenLifetime.should.equal(456);
        });
    });
    describe('generateAccessToken()', () => {
        it('should return an access token', async () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            try {
                const data = await handler.generateAccessToken();
                data.should.be.a.sha1();
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        it('should support promises', () => {
            const model = {
                generateAccessToken() {
                    return Promise.resolve({});
                },
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 456,
            });
            handler.generateAccessToken().should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const model = {
                generateAccessToken() {
                    return {};
                },
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 456,
            });
            handler.generateAccessToken().should.be.an.instanceOf(Promise);
        });
    });
    describe('generateRefreshToken()', () => {
        it('should return a refresh token', async () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            try {
                const data = await handler.generateRefreshToken();
                data.should.be.a.sha1();
            }
            catch (error) {
                should.fail('should.fail fail', error.message);
            }
        });
        it('should support promises', () => {
            const model = {
                generateRefreshToken() {
                    return Promise.resolve({});
                },
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 456,
            });
            handler.generateRefreshToken().should.be.an.instanceOf(Promise);
        });
        it('should support non-promises', () => {
            const model = {
                generateRefreshToken() {
                    return {};
                },
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 456,
            });
            handler.generateRefreshToken().should.be.an.instanceOf(Promise);
        });
    });
    describe('getAccessTokenExpiresAt()', () => {
        it('should return a date', () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            handler.getAccessTokenExpiresAt().should.be.an.instanceOf(Date);
        });
    });
    describe('getRefreshTokenExpiresAt()', () => {
        it('should return a refresh token', () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            handler.getRefreshTokenExpiresAt().should.be.an.instanceOf(Date);
        });
    });
    describe('getScope()', () => {
        it('should throw an error if `scope` is invalid', () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            const request = new request_1.Request({
                body: { scope: 'øå€£‰' },
                headers: {},
                method: {},
                query: {},
            });
            try {
                handler.getScope(request);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Invalid parameter: `scope`');
            }
        });
        it('should allow the `scope` to be `undefined`', () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            const request = new request_1.Request({
                body: {},
                headers: {},
                method: {},
                query: {},
            });
            should.not.exist(handler.getScope(request));
        });
        it('should return the scope', () => {
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 123,
                model: {},
                refreshTokenLifetime: 456,
            });
            const request = new request_1.Request({
                body: { scope: 'foo' },
                headers: {},
                method: {},
                query: {},
            });
            handler.getScope(request).should.equal('foo');
        });
    });
});
//# sourceMappingURL=abstract-grant-type.spec.js.map