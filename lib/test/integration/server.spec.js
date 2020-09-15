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
const errors_1 = require("../../src/errors");
const handlers_1 = require("../../src/handlers");
const request_1 = require("../../src/request");
const response_1 = require("../../src/response");
const server_1 = require("../../src/server");
/**
 * Test `Server` integration.
 */
describe('Server integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `model` is missing', () => {
            try {
                new server_1.OAuth2Server({});
                should.fail('should.fail', '');
            }
            catch (e) {
                e.should.be.an.instanceOf(errors_1.InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
        it('should set the `model`', () => {
            const model = {};
            const server = new server_1.OAuth2Server({ model });
            server.options.model.should.equal(model);
        });
    });
    describe('authenticate()', () => {
        it('should set the default `options`', async () => {
            const model = {
                getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {},
                headers: { Authorization: 'Bearer foo' },
                method: {},
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            try {
                const stub = sinon
                    .stub(handlers_1.AuthenticateHandler.prototype, 'handle')
                    .returnsThis();
                const token = await server.authenticate(request, response);
                token.addAcceptedScopesHeader.should.be.true();
                token.addAuthorizedScopesHeader.should.be.true();
                token.allowBearerTokensInQueryString.should.be.false();
                stub.restore();
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        it('should return a promise', () => {
            const model = {
                async getAccessToken(token) {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {},
                headers: { Authorization: 'Bearer foo' },
                method: {},
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const handler = server.authenticate(request, response);
            handler.should.be.an.instanceOf(Promise);
        });
        /*    it('should support callbacks', next => {
          const model = {
            getAccessToken() {
              return {
                user: {},
                accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
              };
            },
          };
          const server = new Server({ model });
          const request = new Request({
            body: {},
            headers: { Authorization: 'Bearer foo' },
            method: {},
            query: {},
          });
          const response = new Response({ body: {}, headers: {} });

          // server.authenticate(request, response, null, next);
        }); */
    });
    describe('authorize()', () => {
        it('should set the default `options`', async () => {
            const model = {
                async getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                async getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                async saveAuthorizationCode() {
                    return { authorizationCode: 123 };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    clientId: 1234,
                    clientSecret: 'secret',
                    responseType: 'code',
                },
                headers: { Authorization: 'Bearer foo' },
                method: {},
                query: { state: 'foobar' },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            // try {
            const stub = sinon
                .stub(handlers_1.AuthorizeHandler.prototype, 'handle')
                .returnsThis();
            const code = await server.authorize(request, response);
            const options = code.options;
            options.allowEmptyState.should.be.false();
            options.authorizationCodeLifetime.should.be.equal(300);
            stub.restore();
            // } catch (error) {
            //   should.fail('should.fail', '');
            // }
        });
        it('should return a promise', () => {
            const model = {
                getAccessToken() {
                    return {
                        user: {},
                        accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
                    };
                },
                getClient() {
                    return {
                        grants: ['authorization_code'],
                        redirectUris: ['http://example.com/cb'],
                    };
                },
                saveAuthorizationCode() {
                    return { authorizationCode: 123 };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    clientId: 1234,
                    clientSecret: 'secret',
                    responseType: 'code',
                },
                headers: { Authorization: 'Bearer foo' },
                method: {},
                query: { state: 'foobar' },
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            try {
                const handler = server.authorize(request, response);
                handler.should.be.an.instanceOf(Promise);
            }
            catch (error) {
                should.fail('should.fail', '');
            }
        });
        /*   it('should support callbacks', next => {
          const model = {
            getAccessToken() {
              return {
                user: {},
                accessTokenExpiresAt: new Date(new Date().getTime() + 10000),
              };
            },
            getClient() {
              return {
                grants: ['authorization_code'],
                redirectUris: ['http://example.com/cb'],
              };
            },
            saveAuthorizationCode() {
              return { authorizationCode: 123 };
            },
          };
          const server = new Server({ model });
          const request = new Request({
            body: {
              clientId: 1234,
              clientSecret: 'secret',
              responseType: 'code',
            },
            headers: { Authorization: 'Bearer foo' },
            method: {},
            query: { state: 'foobar' },
          });
          const response = new Response({ body: {}, headers: {} });

          // tslint:disable-next-line: no-floating-promises
          // server.authorize(request, response, undefined, next);
        }); */
    });
    describe('token()', () => {
        it('should set the default `options`', async () => {
            const model = {
                async getClient() {
                    return { grants: ['password'] };
                },
                async getUser() {
                    return {};
                },
                async saveToken() {
                    return { accessToken: 1234, client: {}, user: {} };
                },
                async validateScope() {
                    return 'foo';
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    clientId: 1234,
                    clientSecret: 'secret',
                    grantType: 'password',
                    username: 'foo',
                    password: 'pass',
                    scope: 'foo',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            const stub = sinon.stub(handlers_1.TokenHandler.prototype, 'handle').returnsThis();
            // try {
            const token = await server.token(request, response);
            token.accessTokenLifetime.should.equal(3600);
            token.refreshTokenLifetime.should.equal(1209600);
            stub.restore();
            // } catch (error) {
            //   should.fail('should.fail', '');
            // }
        });
        it('should return a promise', () => {
            const model = {
                async getClient() {
                    return { grants: ['password'] };
                },
                async getUser() {
                    return {};
                },
                async saveToken() {
                    return { accessToken: 1234, client: {}, user: {} };
                },
            };
            const server = new server_1.OAuth2Server({ model });
            const request = new request_1.Request({
                body: {
                    clientId: 1234,
                    clientSecret: 'secret',
                    grantType: 'password',
                    username: 'foo',
                    password: 'pass',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new response_1.Response({ body: {}, headers: {} });
            // try {
            const handler = server.token(request, response);
            handler.should.be.an.instanceOf(Promise);
            // } catch (error) {
            // should.fail('should.fail', '');
            // }
        });
        /* it('should support callbacks', next => {
          const model = {
            async () {
              return { grants: ['password'] };
            },
            getUser() {
              return {};
            },
            saveToken() {
              return { accessToken: 1234, client: {}, user: {} };
            },
            validateScope() {
              return 'foo';
            },
          };
          const server = new Server({ model });
          const request = new Request({
            body: {
              clientId: 1234,
              clientSecret: 'secret',
              grantType: 'password',
              username: 'foo',
              password: 'pass',
              scope: 'foo',
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'transfer-encoding': 'chunked',
            },
            method: 'POST',
            query: {},
          });
          const response = new Response({ body: {}, headers: {} });

          // server.token(request, response, null, next);
        }); */
    });
});
//# sourceMappingURL=server.spec.js.map