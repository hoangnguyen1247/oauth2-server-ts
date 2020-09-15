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
 * Test `AbstractGrantType`.
 */
describe('AbstractGrantType', () => {
    describe('generateAccessToken()', () => {
        it('should call `model.generateAccessToken()`', async () => {
            const model = {
                generateAccessToken: sinon
                    .stub()
                    .returns({ client: {}, expiresAt: new Date(), user: {} }),
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 120,
                model,
            });
            try {
                await handler.generateAccessToken();
                model.generateAccessToken.callCount.should.equal(1);
                model.generateAccessToken.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
    describe('generateRefreshToken()', () => {
        it('should call `model.generateRefreshToken()`', async () => {
            const model = {
                generateRefreshToken: sinon.stub().returns({
                    client: {},
                    expiresAt: new Date(new Date().getTime() / 2),
                    user: {},
                }),
            };
            const handler = new grant_types_1.AbstractGrantType({
                accessTokenLifetime: 120,
                model,
            });
            try {
                await handler.generateRefreshToken();
                model.generateRefreshToken.callCount.should.equal(1);
                model.generateRefreshToken.firstCall.thisValue.should.equal(model);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=abstract-grant-type.spec.js.map