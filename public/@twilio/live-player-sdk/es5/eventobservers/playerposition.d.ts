/// <reference types="node" />
import { EventEmitter } from 'events';
import { Player, VendorPlayer } from '../player';
/**
 * [[PlayerPositionObserver]] monitors the [[Player]]'s position while it is
 * in the [[Player.State.Playing]] state, and raises an event if it is the same
 * for the last PLAYER_POSITION_SAME_COUNT continuous samples. This is required
 * when running in Firefox because the [[Player]] does not transition to the
 * [[Player.State.Ended]] state after the MediaProcessor is ended.
 * @private
 */
export declare class PlayerPositionObserver extends EventEmitter {
    private _playerPositions;
    private _telemetry;
    private _vendorPlayer;
    /**
     * @private
     */
    constructor(vendorPlayer: VendorPlayer, telemetry: Player.Telemetry);
    release(): void;
    private _onSummary;
}
/**
 * @private
 */
export declare namespace PlayerPositionObserver {
    /**
     * @private
     */
    enum Event {
        PlayerPositionSame = "player-position-same"
    }
}
