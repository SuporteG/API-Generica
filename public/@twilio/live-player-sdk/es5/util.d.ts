/**
 * @private
 * Decodes a base64 string. This is a more robust implementation of window.atob
 * which should be able to handle unicode problems using node buffers.
 */
export declare function decodeBase64Str(base64Str: string): string;
