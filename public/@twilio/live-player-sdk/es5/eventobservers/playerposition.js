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
exports.PlayerPositionObserver = void 0;
var events_1 = require("events");
var PLAYER_POSITION_SAME_COUNT = 3;
/**
 * [[PlayerPositionObserver]] monitors the [[Player]]'s position while it is
 * in the [[Player.State.Playing]] state, and raises an event if it is the same
 * for the last PLAYER_POSITION_SAME_COUNT continuous samples. This is required
 * when running in Firefox because the [[Player]] does not transition to the
 * [[Player.State.Ended]] state after the MediaProcessor is ended.
 * @private
 */
var PlayerPositionObserver = /** @class */ (function (_super) {
    __extends(PlayerPositionObserver, _super);
    /**
     * @private
     */
    function PlayerPositionObserver(vendorPlayer, telemetry) {
        var _this = _super.call(this) || this;
        _this._onSummary = function (data) {
            var summary = data;
            _this._playerPositions.push(summary.playerPosition);
            _this._playerPositions.splice(0, Number(_this._playerPositions.length > PLAYER_POSITION_SAME_COUNT));
            if (_this._playerPositions.length === PLAYER_POSITION_SAME_COUNT
                && new Set(_this._playerPositions).size === 1) {
                _this._telemetry.unsubscribe(_this._onSummary);
                _this.emit(PlayerPositionObserver.Event.PlayerPositionSame);
            }
        };
        _this._playerPositions = [];
        _this._telemetry = telemetry;
        _this._vendorPlayer = vendorPlayer;
        _this._telemetry.subscribe(_this._onSummary, function (_a) {
            var name = _a.name, type = _a.type;
            return type === 'playback-quality'
                && name === 'summary'
                && _this._vendorPlayer.getState() === 'Playing';
        });
        return _this;
    }
    PlayerPositionObserver.prototype.release = function () {
        this.removeAllListeners(PlayerPositionObserver.Event.PlayerPositionSame);
    };
    return PlayerPositionObserver;
}(events_1.EventEmitter));
exports.PlayerPositionObserver = PlayerPositionObserver;
/**
 * @private
 */
(function (PlayerPositionObserver) {
    /**
     * @private
     */
    var Event;
    (function (Event) {
        Event["PlayerPositionSame"] = "player-position-same";
    })(Event = PlayerPositionObserver.Event || (PlayerPositionObserver.Event = {}));
})(PlayerPositionObserver = exports.PlayerPositionObserver || (exports.PlayerPositionObserver = {}));
exports.PlayerPositionObserver = PlayerPositionObserver;
//# sourceMappingURL=playerposition.js.map