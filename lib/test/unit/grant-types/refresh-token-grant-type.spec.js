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
const sinon = __importStar(require("sinon"));
const grant_types_1 = require("../../../src/grant-types");
const request_1 = require("../../../src/request");
/**
 * Test `RefreshTokenGrantType`.
 */
describe('RefreshTokenGrantType', () => {
    describe('handle()', () => {
        it('should revoke the previous token', () => {
            const token = { accessToken: 'foo', client: {}, user: {} };
            const model = {
                getRefreshToken() {
                    return token;
                },
                saveToken() {
                    return { accessToken: 'bar', client: {}, user: {} };
                },
                revokeToken: sinon.stub().returns({
                    accessToken: 'foo',
                    client: {},
                    refreshTokenExpiresAt: new Date(new Date().getTime() / 2),
                    user: {},
                }),
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { refreshToken: 'bar' },
                headers: {},
                method: {},
                query: {},
            });
            const client = {};
            return handler
                .handle(request, client)
                .then(() => {
                model.revokeToken.callCount.should.equal(1);
                model.revokeToken.firstCall.args.should.have.length(1);
                model.revokeToken.firstCall.args[0].should.equal(token);
                model.revokeToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('getRefreshToken()', () => {
        it('should call `model.getRefreshToken()`', () => {
            const model = {
                getRefreshToken: sinon
                    .stub()
                    .returns({ accessToken: 'foo', client: {}, user: {} }),
                saveToken() { },
                revokeToken() { },
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { refreshToken: 'bar' },
                headers: {},
                method: {},
                query: {},
            });
            const client = {};
            return handler
                .getRefreshToken(request, client)
                .then(() => {
                model.getRefreshToken.callCount.should.equal(1);
                model.getRefreshToken.firstCall.args.should.have.length(1);
                model.getRefreshToken.firstCall.args[0].should.equal('bar');
                model.getRefreshToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('revokeToken()', () => {
        it('should call `model.revokeToken()`', () => {
            const model = {
                getRefreshToken() { },
                revokeToken: sinon.stub().returns({
                    accessToken: 'foo',
                    client: {},
                    refreshTokenExpiresAt: new Date(new Date().getTime() / 2),
                    user: {},
                }),
                saveToken() { },
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const token = {};
            return handler
                .revokeToken(token)
                .then(() => {
                model.revokeToken.callCount.should.equal(1);
                model.revokeToken.firstCall.args.should.have.length(1);
                model.revokeToken.firstCall.args[0].should.equal(token);
                model.revokeToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should not call `model.revokeToken()`', () => {
            const model = {
                getRefreshToken() { },
                revokeToken: sinon.stub().returns({
                    accessToken: 'foo',
                    client: {},
                    refreshTokenExpiresAt: new Date(new Date().getTime() / 2),
                    user: {},
                }),
                saveToken() { },
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
                alwaysIssueNewRefreshToken: false,
            });
            const token = {};
            return handler
                .revokeToken(token)
                .then(() => {
                model.revokeToken.callCount.should.equal(0);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should not call `model.revokeToken()`', () => {
            const model = {
                getRefreshToken() { },
                revokeToken: sinon.stub().returns({
                    accessToken: 'foo',
                    client: {},
                    refreshTokenExpiresAt: new Date(new Date().getTime() / 2),
                    user: {},
                }),
                saveToken() { },
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
                alwaysIssueNewRefreshToken: true,
            });
            const token = {};
            return handler
                .revokeToken(token)
                .then(() => {
                model.revokeToken.callCount.should.equal(1);
                model.revokeToken.firstCall.args.should.have.length(1);
                model.revokeToken.firstCall.args[0].should.equal(token);
                model.revokeToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('saveToken()', () => {
        it('should call `model.saveToken()`', () => {
            const client = {};
            const user = {};
            const model = {
                getRefreshToken() { },
                revokeToken() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
            });
            sinon.stub(handler, 'generateAccessToken').returns('foo');
            sinon.stub(handler, 'generateRefreshToken').returns('bar');
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz');
            return handler
                .saveToken(user, client, 'foobar')
                .then(() => {
                model.saveToken.callCount.should.equal(1);
                model.saveToken.firstCall.args.should.have.length(3);
                model.saveToken.firstCall.args[0].should.eql({
                    accessToken: 'foo',
                    accessTokenExpiresAt: 'biz',
                    refreshToken: 'bar',
                    refreshTokenExpiresAt: 'baz',
                    scope: 'foobar',
                });
                model.saveToken.firstCall.args[1].should.equal(client);
                model.saveToken.firstCall.args[2].should.equal(user);
                model.saveToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should call `model.saveToken()` without refresh token', () => {
            const client = {};
            const user = {};
            const model = {
                getRefreshToken() { },
                revokeToken() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
                alwaysIssueNewRefreshToken: false,
            });
            sinon.stub(handler, 'generateAccessToken').returns('foo');
            sinon.stub(handler, 'generateRefreshToken').returns('bar');
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz');
            return handler
                .saveToken(user, client, 'foobar')
                .then(() => {
                model.saveToken.callCount.should.equal(1);
                model.saveToken.firstCall.args.should.have.length(3);
                model.saveToken.firstCall.args[0].should.eql({
                    accessToken: 'foo',
                    accessTokenExpiresAt: 'biz',
                    scope: 'foobar',
                });
                model.saveToken.firstCall.args[1].should.equal(client);
                model.saveToken.firstCall.args[2].should.equal(user);
                model.saveToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should call `model.saveToken()` with refresh token', () => {
            const client = {};
            const user = {};
            const model = {
                getRefreshToken() { },
                revokeToken() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.RefreshTokenGrantType({
                accessTokenLifetime: 120,
                model,
                alwaysIssueNewRefreshToken: true,
            });
            sinon.stub(handler, 'generateAccessToken').returns('foo');
            sinon.stub(handler, 'generateRefreshToken').returns('bar');
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz');
            return handler
                .saveToken(user, client, 'foobar')
                .then(() => {
                model.saveToken.callCount.should.equal(1);
                model.saveToken.firstCall.args.should.have.length(3);
                model.saveToken.firstCall.args[0].should.eql({
                    accessToken: 'foo',
                    accessTokenExpiresAt: 'biz',
                    refreshToken: 'bar',
                    refreshTokenExpiresAt: 'baz',
                    scope: 'foobar',
                });
                model.saveToken.firstCall.args[1].should.equal(client);
                model.saveToken.firstCall.args[2].should.equal(user);
                model.saveToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=refresh-token-grant-type.spec.js.map