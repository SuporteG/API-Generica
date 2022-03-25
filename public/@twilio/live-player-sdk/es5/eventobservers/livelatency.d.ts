/// <reference types="node" />
import { EventEmitter } from 'events';
import { Player, VendorPlayer } from '../player';
/**
 * [[LiveLatencyEventObserver]] listens to player events and monitor live latency values.
 * This observer will then emit events when certain thresholds are detected.
 * @private
 */
export declare class LiveLatencyEventObserver extends EventEmitter {
    private _active;
    private _isHighLatencyReductionEnabled;
    private _telemetry;
    private _vendorPlayer;
    /**
     * @private
     */
    constructor(vendorPlayer: VendorPlayer, telemetry: Player.Telemetry, isHighLatencyReductionEnabled: boolean);
    release(): void;
    private _increasePlaybackRate;
    private _revertHighLatencyReduction;
    private _seekAhead;
    private _shouldApplyHighLatencyReduction;
}
/**
 * @private
 */
export declare namespace LiveLatencyEventObserver {
    /**
     * @private
     */
    enum Event {
        HighLatencyReductionReverted = "high-latency-reduction-reverted",
        IncreasePlaybackRate = "increase-playback-rate",
        SeekAhead = "seek-ahead"
    }
}
