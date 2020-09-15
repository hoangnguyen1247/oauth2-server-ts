"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../../src/response");
/**
 * Test `Response` integration.
 */
describe('Response integration', () => {
    describe('constructor()', () => {
        it('should set the `body`', () => {
            const response = new response_1.Response({ body: 'foo', headers: {} });
            response.body.should.equal('foo');
        });
        it('should set the `headers`', () => {
            const response = new response_1.Response({
                body: {},
                headers: { foo: 'bar', QuX: 'biz' },
            });
            response.headers.should.eql({ foo: 'bar', qux: 'biz' });
        });
        it('should set the `status` to 200', () => {
            const response = new response_1.Response({ body: {}, headers: {} });
            response.status.should.equal(200);
        });
    });
    describe('get()', () => {
        it('should return `undefined` if the field does not exist', () => {
            const response = new response_1.Response({ body: {}, headers: {} });
            (response.get('content-type') === undefined).should.be.true();
        });
        it('should return the value if the field exists', () => {
            const response = new response_1.Response({
                body: {},
                headers: { 'content-type': 'text/html; charset=utf-8' },
            });
            response.get('Content-Type').should.equal('text/html; charset=utf-8');
        });
    });
    describe('redirect()', () => {
        it('should set the location header to `url`', () => {
            const response = new response_1.Response({ body: {}, headers: {} });
            response.redirect('http://example.com');
            response.get('Location').should.equal('http://example.com');
        });
        it('should set the `status` to 302', () => {
            const response = new response_1.Response({ body: {}, headers: {} });
            response.redirect('http://example.com');
            response.status.should.equal(302);
        });
    });
    describe('set()', () => {
        it('should set the `field`', () => {
            const response = new response_1.Response({ body: {}, headers: {} });
            response.set('foo', 'bar');
            response.headers.should.eql({ foo: 'bar' });
        });
    });
});
//# sourceMappingURL=response.spec.js.map