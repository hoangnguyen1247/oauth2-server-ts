import * as should from 'should';
import * as util from 'util';
import {
    AccessDeniedError,
    InvalidArgumentError,
    InvalidClientError,
    InvalidRequestError,
    ServerError,
    UnauthorizedClientError,
    UnsupportedGrantTypeError,
} from '../../../lib/errors';
import { PasswordGrantType } from '../../../lib/grant-types';
import { TokenHandler } from '../../../lib/handlers';
import { Request } from '../../../lib/request';
import { Response } from '../../../lib/response';
import { BearerTokenType } from '../../../lib/token-types';

/**
 * Test `TokenHandler` integration.
 */

describe('TokenHandler integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `options.accessTokenLifetime` is missing', () => {
            try {
                new TokenHandler();

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessTokenLifetime`');
            }
        });

        it('should throw an error if `options.model` is missing', () => {
            try {
                new TokenHandler({ accessTokenLifetime: 120 });

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });

        it('should throw an error if `options.refreshTokenLifetime` is missing', () => {
            try {
                new TokenHandler({ accessTokenLifetime: 120, model: {} });

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal('Missing parameter: `refreshTokenLifetime`');
            }
        });

        it('should throw an error if the model does not implement `getClient()`', () => {
            try {
                new TokenHandler({
                    accessTokenLifetime: 120,
                    model: {},
                    refreshTokenLifetime: 120,
                });

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal(
                    'Invalid argument: model does not implement `getClient()`',
                );
            }
        });

        it('should set the `accessTokenLifetime`', () => {
            const accessTokenLifetime = {};
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime,
                model,
                refreshTokenLifetime: 120,
            });

            handler.accessTokenLifetime.should.equal(accessTokenLifetime);
        });

        it('should set the `alwaysIssueNewRefreshToken`', () => {
            const alwaysIssueNewRefreshToken = true;
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 120,
                alwaysIssueNewRefreshToken,
            });

            handler.alwaysIssueNewRefreshToken.should.equal(
                alwaysIssueNewRefreshToken,
            );
        });

        it('should set the `alwaysIssueNewRefreshToken` to false', () => {
            const alwaysIssueNewRefreshToken = false;
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 120,
                alwaysIssueNewRefreshToken,
            });

            handler.alwaysIssueNewRefreshToken.should.equal(
                alwaysIssueNewRefreshToken,
            );
        });

        it('should return the default `alwaysIssueNewRefreshToken` value', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 123,
                model,
                refreshTokenLifetime: 120,
            });

            handler.alwaysIssueNewRefreshToken.should.equal(true);
        });

        it('should set the `extendedGrantTypes`', () => {
            const extendedGrantTypes = { foo: 'bar' };
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                extendedGrantTypes,
                model,
                refreshTokenLifetime: 120,
            });

            handler.grantTypes.should.containEql(extendedGrantTypes);
        });

        it('should set the `model`', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            handler.model.should.equal(model);
        });

        it('should set the `refreshTokenLifetime`', () => {
            const refreshTokenLifetime = {};
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime,
            });

            handler.refreshTokenLifetime.should.equal(refreshTokenLifetime);
        });
    });

    describe('handle()', () => {
        it('should throw an error if `request` is missing', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            try {
                await handler.handle(undefined, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal(
                    'Invalid argument: `request` must be an instance of Request',
                );
            }
        });

        it('should throw an error if `response` is missing', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.handle(request, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal(
                    'Invalid argument: `response` must be an instance of Response',
                );
            }
        });

        it('should throw an error if the method is not `POST`', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {},
                method: 'GET',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(InvalidRequestError);
                    e.message.should.equal('Invalid request: method must be POST');
                });
        });

        it('should throw an error if the media type is not `application/x-www-form-urlencoded`', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {},
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(InvalidRequestError);
                    e.message.should.equal(
                        'Invalid request: content must be application/x-www-form-urlencoded',
                    );
                });
        });

        it('should throw the error if an oauth error is thrown', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(InvalidClientError);
                    e.message.should.equal(
                        'Invalid client: cannot retrieve client credentials',
                    );
                });
        });

        it('should throw a server error if a non-oauth error is thrown', () => {
            const model = {
                getClient() {
                    throw new Error('Unhandled exception');
                },
                getUser() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {
                    clientId: 12345,
                    clientSecret: 'secret',
                    grantType: 'password',
                    password: 'bar',
                    username: 'foo',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(ServerError);
                    e.message.should.equal('Unhandled exception');
                    e.inner.should.be.an.instanceOf(Error);
                    e.data.should.be.an.instanceOf(Object);
                });
        });

        it('should update the response if an error is thrown', () => {
            const model = {
                getClient() {
                    throw new Error('Unhandled exception');
                },
                getUser() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {
                    clientId: 12345,
                    clientSecret: 'secret',
                    grantType: 'password',
                    password: 'bar',
                    username: 'foo',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(() => {
                    response.body.should.eql({
                        error: 'server_error',
                        error_description: 'Unhandled exception',
                    });
                    response.status.should.equal(500);
                });
        });

        it('should return a bearer token if successful', async () => {
            const token = {
                accessToken: 'foo',
                client: {},
                refreshToken: 'bar',
                scope: 'foobar',
                user: {},
            };
            const model = {
                getClient() {
                    return { grants: ['password'] };
                },
                getUser() {
                    return {};
                },
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'baz';
                },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {
                    clientId: 12345,
                    clientSecret: 'secret',
                    username: 'foo',
                    password: 'bar',
                    grantType: 'password',
                    scope: 'baz',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });
            try {
                const data = await handler.handle(request, response);
                data.should.eql(token);
            } catch (error) {
                should.fail('should.fail', '');
            }
        });

        it('should not return custom attributes in a bearer token if the allowExtendedTokenAttributes is not set', () => {
            const token = {
                accessToken: 'foo',
                client: {},
                refreshToken: 'bar',
                scope: 'foobar',
                user: {},
                foo: 'bar',
            };
            const model = {
                getClient() {
                    return { grants: ['password'] };
                },
                getUser() {
                    return {};
                },
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'baz';
                },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {
                    clientId: 12345,
                    clientSecret: 'secret',
                    username: 'foo',
                    password: 'bar',
                    grantType: 'password',
                    scope: 'baz',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .handle(request, response)
                .then(() => {
                    should.exist(response.body.accessToken);
                    should.exist(response.body.refreshToken);
                    should.exist(response.body.tokenType);
                    should.exist(response.body.scope);
                    should.not.exist(response.body.foo);
                })
                .catch(() => {
                    should.fail('should.fail', '');
                });
        });

        it('should return custom attributes in a bearer token if the allowExtendedTokenAttributes is set', async () => {
            const token = {
                accessToken: 'foo',
                client: {},
                refreshToken: 'bar',
                scope: 'foobar',
                user: {},
                foo: 'bar',
            };
            const model = {
                getClient() {
                    return { grants: ['password'] };
                },
                getUser() {
                    return {};
                },
                saveToken() {
                    return token;
                },
                validateScope() {
                    return 'baz';
                },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
                allowExtendedTokenAttributes: true,
            });
            const request = new Request({
                body: {
                    clientId: 12345,
                    clientSecret: 'secret',
                    username: 'foo',
                    password: 'bar',
                    grantType: 'password',
                    scope: 'baz',
                },
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'transfer-encoding': 'chunked',
                },
                method: 'POST',
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            await handler.handle(request, response);
            should.exist(response.body.accessToken);
            should.exist(response.body.refreshToken);
            should.exist(response.body.tokenType);
            should.exist(response.body.scope);
            should.exist(response.body.foo);
        });
    });

    describe('getClient()', () => {
        it('should throw an error if `clientId` is invalid', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 'øå€£‰', clientSecret: 'foo' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.getClient(request, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidRequestError);
                e.message.should.equal('Invalid parameter: `clientId`');
            }
        });

        it('should throw an error if `clientSecret` is invalid', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 'foo', clientSecret: 'øå€£‰' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.getClient(request, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidRequestError);
                e.message.should.equal('Invalid parameter: `clientSecret`');
            }
        });

        it('should throw an error if `client` is missing', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });

            return handler
                .getClient(request, undefined)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(InvalidClientError);
                    e.message.should.equal('Invalid client: client is invalid');
                });
        });

        it('should throw an error if `client.grants` is missing', () => {
            const model = {
                getClient() {
                    return {};
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });

            return handler
                .getClient(request, undefined)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(ServerError);
                    e.message.should.equal('Server error: missing client `grants`');
                });
        });

        it('should throw an error if `client.grants` is invalid', async () => {
            const model = {
                getClient() {
                    return { grants: 'foobar' };
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });
            try {
                await handler.getClient(request, undefined);
                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(ServerError);
                e.message.should.equal('Server error: `grants` must be an array');
            }
        });

        it('should throw a 401 error if the client is invalid and the request contains an authorization header', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {
                    authorization: util.format(
                        'Basic %s',
                        Buffer.from('foo:bar').toString('base64'),
                    ),
                },
                method: {},
                query: {},
            });
            const response = new Response({ body: {}, headers: {} });

            return handler
                .getClient(request, response)
                .then(() => {
                    should.fail('should.fail', '');
                })
                .catch(e => {
                    e.should.be.an.instanceOf(InvalidClientError);
                    e.code.should.equal(401);
                    e.message.should.equal('Invalid client: client is invalid');

                    response
                        .get('WWW-Authenticate')
                        .should.equal('Basic realm="Service"');
                });
        });

        it('should return a client', async () => {
            const client = { id: 12345, grants: [] };
            const model = {
                getClient() {
                    return client;
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });
            try {
                const data = await handler.getClient(request, undefined);
                data.should.equal(client);
            } catch (error) {
                should.fail('should.fail', '');
            }
        });

        describe('with `password` grant type and `requireClientAuthentication` is false', () => {
            it('should return a client ', () => {
                const client = { id: 12345, grants: [] };
                const model = {
                    async getClient() {
                        return client;
                    },
                    async saveToken() { },
                };

                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                    requireClientAuthentication: {
                        password: false,
                    },
                });
                const request = new Request({
                    body: { clientId: 'blah', grantType: 'password' },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler
                    .getClient(request, undefined)
                    .then(data => {
                        data.should.equal(client);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });

        describe('with `password` grant type and `requireClientAuthentication` is false and Authorization header', () => {
            it('should return a client ', () => {
                const client = { id: 12345, grants: [] };
                const model = {
                    async getClient() {
                        return client;
                    },
                    async saveToken() { },
                };

                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                    requireClientAuthentication: {
                        password: false,
                    },
                });
                const request = new Request({
                    body: { grantType: 'password' },
                    headers: {
                        authorization: util.format(
                            'Basic %s',
                            Buffer.from('blah:').toString('base64'),
                        ),
                    },
                    method: {},
                    query: {},
                });

                return handler
                    .getClient(request, undefined)
                    .then(data => {
                        data.should.equal(client);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });

        it('should support promises', () => {
            const model = {
                getClient() {
                    return Promise.resolve({ grants: [] });
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });

            handler.getClient(request, undefined).should.be.an.instanceOf(Promise);
        });

        it('should support non-promises', () => {
            const model = {
                getClient() {
                    return { grants: [] };
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 12345, clientSecret: 'secret' },
                headers: {},
                method: {},
                query: {},
            });

            handler.getClient(request, undefined).should.be.an.instanceOf(Promise);
        });

        /*     it('should support callbacks', () => {
          const model = {
            getClient(clientId, clientSecret, callback) {
              callback(null, { grants: [] });
            },
            saveToken() {},
          };
          const handler = new TokenHandler({
            accessTokenLifetime: 120,
            model,
            refreshTokenLifetime: 120,
          });
          const request = new Request({
            body: { clientId 12345, clientSecret: 'secret' },
            headers: {},
            method: {},
            query: {},
          });

          handler.getClient(request, undefined).should.be.an.instanceOf(Promise);
        }); */
    });

    describe('getClientCredentials()', () => {
        it('should throw an error if `clientId is missing', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientSecret: 'foo' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                handler.getClientCredentials(request);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidClientError);
                e.message.should.equal(
                    'Invalid client: cannot retrieve client credentials',
                );
            }
        });

        it('should throw an error if `clientSecret` is missing', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { clientId: 'foo' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                handler.getClientCredentials(request);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidClientError);
                e.message.should.equal(
                    'Invalid client: cannot retrieve client credentials',
                );
            }
        });

        describe('with `clientId` and grant type is `password` and `requireClientAuthentication` is false', () => {
            it('should return a client', () => {
                const model = {
                    getClient() { },
                    saveToken() { },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                    requireClientAuthentication: { password: false },
                });
                const request = new Request({
                    body: { clientId: 'foo', grantType: 'password' },
                    headers: {},
                    method: {},
                    query: {},
                });
                const credentials = handler.getClientCredentials(request);

                credentials.should.eql({ clientId: 'foo' });
            });
        });

        describe('with `clientId and `clientSecret` in the request header as basic auth', () => {
            it('should return a client', () => {
                const model = {
                    getClient() { },
                    saveToken() { },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: {},
                    headers: {
                        authorization: util.format(
                            'Basic %s',
                            Buffer.from('foo:bar').toString('base64'),
                        ),
                    },
                    method: {},
                    query: {},
                });
                const credentials = handler.getClientCredentials(request);

                credentials.should.eql({ clientId: 'foo', clientSecret: 'bar' });
            });
        });

        describe('with `clientId` and `clientSecret` in the request body', () => {
            it('should return a client', () => {
                const model = {
                    getClient() { },
                    saveToken() { },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: { clientId: 'foo', clientSecret: 'bar' },
                    headers: {},
                    method: {},
                    query: {},
                });
                const credentials = handler.getClientCredentials(request);

                credentials.should.eql({ clientId: 'foo', clientSecret: 'bar' });
            });
        });
    });

    describe('handleGrantType()', () => {
        it('should throw an error if `grantType` is missing', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: {},
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.handleGrantType(request, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidRequestError);
                e.message.should.equal('Missing parameter: `grantType`');
            }
        });

        it('should throw an error if `grantType` is invalid', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { grantType: '~foo~' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.handleGrantType(request, undefined);
                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidRequestError);
                e.message.should.equal('Invalid parameter: `grantType`');
            }
        });

        it('should throw an error if `grantType` is unsupported', async () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { grantType: 'foobar' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.handleGrantType(request, undefined);

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(UnsupportedGrantTypeError);
                e.message.should.equal(
                    'Unsupported grant type: `grantType` is invalid',
                );
            }
        });

        it('should throw an error if `grantType` is unauthorized', async () => {
            const client: any = { grants: ['client_credentials'] };
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const request = new Request({
                body: { grantType: 'password' },
                headers: {},
                method: {},
                query: {},
            });

            try {
                await handler.handleGrantType(request, client);
                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(UnauthorizedClientError);
                e.message.should.equal('Unauthorized client: `grantType` is invalid');
            }
        });

        /*    it('should throw an invalid grant error if a non-oauth error is thrown', () => {
          const client = { grants: ['password'] };
          const model = {
            getClient(clientId, password, callback) {
              callback(null, client);
            },
            getUser(uid, pwd, callback) {
              callback();
            },
            saveToken() {},
          };
          const handler = new TokenHandler({
            accessTokenLifetime: 120,
            model,
            refreshTokenLifetime: 120,
          });
          const request = new Request({
            body: { grantType: 'password', username: 'foo', password: 'bar' },
            headers: {},
            method: {},
            query: {},
          });

          return handler
            .handleGrantType(request, client)
            .then(() => should.fail('should.fail', ''))
            .catch(e => {
              e.should.be.an.instanceOf(InvalidGrantError);
              e.message.should.equal('Invalid grant: user credentials are invalid');
            });
        }); */

        describe('with grantType `authorization_code`', () => {
            it('should return a token', () => {
                const client: any = { id: 'foobar', grants: ['authorization_code'] };
                const token = {};
                const model = {
                    getAuthorizationCode() {
                        return {
                            authorizationCode: 12345,
                            client: { id: 'foobar' },
                            expiresAt: new Date(new Date().getTime() * 2),
                            user: {},
                        };
                    },
                    getClient() { },
                    saveToken() {
                        return token;
                    },
                    validateScope() {
                        return 'foo';
                    },
                    revokeAuthorizationCode() {
                        return {
                            authorizationCode: 12345,
                            client: { id: 'foobar' },
                            expiresAt: new Date(new Date().getTime() / 2),
                            user: {},
                        };
                    },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: {
                        code: 12345,
                        grantType: 'authorization_code',
                    },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler.handleGrantType(request, client).then(data => {
                    data.should.equal(token);
                });
                // .catch(() => {
                //   should.fail('should.fail', '');
                // });
            });
        });

        describe('with grantType `client_credentials`', () => {
            it('should return a token', () => {
                const client: any = { grants: ['client_credentials'] };
                const token = {};
                const model = {
                    getClient() { },
                    getUserFromClient() {
                        return {};
                    },
                    saveToken() {
                        return token;
                    },
                    validateScope() {
                        return 'foo';
                    },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: {
                        grantType: 'client_credentials',
                        scope: 'foo',
                    },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler
                    .handleGrantType(request, client)
                    .then(data => {
                        data.should.equal(token);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });

        describe('with grantType `password`', () => {
            it('should return a token', () => {
                const client: any = { grants: ['password'] };
                const token = {};
                const model = {
                    getClient() { },
                    getUser() {
                        return {};
                    },
                    saveToken() {
                        return token;
                    },
                    validateScope() {
                        return 'baz';
                    },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: {
                        clientId: 12345,
                        clientSecret: 'secret',
                        grantType: 'password',
                        password: 'bar',
                        username: 'foo',
                        scope: 'baz',
                    },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler
                    .handleGrantType(request, client)
                    .then(data => {
                        data.should.equal(token);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });

        describe('with grantType `refreshToken`', () => {
            it('should return a token', () => {
                const client: any = { grants: ['refreshToken'] };
                const token = { accessToken: 'foo', client: {}, user: {} };
                const model = {
                    getClient() { },
                    getRefreshToken() {
                        return {
                            accessToken: 'foo',
                            client: {},
                            refreshTokenExpiresAt: new Date(new Date().getTime() * 2),
                            user: {},
                        };
                    },
                    saveToken() {
                        return token;
                    },
                    revokeToken() {
                        return {
                            accessToken: 'foo',
                            client: {},
                            refreshTokenExpiresAt: new Date(new Date().getTime() / 2),
                            user: {},
                        };
                    },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                });
                const request = new Request({
                    body: {
                        grantType: 'refreshToken',
                        refreshToken: 12345,
                    },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler
                    .handleGrantType(request, client)
                    .then(data => {
                        data.should.equal(token);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });

        describe('with custom grantType', () => {
            it('should return a token', () => {
                const client: any = {
                    grants: ['urn:ietf:params:oauth:grant-type:saml2-bearer'],
                };
                const token = {};
                const model = {
                    getClient() { },
                    getUser() {
                        return {};
                    },
                    saveToken() {
                        return token;
                    },
                    validateScope() {
                        return 'foo';
                    },
                };
                const handler = new TokenHandler({
                    accessTokenLifetime: 120,
                    model,
                    refreshTokenLifetime: 120,
                    extendedGrantTypes: {
                        'urn:ietf:params:oauth:grant-type:saml2-bearer': PasswordGrantType,
                    },
                });
                const request = new Request({
                    body: {
                        grantType: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
                        username: 'foo',
                        password: 'bar',
                    },
                    headers: {},
                    method: {},
                    query: {},
                });

                return handler
                    .handleGrantType(request, client)
                    .then(data => {
                        data.should.equal(token);
                    })
                    .catch(() => {
                        should.fail('should.fail', '');
                    });
            });
        });
    });

    describe('getAccessTokenLifetime()', () => {
        it('should return the client access token lifetime', () => {
            const client: any = { accessTokenLifetime: 60 };
            const model = {
                getClient() {
                    return client;
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            handler.getAccessTokenLifetime(client).should.equal(60);
        });

        it('should return the default access token lifetime', () => {
            const client: any = {};
            const model = {
                getClient() {
                    return client;
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            handler.getAccessTokenLifetime(client).should.equal(120);
        });
    });

    describe('getRefreshTokenLifetime()', () => {
        it('should return the client access token lifetime', () => {
            const client: any = { refreshTokenLifetime: 60 };
            const model = {
                getClient() {
                    return client;
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            handler.getRefreshTokenLifetime(client).should.equal(60);
        });

        it('should return the default access token lifetime', () => {
            const client: any = {};
            const model = {
                getClient() {
                    return client;
                },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });

            handler.getRefreshTokenLifetime(client).should.equal(120);
        });
    });

    describe('getTokenType()', () => {
        it('should return a token type', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const tokenType = handler.getTokenType({
                accessToken: 'foo',
                refreshToken: 'bar',
                scope: 'foobar',
            });

            tokenType.should.containEql({
                accessToken: 'foo',
                accessTokenLifetime: undefined,
                refreshToken: 'bar',
                scope: 'foobar',
            });
        });
    });

    describe('updateSuccessResponse()', () => {
        it('should set the `body`', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const tokenType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );
            const response = new Response({ body: {}, headers: {} });

            handler.updateSuccessResponse(response, tokenType);

            response.body.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                refreshToken: 'biz',
                tokenType: 'Bearer',
            });
        });

        it('should set the `Cache-Control` header', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const tokenType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );
            const response = new Response({ body: {}, headers: {} });

            handler.updateSuccessResponse(response, tokenType);

            response.get('Cache-Control').should.equal('no-store');
        });

        it('should set the `Pragma` header', () => {
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const tokenType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );
            const response = new Response({ body: {}, headers: {} });

            handler.updateSuccessResponse(response, tokenType);

            response.get('Pragma').should.equal('no-cache');
        });
    });

    describe('updateErrorResponse()', () => {
        it('should set the `body`', () => {
            const error = new AccessDeniedError('Cannot request a token');
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const response = new Response({ body: {}, headers: {} });

            handler.updateErrorResponse(response, error);

            response.body.error.should.equal('access_denied');
            response.body.error_description.should.equal('Cannot request a token');
        });

        it('should set the `status`', () => {
            const error = new AccessDeniedError('Cannot request a token');
            const model = {
                getClient() { },
                saveToken() { },
            };
            const handler = new TokenHandler({
                accessTokenLifetime: 120,
                model,
                refreshTokenLifetime: 120,
            });
            const response = new Response({ body: {}, headers: {} });

            handler.updateErrorResponse(response, error);

            response.status.should.equal(400);
        });
    });
});
