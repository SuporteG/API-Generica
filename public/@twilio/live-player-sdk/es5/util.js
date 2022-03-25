"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64Str = void 0;
var safe_buffer_1 = require("safe-buffer");
/**
 * @private
 * Decodes a base64 string. This is a more robust implementation of window.atob
 * which should be able to handle unicode problems using node buffers.
 */
function decodeBase64Str(base64Str) {
    return safe_buffer_1.Buffer.from(base64Str, 'base64').toString();
}
exports.decodeBase64Str = decodeBase64Str;
//# sourceMappingURL=util.js.map