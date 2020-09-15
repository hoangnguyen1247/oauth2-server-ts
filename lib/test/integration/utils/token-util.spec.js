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
const TokenUtil = __importStar(require("../../../src/utils/token-util"));
/**
 * Test `TokenUtil` integration.
 */
describe('TokenUtil integration', () => {
    describe('generateRandomToken()', () => {
        it('should return a sha-1 token', async () => {
            try {
                const token = await TokenUtil.GenerateRandomToken();
                token.should.be.a.sha1();
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
    });
});
//# sourceMappingURL=token-util.spec.js.map