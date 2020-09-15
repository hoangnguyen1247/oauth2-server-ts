/**
 * Validation rules.
 */
/**
 * Export validation functions.
 */
/**
 * Validate if a value matches a unicode character.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
export declare const nchar: (value: string) => boolean;
/**
 * Validate if a value matches a unicode character, including exclamation marks.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
export declare const nqchar: (value: string) => boolean;
/**
 * Validate if a value matches a unicode character, including exclamation marks and spaces.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
export declare const nqschar: (value: string) => boolean;
/**
 * Validate if a value matches a unicode character excluding the carriage
 *  and linefeed characters.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
export declare const uchar: (value: string) => boolean;
/**
 * Validate if a value matches generic URIs.
 *
 * @see http://tools.ietf.org/html/rfc3986#section-3
 */
export declare const uri: (value: string) => boolean;
/**
 * Validate if a value matches against the printable set of unicode characters.
 *
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
export declare const vschar: (value: string) => boolean;
