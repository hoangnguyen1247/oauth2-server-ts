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
const errors_1 = require("../../../src/errors");
const handlers_1 = require("../../../src/handlers");
const request_1 = require("../../../src/request");
/**
 * Test `AuthenticateHandler`.
 */
describe('AuthenticateHandler', () => {
    describe('getTokenFromRequest()', () => {
        describe('with bearer token in the request authorization header', () => {
            it('should call `getTokenFromRequestHeader()`', () => {
                const handler = new handlers_1.AuthenticateHandler({
                    model: { getAccessToken() { } },
                });
                const request = new request_1.Request({
                    body: {},
                    headers: { Authorization: 'Bearer foo' },
                    method: {},
                    query: {},
                });
                sinon.stub(handler, 'getTokenFromRequestHeader');
                handler.getTokenFromRequest(request);
                handler.getTokenFromRequestHeader.callCount.should.equal(1);
                handler.getTokenFromRequestHeader.firstCall.args[0].should.equal(request);
                handler.getTokenFromRequestHeader.restore();
            });
        });
        describe('with bearer token in the request query', () => {
            it('should call `getTokenFromRequestQuery()`', () => {
                const handler = new handlers_1.AuthenticateHandler({
                    model: { getAccessToken() { } },
                });
                const request = new request_1.Request({
                    body: {},
                    headers: {},
                    method: {},
                    query: { accessToken: 'foo' },
                });
                sinon.stub(handler, 'getTokenFromRequestQuery');
                handler.getTokenFromRequest(request);
                handler.getTokenFromRequestQuery.callCount.should.equal(1);
                handler.getTokenFromRequestQuery.firstCall.args[0].should.equal(request);
                handler.getTokenFromRequestQuery.restore();
            });
        });
        describe('with bearer token in the request body', () => {
            it('should call `getTokenFromRequestBody()`', () => {
                const handler = new handlers_1.AuthenticateHandler({
                    model: { getAccessToken() { } },
                });
                const request = new request_1.Request({
                    body: { accessToken: 'foo' },
                    headers: {},
                    method: {},
                    query: {},
                });
                sinon.stub(handler, 'getTokenFromRequestBody');
                handler.getTokenFromRequest(request);
                handler.getTokenFromRequestBody.callCount.should.equal(1);
                handler.getTokenFromRequestBody.firstCall.args[0].should.equal(request);
                handler.getTokenFromRequestBody.restore();
            });
        });
    });
    describe('getAccessToken()', () => {
        it('should call `model.getAccessToken()`', () => {
            const model = {
                getAccessToken: sinon.stub().returns({ user: {} }),
            };
            const handler = new handlers_1.AuthenticateHandler({ model });
            return handler
                .getAccessToken('foo')
                .then(() => {
                model.getAccessToken.callCount.should.equal(1);
                model.getAccessToken.firstCall.args.should.have.length(1);
                model.getAccessToken.firstCall.args[0].should.equal('foo');
                model.getAccessToken.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('validateAccessToken()', () => {
        it('should fail if token has no valid `accessTokenExpiresAt` date', async () => {
            const model = {
                getAccessToken() { },
            };
            const handler = new handlers_1.AuthenticateHandler({ model });
            let failed = false;
            try {
                handler.validateAccessToken({
                    user: {},
                });
            }
            catch (err) {
                err.should.be.an.instanceOf(errors_1.ServerError);
                failed = true;
            }
            failed.should.equal(true);
        });
        it('should succeed if token has valid `accessTokenExpiresAt` date', () => {
            const model = {
                getAccessToken() { },
            };
            const handler = new handlers_1.AuthenticateHandler({ model });
            try {
                handler.validateAccessToken({
                    user: {},
                    accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                });
            }
            catch (err) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('verifyScope()', () => {
        it('should call `model.getAccessToken()` if scope is defined', () => {
            const model = {
                getAccessToken() { },
                verifyScope: sinon.stub().returns(true),
            };
            const handler = new handlers_1.AuthenticateHandler({
                addAcceptedScopesHeader: true,
                addAuthorizedScopesHeader: true,
                model,
                scope: 'bar',
            });
            return handler
                .verifyScope('foo')
                .then(() => {
                model.verifyScope.callCount.should.equal(1);
                model.verifyScope.firstCall.args.should.have.length(2);
                model.verifyScope.firstCall.args[0].should.equal('foo', 'bar');
                model.verifyScope.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=authenticate-handler.spec.js.map