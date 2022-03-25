"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaybackGrant = void 0;
var error_1 = require("./error");
var util_1 = require("./util");
var AccessTokenInvalidError = error_1.Error.AccessTokenInvalidError;
/**
 * Decode the given access token and return the playback grant.
 * @private
 */
function getPlaybackGrant(token) {
    var playbackUrl;
    var streamerSid;
    var requestCredentials;
    try {
        var playbackGrant = JSON.parse(util_1.decodeBase64Str(token.split('.')[1])).grants.player;
        playbackUrl = playbackGrant.playbackUrl;
        streamerSid = playbackGrant.playerStreamerSid;
        requestCredentials = playbackGrant.requestCredentials;
        if (!playbackUrl || !streamerSid || (typeof requestCredentials === 'string'
            && !['omit', 'same-origin', 'include'].includes(requestCredentials))) {
            throw null;
        }
    }
    catch (_a) {
        throw new AccessTokenInvalidError();
    }
    return {
        playbackUrl: playbackUrl,
        requestCredentials: requestCredentials,
        streamerSid: streamerSid,
    };
}
exports.getPlaybackGrant = getPlaybackGrant;
//# sourceMappingURL=grant.js.map