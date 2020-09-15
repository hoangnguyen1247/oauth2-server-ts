"use strict";
/**
 * Validation rules.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Rules = {
    NCHAR: /^[\u002D|\u002E|\u005F|\w]+$/,
    NQCHAR: /^[\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
    NQSCHAR: /^[\u0020-\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
    UNICODECHARNOCRLF: /^[\u0009|\u0020-\u007E|\u0080-\uD7FF|\uE000-\uFFFD|\u10000-\u10FFFF]+$/,
    URI: /^[a-zA-Z][a-zA-Z0-9+.-]+:/,
    VSCHAR: /^[\u0020-\u007E]+$/,
};
/**
 * Export validation functions.
 */
/**
 * Validate if a value matches a unicode character.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
exports.nchar = (value) => Rules.NCHAR.test(value);
/**
 * Validate if a value matches a unicode character, including exclamation marks.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
exports.nqchar = (value) => Rules.NQCHAR.test(value);
/**
 * Validate if a value matches a unicode character, including exclamation marks and spaces.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
exports.nqschar = (value) => Rules.NQSCHAR.test(value);
/**
 * Validate if a value matches a unicode character excluding the carriage
 *  and linefeed characters.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
exports.uchar = (value) => Rules.UNICODECHARNOCRLF.test(value);
/**
 * Validate if a value matches generic URIs.
 *
 * @see http://tools.ietf.org/html/rfc3986#section-3
 */
exports.uri = (value) => Rules.URI.test(value);
/**
 * Validate if a value matches against the printable set of unicode characters.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
exports.vschar = (value) => Rules.VSCHAR.test(value);
//# sourceMappingURL=is.js.map