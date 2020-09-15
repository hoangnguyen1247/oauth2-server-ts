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
const handlers_1 = require("../../../src/handlers");
const request_1 = require("../../../src/request");
/**
 * Test `TokenHandler`.
 */
describe('TokenHandler', () => {
    describe('getClient()', () => {
        it('should call `model.getClient()`', () => {
            const model = {
                getClient: sinon
                    .stub()
                    .returns(Promise.resolve({ grants: ['password'] })),
                saveToken() { },
            };
            const handler = new handlers_1.TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new request_1.Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });
            return handler
                .getClient(request, {})
                .then(() => {
                model.getClient.callCount.should.equal(1);
                model.getClient.firstCall.args.should.have.length(2);
                model.getClient.firstCall.args[0].should.equal(12345);
                model.getClient.firstCall.args[1].should.equal('secret');
                model.getClient.firstCall.thisValue.should.equal(model);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=token-handler.spec.js.map