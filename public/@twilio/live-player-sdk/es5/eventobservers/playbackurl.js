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
exports.PlaybackUrlEventObserver = void 0;
var events_1 = require("events");
var backoff_1 = require("backoff");
var amazon_ivs_player_1 = require("amazon-ivs-player");
var BACKOFF_TIMEOUT_MS = 16000;
var BACKOFF_CONFIG = {
    factor: 1.50,
    initialDelay: 1000,
    maxDelay: 8000,
    randomisationFactor: 0.5,
};
var RETRYABLE_ERRORS = {
    404: amazon_ivs_player_1.ErrorType.NOT_AVAILABLE
};
/**
 * [[PlaybackUrlEventObserver]] listens to the vendor player errors after loading the playback url.
 * The observer will then re-emit the events or retry loading the playback url base on the retry policy.
 * @private
 */
var PlaybackUrlEventObserver = /** @class */ (function (_super) {
    __extends(PlaybackUrlEventObserver, _super);
    function PlaybackUrlEventObserver(vendorPlayer, playbackUrl, options) {
        var _this = _super.call(this) || this;
        _this._onError = function (error) {
            var type = RETRYABLE_ERRORS[error.code];
            var isRetryable = !!_this._timer && !!type && type === error.type;
            var hasTimedOut = !!_this._startTime && Date.now() - _this._startTime >= BACKOFF_TIMEOUT_MS;
            if (isRetryable && hasTimedOut) {
                _this._timerDone();
                _this.emit(amazon_ivs_player_1.PlayerEventType.ERROR, error);
                return;
            }
            if (isRetryable) {
                if (!_this._startTime) {
                    _this._startTime = Date.now();
                }
                _this._timer.backoff();
                return;
            }
            // Not retryable. We bubble up.
            _this.emit(amazon_ivs_player_1.PlayerEventType.ERROR, error);
        };
        _this._onRetry = function () {
            _this._vendorPlayer.load(_this._playbackUrl);
        };
        _this._timerDone = function () {
            _this._clearTimer();
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerState.READY, _this._timerDone);
        };
        options = options || {};
        _this._playbackUrl = playbackUrl;
        _this._vendorPlayer = vendorPlayer;
        _this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.ERROR, _this._onError);
        _this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerState.READY, _this._timerDone);
        _this._timer = (options.exponentialBackoff || backoff_1.exponential)(BACKOFF_CONFIG);
        _this._timer.on('ready', _this._onRetry);
        return _this;
    }
    PlaybackUrlEventObserver.prototype.release = function () {
        this._clearTimer();
        this.removeAllListeners(amazon_ivs_player_1.PlayerEventType.ERROR);
        this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerState.READY, this._timerDone);
        this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.ERROR, this._onError);
    };
    PlaybackUrlEventObserver.prototype._clearTimer = function () {
        if (this._timer) {
            this._timer.reset();
            this._timer.removeAllListeners('ready');
            this._timer = null;
        }
    };
    return PlaybackUrlEventObserver;
}(events_1.EventEmitter));
exports.PlaybackUrlEventObserver = PlaybackUrlEventObserver;
//# sourceMappingURL=playbackurl.js.map