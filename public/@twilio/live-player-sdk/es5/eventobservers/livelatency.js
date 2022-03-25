"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveLatencyEventObserver = void 0;
var events_1 = require("events");
var MAX_PLAYBACK_RATE = 1.05;
var DEFAULT_PLAYBACK_RATE = 1;
// All units are in seconds
var SEEK_BUFFER = 3;
var MIN_LATENCY_PLAYBACK_INCREASE_THRESHOLD = 3;
var MAX_LATENCY_PLAYBACK_INCREASE_THRESHOLD = 5;
/**
 * [[LiveLatencyEventObserver]] listens to player events and monitor live latency values.
 * This observer will then emit events when certain thresholds are detected.
 * @private
 */
var LiveLatencyEventObserver = /** @class */ (function (_super) {
    __extends(LiveLatencyEventObserver, _super);
    /**
     * @private
     */
    function LiveLatencyEventObserver(vendorPlayer, telemetry, isHighLatencyReductionEnabled) {
        var _this = _super.call(this) || this;
        _this._active = false;
        _this._increasePlaybackRate = function () {
            _this._active = true;
            _this._vendorPlayer.setPlaybackRate(MAX_PLAYBACK_RATE);
            _this.emit(LiveLatencyEventObserver.Event.IncreasePlaybackRate);
        };
        _this._revertHighLatencyReduction = function () {
            _this._active = false;
            _this._vendorPlayer.setPlaybackRate(DEFAULT_PLAYBACK_RATE);
            _this.emit(LiveLatencyEventObserver.Event.HighLatencyReductionReverted);
        };
        _this._seekAhead = function () {
            _this._active = true;
            _this._vendorPlayer.setPlaybackRate(DEFAULT_PLAYBACK_RATE);
            var newPosition = _this._vendorPlayer.getPosition() + _this._vendorPlayer.getBufferDuration() - SEEK_BUFFER;
            _this._vendorPlayer.seekTo(newPosition);
            _this.emit(LiveLatencyEventObserver.Event.SeekAhead);
        };
        _this._isHighLatencyReductionEnabled = isHighLatencyReductionEnabled;
        _this._telemetry = telemetry;
        _this._vendorPlayer = vendorPlayer;
        _this._telemetry.subscribe(_this._increasePlaybackRate, function (telemetryData) {
            var _a = telemetryData, name = _a.name, playerLiveLatency = _a.playerLiveLatency;
            return _this._shouldApplyHighLatencyReduction(name, playerLiveLatency)
                && playerLiveLatency < MAX_LATENCY_PLAYBACK_INCREASE_THRESHOLD
                && _this._vendorPlayer.getPlaybackRate() < MAX_PLAYBACK_RATE;
        });
        _this._telemetry.subscribe(_this._seekAhead, function (telemetryData) {
            var _a = telemetryData, name = _a.name, playerLiveLatency = _a.playerLiveLatency;
            return _this._shouldApplyHighLatencyReduction(name, playerLiveLatency)
                && playerLiveLatency >= MAX_LATENCY_PLAYBACK_INCREASE_THRESHOLD
                && _this._vendorPlayer.getBufferDuration() >= MAX_LATENCY_PLAYBACK_INCREASE_THRESHOLD;
        });
        _this._telemetry.subscribe(_this._revertHighLatencyReduction, function (telemetryData) {
            var _a = telemetryData, name = _a.name, playerLiveLatency = _a.playerLiveLatency;
            return _this._active && name === 'summary'
                && playerLiveLatency <= MIN_LATENCY_PLAYBACK_INCREASE_THRESHOLD;
        });
        return _this;
    }
    LiveLatencyEventObserver.prototype.release = function () {
        // NOTE(csantos): This event observer cannot be reused. So release all listeners attached to it.
        this.removeAllListeners(LiveLatencyEventObserver.Event.HighLatencyReductionReverted);
        this.removeAllListeners(LiveLatencyEventObserver.Event.IncreasePlaybackRate);
        this.removeAllListeners(LiveLatencyEventObserver.Event.SeekAhead);
        this._telemetry.unsubscribe(this._increasePlaybackRate);
        this._telemetry.unsubscribe(this._seekAhead);
        this._telemetry.unsubscribe(this._revertHighLatencyReduction);
    };
    LiveLatencyEventObserver.prototype._shouldApplyHighLatencyReduction = function (name, playerLiveLatency) {
        return this._isHighLatencyReductionEnabled && name === 'summary'
            && playerLiveLatency > MIN_LATENCY_PLAYBACK_INCREASE_THRESHOLD
            && this._vendorPlayer.getBufferDuration() >= MIN_LATENCY_PLAYBACK_INCREASE_THRESHOLD;
    };
    return LiveLatencyEventObserver;
}(events_1.EventEmitter));
exports.LiveLatencyEventObserver = LiveLatencyEventObserver;
/**
 * @private
 */
(function (LiveLatencyEventObserver) {
    /**
     * @private
     */
    var Event;
    (function (Event) {
        Event["HighLatencyReductionReverted"] = "high-latency-reduction-reverted";
        Event["IncreasePlaybackRate"] = "increase-playback-rate";
        Event["SeekAhead"] = "seek-ahead";
    })(Event = LiveLatencyEventObserver.Event || (LiveLatencyEventObserver.Event = {}));
})(LiveLatencyEventObserver = exports.LiveLatencyEventObserver || (exports.LiveLatencyEventObserver = {}));
exports.LiveLatencyEventObserver = LiveLatencyEventObserver;
//# sourceMappingURL=livelatency.js.map