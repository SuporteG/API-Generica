/// <reference types="node" />
import { EventEmitter } from 'events';
import { Backoff } from 'backoff';
import { VendorPlayer } from '../player';
/**
 * [[PlaybackUrlEventObserver]] listens to the vendor player errors after loading the playback url.
 * The observer will then re-emit the events or retry loading the playback url base on the retry policy.
 * @private
 */
export declare class PlaybackUrlEventObserver extends EventEmitter {
    private _playbackUrl;
    private _startTime?;
    private _timer;
    private _vendorPlayer;
    constructor(vendorPlayer: VendorPlayer, playbackUrl: string, options?: {
        exponentialBackoff?: () => Backoff;
    });
    release(): void;
    private _clearTimer;
    private _onError;
    private _onRetry;
    private _timerDone;
}
