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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPlayer = exports.isSupported = void 0;
// TODO(mmalavalli): Ensure only the vendor sdk version is exported, and not the rest of the package.json fields.
var dependencies = require('../package.json').dependencies;
var amazon_ivs_player_1 = require("amazon-ivs-player");
var error_1 = require("./error");
var player_1 = require("./player");
var eventobservers_1 = require("./eventobservers");
var ErrorCode = player_1.Player.Error.ErrorCode;
var PLAYBACK_QUALITY_SUMMARY_PUBLISH_INTERVAL_MS = 3000;
var IVS_ERRORS = new Map();
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.GENERIC, ErrorCode.PLAYBACK_MEDIA);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.AUTHORIZATION, ErrorCode.PLAYBACK_AUTHORIZATION);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.INVALID_DATA, ErrorCode.PLAYBACK_INVALID_DATA);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.INVALID_PARAMETER, ErrorCode.PLAYBACK_INVALID_PARAMETER);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.INVALID_STATE, ErrorCode.PLAYBACK_INVALID_STATE);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.NETWORK, ErrorCode.PLAYBACK_NETWORK);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.NETWORK_IO, ErrorCode.PLAYBACK_NETWORK_IO);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.NOT_AVAILABLE, ErrorCode.PLAYBACK_STREAM_NOT_AVAILABLE);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.NOT_SUPPORTED, ErrorCode.PLAYBACK_NOT_SUPPORTED);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.NO_SOURCE, ErrorCode.PLAYBACK_NO_SOURCE);
IVS_ERRORS.set(amazon_ivs_player_1.ErrorType.TIMEOUT, ErrorCode.PLAYBACK_TIMEOUT);
var createMediaPlayerWithInternalAPIs = function (config) {
    return amazon_ivs_player_1.create(config);
};
var vendorPlayerVersion = dependencies['amazon-ivs-player'];
/**
 * Whether the SDK supports the browser. The SDK only supports browsers which are
 * capable of running WebAssembly (WASM).
 */
exports.isSupported = amazon_ivs_player_1.isPlayerSupported;
var MediaPlayer = /** @class */ (function (_super) {
    __extends(MediaPlayer, _super);
    function MediaPlayer(playbackUrl, streamerSid, options) {
        return _super.call(this, playbackUrl, streamerSid, createMediaPlayerWithInternalAPIs, __assign(__assign({}, options), { vendorPlayerVersion: vendorPlayerVersion })) || this;
    }
    MediaPlayer.prototype._getState = function () {
        var _a;
        return (_a = {},
            _a[amazon_ivs_player_1.PlayerState.BUFFERING] = player_1.Player.State.Buffering,
            _a[amazon_ivs_player_1.PlayerState.ENDED] = player_1.Player.State.Ended,
            _a[amazon_ivs_player_1.PlayerState.IDLE] = player_1.Player.State.Idle,
            _a[amazon_ivs_player_1.PlayerState.PLAYING] = player_1.Player.State.Playing,
            _a[amazon_ivs_player_1.PlayerState.READY] = player_1.Player.State.Ready,
            _a)[this._vendorPlayer.getState()];
    };
    MediaPlayer.prototype._reemitVendorPlayerEvents = function () {
        var _this = this;
        var getPlaybackQualitySummary = function () { return ({
            name: 'summary',
            playerLiveLatency: _this._vendorPlayer.getLiveLatency(),
            playerPosition: _this._vendorPlayer.getPosition(),
            playerStats: _this.stats,
            playerStreamerSid: _this._streamerSid,
            playerVolume: _this._vendorPlayer.getVolume(),
            timestamp: Date.now(),
            type: 'playback-quality',
        }); };
        var _a = player_1.Player.telemetry.publishPeriodically(getPlaybackQualitySummary, PLAYBACK_QUALITY_SUMMARY_PUBLISH_INTERVAL_MS), startPublishingPlaybackQualitySummary = _a.start, stopPublishingPlaybackQualitySummary = _a.stop;
        var previousState = this.state;
        var onState = function () {
            var state = _this.state;
            _this.emit(player_1.Player.Event.StateChanged, state);
            var stateChanged = {
                from: previousState,
                name: 'changed',
                playerStreamerSid: _this._streamerSid,
                timestamp: Date.now(),
                to: state,
                type: 'playback-state',
            };
            player_1.Player.telemetry.publish(stateChanged);
            previousState = state;
            if (state === player_1.Player.State.Buffering || state === player_1.Player.State.Playing) {
                startPublishingPlaybackQualitySummary();
            }
            else {
                stopPublishingPlaybackQualitySummary();
            }
            if (state === player_1.Player.State.Ended) {
                _this._release();
            }
        };
        Object.values(amazon_ivs_player_1.PlayerState).forEach(function (state) {
            return _this._vendorPlayer.addEventListener(state, onState);
        });
        var previousQuality = this.quality;
        var onQualityChanged = function () {
            var quality = _this.quality;
            _this.emit(player_1.Player.Event.QualityChanged, quality);
            var qualityChanged = {
                from: previousQuality,
                name: 'quality-changed',
                playerLiveLatency: _this._vendorPlayer.getLiveLatency(),
                playerPosition: _this._vendorPlayer.getPosition(),
                playerStreamerSid: _this._streamerSid,
                playerVolume: _this._vendorPlayer.getVolume(),
                timestamp: Date.now(),
                to: quality,
                type: 'playback-quality',
            };
            player_1.Player.telemetry.publish(qualityChanged);
            previousQuality = quality;
        };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.QUALITY_CHANGED, onQualityChanged);
        var previousDuration = this.duration;
        var onDurationChanged = function (duration) {
            _this.emit(player_1.Player.Event.DurationChanged, duration);
            var durationChanged = {
                from: previousDuration,
                name: 'duration-changed',
                playerLiveLatency: _this._vendorPlayer.getLiveLatency(),
                playerPosition: _this._vendorPlayer.getPosition(),
                playerStreamerSid: _this._streamerSid,
                playerVolume: _this._vendorPlayer.getVolume(),
                timestamp: Date.now(),
                to: duration,
                type: 'playback-quality',
            };
            player_1.Player.telemetry.publish(durationChanged);
            previousDuration = duration;
        };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.DURATION_CHANGED, onDurationChanged);
        var onTextMetadataCue = function (textCue) {
            _this.emit(player_1.Player.Event.TimedMetadataReceived, {
                metadata: textCue.text,
                time: textCue.startTime,
            });
            var timedMetadataReceived = {
                name: 'received',
                playerStreamerSid: _this._streamerSid,
                timedMetadataTime: textCue.startTime,
                timestamp: Date.now(),
                type: 'timed-metadata',
            };
            player_1.Player.telemetry.publish(timedMetadataReceived);
        };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.TEXT_METADATA_CUE, onTextMetadataCue);
        var onRebuffering = function () {
            _this.emit(player_1.Player.Event.Rebuffering);
            var rebuffering = {
                name: 'rebuffering',
                playerPosition: _this._vendorPlayer.getPosition(),
                playerState: _this._getState(),
                playerStreamerSid: _this._streamerSid,
                timestamp: Date.now(),
                type: 'playback',
            };
            player_1.Player.telemetry.publish(rebuffering);
        };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.REBUFFERING, onRebuffering);
        var onError = function (_a) {
            var code = _a.code, message = _a.message, source = _a.source, type = _a.type;
            _this._disconnect();
            var errorExplanation = code + " - " + message + " - " + source;
            var error = error_1.createError(IVS_ERRORS.get(type), message, errorExplanation);
            _this._emitPlaybackError(error);
        };
        if (!this._playbackUrlEventObserver) {
            this._playbackUrlEventObserver = new eventobservers_1.PlaybackUrlEventObserver(this._vendorPlayer, this._playbackUrl);
        }
        this._playbackUrlEventObserver.on(amazon_ivs_player_1.PlayerEventType.ERROR, onError);
        var onVolumeChanged = function (level) { return _this.emit(player_1.Player.Event.VolumeChanged, level); };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.VOLUME_CHANGED, onVolumeChanged);
        var onSeekCompleted = function (position) {
            _this.emit(player_1.Player.Event.SeekCompleted, position);
            var seekCompleted = {
                name: 'seek-completed',
                playerPosition: _this._vendorPlayer.getPosition(),
                playerState: _this._getState(),
                playerStreamerSid: _this._streamerSid,
                timestamp: Date.now(),
                type: 'playback',
            };
            player_1.Player.telemetry.publish(seekCompleted);
        };
        this._vendorPlayer.addEventListener(amazon_ivs_player_1.PlayerEventType.SEEK_COMPLETED, onSeekCompleted);
        return function () {
            stopPublishingPlaybackQualitySummary();
            Object.values(amazon_ivs_player_1.PlayerState).forEach(function (state) {
                return _this._vendorPlayer.removeEventListener(state, onState);
            });
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.QUALITY_CHANGED, onQualityChanged);
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.DURATION_CHANGED, onDurationChanged);
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.TEXT_METADATA_CUE, onTextMetadataCue);
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.REBUFFERING, onRebuffering);
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.VOLUME_CHANGED, onVolumeChanged);
            _this._vendorPlayer.removeEventListener(amazon_ivs_player_1.PlayerEventType.SEEK_COMPLETED, onSeekCompleted);
            if (_this._playbackUrlEventObserver) {
                _this._playbackUrlEventObserver.release();
            }
        };
    };
    return MediaPlayer;
}(player_1.Player));
exports.MediaPlayer = MediaPlayer;
//# sourceMappingURL=mediaplayer.js.map