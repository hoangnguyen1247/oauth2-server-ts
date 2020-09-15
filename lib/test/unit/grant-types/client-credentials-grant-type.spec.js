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
/**
 * Test `ClientCredentialsGrantType`.
 */
describe('ClientCredentialsGrantType', () => {
    describe('getUserFromClient()', () => {
        it('should call `model.getUserFromClient()`', async () => {
            const model = {
                getUserFromClient: sinon.stub().returns(true),
                saveToken() { },
            };
            const handler = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            const client = {};
            try {
                await handler.getUserFromClient(client);
                model.getUserFromClient.callCount.should.equal(1);
                model.getUserFromClient.firstCall.args.should.have.length(1);
                model.getUserFromClient.firstCall.args[0].should.equal(client);
                model.getUserFromClient.firstCall.thisValue.should.equal(model);
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
                getUserFromClient() { },
                saveToken: sinon.stub().returns(true),
            };
            const handler = new grant_types_1.ClientCredentialsGrantType({
                accessTokenLifetime: 120,
                model,
            });
            sinon.stub(handler, 'validateScope').returns('foobar');
            sinon.stub(handler, 'generateAccessToken').returns('foo');
            sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz');
            try {
                await handler.saveToken(user, client, 'foobar');
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
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=client-credentials-grant-type.spec.js.map