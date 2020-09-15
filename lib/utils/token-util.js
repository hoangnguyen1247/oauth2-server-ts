"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const util_1 = require("util");
const randomBytesPromise = util_1.promisify(crypto_1.randomBytes);
/**
 * Generate random token.
 */
exports.GenerateRandomToken = async () => {
    const bytesSize = 256;
    const buffer = await randomBytesPromise(bytesSize);
    return crypto_1.createHash('sha1')
        .update(buffer)
        .digest('hex');
};
//# sourceMappingURL=token-util.js.map