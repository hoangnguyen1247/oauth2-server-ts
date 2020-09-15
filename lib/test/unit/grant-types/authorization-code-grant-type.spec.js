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
 * Test `AuthorizationCodeGrantType`.
 */
describe('AuthorizationCodeGrantType', () => {
    describe('getAuthorizationCode()', () => {
        it('should call `model.getAuthorizationCode()`', async () => {
            const model = {
                getAuthorizationCode: sinon.stub().returns({
                    authorizationCode: 12345,
                    client: {},
                    expiresAt: new Date(new Date().getTime() * 2),
                    user: {},
                }),
                revokeAuthorizationCode() { },
                saveToken() { },
            };
            const handler = new grant_types_1.AuthorizationCodeGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { code: 12345 },
                headers: {},
                method: {},
                query: {},
            });
            const client = {};
            try {
                await handler.getAuthorizationCode(request, client);
                model.getAuthorizationCode.callCount.should.equal(1);
                model.getAuthorizationCode.firstCall.args.should.have.length(1);
                model.getAuthorizationCode.firstCall.args[0].should.equal(12345);
                model.getAuthorizationCode.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('revokeAuthorizationCode()', () => {
        it('should call `model.revokeAuthorizationCode()`', async () => {
            const model = {
                getAuthorizationCode() { },
                revokeAuthorizationCode: sinon.stub().returns(true),
                saveToken() { },
            };
            const handler = new grant_types_1.AuthorizationCodeGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const authorizationCode = {};
            try {
                await handler.revokeAuthorizationCode(authorizationCode);
                model.revokeAuthorizationCode.callCount.should.equal(1);
                model.revokeAuthorizationCode.firstCall.args.should.have.length(1);
                model.revokeAuthorizationCode.firstCall.args[0].should.equal(authorizationCode);
                model.revokeAuthorizationCode.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('saveToken()', () => {
        it('should call `model.saveToken()`', async () => {
            const client = {};
            const user = {};
            const model = {
                getAuthorizationCode() { },
                revokeAuthorizationCode() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.AuthorizationCodeGrantType({
                accessTokenLifetime: 120,
                model,
            });
            sinon.stub(handler, 'validateScope').returns('foobiz');
            sinon
                .stub(handler, 'generateAccessToken')
                .returns(Promise.resolve('foo'));
            sinon
                .stub(handler, 'generateRefreshToken')
                .returns(Promise.resolve('bar'));
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz');
            try {
                await handler.saveToken(user, client, 'foobar', 'foobiz');
                model.saveToken.callCount.should.equal(1);
                model.saveToken.firstCall.args.should.have.length(3);
                model.saveToken.firstCall.args[0].should.eql({
                    accessToken: 'foo',
                    authorizationCode: 'foobar',
                    accessTokenExpiresAt: 'biz',
                    refreshToken: 'bar',
                    refreshTokenExpiresAt: 'baz',
                    scope: 'foobiz',
                });
                model.saveToken.firstCall.args[1].should.equal(client);
                model.saveToken.firstCall.args[2].should.equal(user);
                model.saveToken.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=authorization-code-grant-type.spec.js.map