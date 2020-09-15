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
const url = __importStar(require("url"));
const errors_1 = require("../../../src/errors");
const response_types_1 = require("../../../src/response-types");
/**
 * Test `CodeResponseType` integration.
 */
describe('CodeResponseType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `options.authorizationCodeLifetime` is missing', () => {
            try {
                new response_types_1.CodeResponseType();
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `authorizationCodeLifetime`');
            }
        });
        it('should set the `code`', () => {
            const model = {
                saveAuthorizationCode: () => { },
            };
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            responseType.authorizationCodeLifetime.should.equal(120);
        });
    });
    it('should throw an error if the model does not implement `saveAuthorizationCode()`', () => {
        try {
            new response_types_1.CodeResponseType({ authorizationCodeLifetime: 120, model: {} });
            should.fail('should.fail', '');
        }
        catch (e) {
            e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
            e.message.should.equal('Invalid argument: model does not implement `saveAuthorizationCode()`');
        }
    });
    it('should set the `authorizationCodeLifetime`', () => {
        const model = {
            saveAuthorizationCode: () => { },
        };
        const handler = new response_types_1.CodeResponseType({
            authorizationCodeLifetime: 120,
            model,
        });
        handler.authorizationCodeLifetime.should.equal(120);
    });
    describe('buildRedirectUri()', () => {
        it('should throw an error if the `redirectUri` is missing', () => {
            const model = {
                saveAuthorizationCode: () => { },
            };
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            try {
                responseType.buildRedirectUri(undefined);
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `redirectUri`');
            }
        });
        it('should return the new redirect uri and set the `code` and `state` in the query', () => {
            const model = {
                saveAuthorizationCode: () => { },
            };
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            responseType.code = 'foo';
            const redirectUri = responseType.buildRedirectUri(url.parse('http://example.com/cb'));
            url.format(redirectUri).should.equal('http://example.com/cb?code=foo');
        });
        it('should return the new redirect uri and append the `code` and `state` in the query', () => {
            const model = {
                saveAuthorizationCode: () => { },
            };
            const responseType = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            responseType.code = 'foo';
            const redirectUri = responseType.buildRedirectUri(url.parse('http://example.com/cb?foo=bar', true));
            url
                .format(redirectUri)
                .should.equal('http://example.com/cb?foo=bar&code=foo');
        });
    });
    it('should set the `model`', () => {
        const model = {
            saveAuthorizationCode: () => { },
        };
        const handler = new response_types_1.CodeResponseType({
            authorizationCodeLifetime: 120,
            model,
        });
        handler.model.should.equal(model);
    });
    describe('generateAuthorizationCode()', () => {
        it('should return an auth code', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            return handler
                .generateAuthorizationCode(undefined, undefined, undefined)
                .then((data) => {
                data.should.be.a.sha1();
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should support promises', () => {
            const model = {
                generateAuthorizationCode: () => {
                    return Promise.resolve({});
                },
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            handler
                .generateAuthorizationCode(undefined, undefined, undefined)
                .should.be.an.instanceOf(Promise);
        });
        // it('should support non-promises', () => {
        //   const model = {
        //     generateAuthorizationCode: () => {
        //       return {};
        //     },
        //     getAccessToken: () => {},
        //     getClient: () => {},
        //     saveAuthorizationCode: () => {},
        //   };
        //   const handler = new CodeResponseType({
        //     authorizationCodeLifetime: 120,
        //     model,
        //   });
        //   handler
        //     .generateAuthorizationCode(undefined, undefined, undefined)
        //     .should.be.an.instanceOf(Promise);
        // });
    });
    describe('getAuthorizationCodeExpiresAt()', () => {
        it('should return a date', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            handler.getAuthorizationCodeExpiresAt({}).should.be.an.instanceOf(Date);
        });
    });
    describe('saveAuthorizationCode()', () => {
        it('should return an auth code', () => {
            const authorizationCode = {};
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => {
                    return authorizationCode;
                },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            return handler
                .saveAuthorizationCode('foo', 'bar', 'biz', 'baz')
                .then(data => {
                data.should.equal(authorizationCode);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
        it('should support promises when calling `model.saveAuthorizationCode()`', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => {
                    return Promise.resolve({});
                },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            handler
                .saveAuthorizationCode('foo', 'bar', 'biz', 'baz', undefined, undefined)
                .should.be.an.instanceOf(Promise);
        });
        // it('should support non-promises when calling `model.saveAuthorizationCode()`', () => {
        //   const model = {
        //     getAccessToken: () => {},
        //     getClient: () => {},
        //     saveAuthorizationCode: () => {
        //       return {};
        //     },
        //   };
        //   const handler = new CodeResponseType({
        //     authorizationCodeLifetime: 120,
        //     model,
        //   });
        //   handler
        //     .saveAuthorizationCode(
        //       'foo',
        //       'bar' as any,
        //       'biz',
        //       'baz' as any,
        //       undefined,
        //       undefined,
        //     )
        //     .should.be.an.instanceOf(Promise);
        // });
    });
    describe('saveAuthorizationCode()', () => {
        it('should call `model.saveAuthorizationCode()`', () => {
            const model = {
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: sinon.stub().returns({}),
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            return handler
                .saveAuthorizationCode('foo', 'bar', 'qux', 'biz', 'baz', 'boz')
                .then(() => {
                model.saveAuthorizationCode.callCount.should.equal(1);
                model.saveAuthorizationCode.firstCall.args.should.have.length(3);
                model.saveAuthorizationCode.firstCall.args[0].should.eql({
                    authorizationCode: 'foo',
                    expiresAt: 'bar',
                    redirectUri: 'baz',
                    scope: 'qux',
                });
                model.saveAuthorizationCode.firstCall.args[1].should.equal('biz');
                model.saveAuthorizationCode.firstCall.args[2].should.equal('boz');
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
    describe('generateAuthorizationCode()', () => {
        it('should call `model.generateAuthorizationCode()`', () => {
            const model = {
                generateAuthorizationCode: sinon.stub().returns({}),
                getAccessToken: () => { },
                getClient: () => { },
                saveAuthorizationCode: () => { },
            };
            const handler = new response_types_1.CodeResponseType({
                authorizationCodeLifetime: 120,
                model,
            });
            return handler
                .generateAuthorizationCode(undefined, undefined, undefined)
                .then(() => {
                model.generateAuthorizationCode.callCount.should.equal(1);
            })
                .catch(() => {
                should.fail('should.fail', '');
            });
        });
    });
});
//# sourceMappingURL=code-response-type.spec.js.map