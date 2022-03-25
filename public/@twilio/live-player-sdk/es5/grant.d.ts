import { RequestCredentials } from './types';
/**
 * Decode the given access token and return the playback grant.
 * @private
 */
export declare function getPlaybackGrant(token: string): {
    playbackUrl: string;
    requestCredentials?: RequestCredentials;
    streamerSid: string;
};
