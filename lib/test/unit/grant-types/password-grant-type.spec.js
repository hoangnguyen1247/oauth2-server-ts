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
 * Test `PasswordGrantType`.
 */
describe('PasswordGrantType', () => {
    describe('getUser()', () => {
        it('should call `model.getUser()`', async () => {
            const model = {
                getUser: sinon.stub().returns(true),
                saveToken() { },
            };
            const handler = new grant_types_1.PasswordGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const request = new request_1.Request({
                body: { username: 'foo', password: 'bar' },
                headers: {},
                method: {},
                query: {},
            });
            try {
                await handler.getUser(request);
                model.getUser.callCount.should.equal(1);
                model.getUser.firstCall.args.should.have.length(4);
                model.getUser.firstCall.args[0].should.equal('foo');
                model.getUser.firstCall.args[1].should.equal('bar');
                model.getUser.firstCall.thisValue.should.equal(model);
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
                getUser() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.PasswordGrantType({
                accessTokenLifetime: 120,
                model,
            });
            sinon.stub(handler, 'validateScope').returns('foobar');
            sinon.stub(handler, 'generateAccessToken').returns('foo');
            sinon.stub(handler, 'generateRefreshToken').returns('bar');
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz');
            try {
                await handler.saveToken(user, client, 'foobar');
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
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=password-grant-type.spec.js.map