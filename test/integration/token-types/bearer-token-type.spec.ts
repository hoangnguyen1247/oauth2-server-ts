import * as should from 'should';
import { InvalidArgumentError } from '../../../src/errors';
import { BearerTokenType } from '../../../src/token-types';

/**
 * Test `BearerTokenType` integration.
 */

describe('BearerTokenType integration', () => {
    describe('constructor()', () => {
        it('should throw an error if `accessToken` is missing', () => {
            try {
                new BearerTokenType(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );

                should.fail('should.fail', '');
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal('Missing parameter: `accessToken`');
            }
        });

        it('should set the `accessToken`', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                undefined,
                undefined,
                undefined,
                undefined,
            );

            responseType.accessToken.should.equal('foo');
        });

        it('should set the `accessTokenLifetime`', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                undefined,
                undefined,
                undefined,
                undefined,
            );

            responseType.accessTokenLifetime.should.equal('bar');
        });

        it('should set the `refreshToken`', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );

            responseType.refreshToken.should.equal('biz');
        });
    });

    describe('valueOf()', () => {
        it('should return the value representation', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                undefined,
                undefined,
                undefined,
                undefined,
            );
            const value = responseType.valueOf();

            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                tokenType: 'Bearer',
            });
        });

        it('should not include the `expiresIn` if not given', () => {
            const responseType = new BearerTokenType(
                'foo',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            );
            const value = responseType.valueOf();

            value.should.eql({
                accessToken: 'foo',
                tokenType: 'Bearer',
            });
        });

        it('should set `refreshToken` if `refreshToken` is defined', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );
            const value = responseType.valueOf();

            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                refreshToken: 'biz',
                tokenType: 'Bearer',
            });
        });

        it('should set `expiresIn` if `accessTokenLifetime` is defined', () => {
            const responseType = new BearerTokenType(
                'foo',
                'bar' as any,
                'biz',
                undefined,
                undefined,
                undefined,
            );
            const value = responseType.valueOf();

            value.should.eql({
                accessToken: 'foo',
                expiresIn: 'bar',
                refreshToken: 'biz',
                tokenType: 'Bearer',
            });
        });
    });
});
