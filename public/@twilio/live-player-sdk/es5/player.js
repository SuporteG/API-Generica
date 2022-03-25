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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.setIsPlayerSupported = exports.setDerivedPlayer = void 0;
// TODO(mmalavalli): Ensure only the version is exported, and not the rest of the package.json fields.
var sdkVersion = require('../package.json').version;
var events_1 = require("events");
var grant_1 = require("./grant");
var eventobservers_1 = require("./eventobservers");
var error_1 = require("./error");
var TelemetryExports = require("./telemetry");
// NOTE(mmalavalli): This represents the class derived from Player that
// actually consumes the vendor sdk. For unit tests, this can be set to
// a mock class using setDerivedPlayer().
var DerivedPlayer;
/**
 * @private
 */
function setDerivedPlayer(Class) {
    if (typeof DerivedPlayer === 'undefined') {
        DerivedPlayer = Class;
    }
}
exports.setDerivedPlayer = setDerivedPlayer;
// NOTE(csantos): Represents whether HighLatencyReduction is enabled
// for all Player instances.
var isHighLatencyReductionEnabled = true;
// NOTE(mmalavalli): This represents whether the browser is supported
// by the vendor sdk. For unit tests, this can be set to a mock value
// using setIsPlayerSupported().
var isPlayerSupported;
/**
 * @private
 */
function setIsPlayerSupported(value) {
    if (typeof isPlayerSupported === 'undefined') {
        isPlayerSupported = value;
    }
}
exports.setIsPlayerSupported = setIsPlayerSupported;
// NOTE(mmalavalli): This represents the Telemetry logger for all the
// Player instances.
var telemetry = new TelemetryExports.Telemetry();
/**
 * A [[Player]] controls the playback of a live stream.
 */
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(playbackUrl, streamerSid, createVendorPlayer, options) {
        var _this = _super.call(this) || this;
        _this._onVideoSizeChanged = function () {
            _this.emit(Player.Event.VideoSizeChanged, _this.videoSize);
            var videoSizeChanged = {
                from: _this._previousVideoSize,
                name: 'video-size-changed',
                playerLiveLatency: _this._vendorPlayer.getLiveLatency(),
                playerPosition: _this._vendorPlayer.getPosition(),
                playerStreamerSid: _this._streamerSid,
                playerVolume: _this._vendorPlayer.getVolume(),
                timestamp: Date.now(),
                to: _this.videoSize,
                type: 'playback-quality',
            };
            telemetry.publish(videoSizeChanged);
            _this._previousVideoSize = __assign({}, _this.videoSize);
        };
        var playerWasmAssetsPath = options.playerWasmAssetsPath, _a = options.rebufferToLive, rebufferToLive = _a === void 0 ? true : _a, requestCredentials = options.requestCredentials, vendorPlayerVersion = options.vendorPlayerVersion;
        var suffix = vendorPlayerVersion.replace(/\./g, '-');
        _this._disconnected = false;
        _this._playbackUrl = playbackUrl;
        _this._streamerSid = streamerSid;
        _this._vendorPlayer = createVendorPlayer({
            wasmBinary: playerWasmAssetsPath + "/twilio-live-player-wasmworker-" + suffix + ".min.wasm",
            wasmWorker: playerWasmAssetsPath + "/twilio-live-player-wasmworker-" + suffix + ".min.js",
        });
        // NOTE(mmalavalli): Configuring the default HTMLVideoElement for inline
        // playback on iOS Safari.
        var videoElement = _this._vendorPlayer.getHTMLVideoElement();
        videoElement.playsInline = true;
        _this._vendorPlayer.setLogLevel(Player.logLevel);
        vendorPlayers.add(_this._vendorPlayer);
        _this._vendorPlayer.setRebufferToLive(rebufferToLive);
        _this.videoElement.addEventListener('resize', _this._onVideoSizeChanged);
        _this._previousVideoSize = __assign({}, _this.videoSize);
        _this._stopRemittingVendorPlayerEvents = _this._reemitVendorPlayerEvents();
        if (requestCredentials) {
            _this._vendorPlayer.setRequestCredentials(requestCredentials);
        }
        _this._vendorPlayer.load(playbackUrl);
        _this._liveLatencyEventObserver = new eventobservers_1.LiveLatencyEventObserver(_this._vendorPlayer, telemetry, isHighLatencyReductionEnabled);
        _this._playerPositionObserver = new eventobservers_1.PlayerPositionObserver(_this._vendorPlayer, telemetry);
        _this._playerPositionObserver.once(eventobservers_1.PlayerPositionObserver.Event.PlayerPositionSame, function () { return _this._disconnect(); });
        _this._handleLiveLatencyEvents();
        return _this;
    }
    Object.defineProperty(Player, "isHighLatencyReductionEnabled", {
        /**
         * Whether high latency reduction is enabled for all Player instances.
         * This is set to `true` by default.
         * When set to `true`, the Player SDK will periodiocally inspect `player.liveLatency`
         * and perform the following when high latency is observed:
         *
         *   1. If the live latency is between 3 and 5 seconds, the Player will increase
         * the playback rate to a value that should not be perceptible to a user.
         * The increased playback rate will allow the Player to catch up to the live source,
         * and will be reverted once the live latency drops below 3 seconds.
         * Application of this strategy may result in audio pitch distortion.
         *
         *   2. If the live latency is greater than or equal to 5 seconds,
         * the Player will seek ahead to near the end of the Player's buffered content.
         * The user will notice skips in the media content when this strategy is applied.
         */
        get: function () {
            return isHighLatencyReductionEnabled;
        },
        /**
         * Sets whether high latency reduction is enabled for all Player instances.
         * When set to `true`, the Player SDK will periodiocally inspect `player.liveLatency`
         * and perform the following when high latency is observed:
         *
         *   1. If the live latency is between 3 and 5 seconds, the Player will increase
         * the playback rate to a value that should not be perceptible to a user.
         * The increased playback rate will allow the Player to catch up to the live source,
         * and will be reverted once the live latency drops below 3 seconds.
         * Application of this strategy may result in audio pitch distortion.
         *
         *   2. If the live latency is greater than or equal to 5 seconds,
         * the Player will seek ahead to near the end of the Player's buffered content.
         * The user will notice skips in the media content when this strategy is applied.
         */
        set: function (isEnabled) {
            isHighLatencyReductionEnabled = isEnabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player, "isSupported", {
        /**
         * Whether the SDK supports the browser. The SDK only supports
         * browsers which are capable of running WebAssembly (WASM).
         */
        get: function () {
            return isPlayerSupported;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player, "logLevel", {
        /**
         * The SDK's log level.
         */
        get: function () {
            return logLevel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player, "telemetry", {
        /**
         * A [[Telemetry]] provides facilities for subscribing to event
         * and metric data collected by the SDK.
         */
        get: function () {
            return telemetry;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player, "version", {
        /**
         * The SDK version.
         */
        get: function () {
            return sdkVersion;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Connect to a live stream.
     * @throws [[Player.Error]] or TypeError
     * @param token The access token used to connect to the live stream
     * @param options The options for creating a [[Player]]
     */
    Player.connect = function (token, options) {
        return __awaiter(this, void 0, void 0, function () {
            var connecting, _a, playbackUrl, playerStreamerSid, requestCredentials, connected, connectionError;
            return __generator(this, function (_b) {
                connecting = {
                    name: 'connecting',
                    playerStreamerSid: '',
                    timestamp: Date.now(),
                    type: 'connection',
                };
                telemetry.publish(connecting);
                try {
                    _a = grant_1.getPlaybackGrant(token), playbackUrl = _a.playbackUrl, playerStreamerSid = _a.streamerSid, requestCredentials = _a.requestCredentials;
                    connected = {
                        name: 'connected',
                        playerStreamerSid: playerStreamerSid,
                        requestCredentials: requestCredentials,
                        timestamp: Date.now(),
                        type: 'connection',
                    };
                    telemetry.publish(connected);
                    return [2 /*return*/, new DerivedPlayer(playbackUrl, playerStreamerSid, __assign(__assign({}, options), { requestCredentials: requestCredentials }))];
                }
                catch (error) {
                    connectionError = {
                        name: 'error',
                        playerError: error,
                        playerStreamerSid: '',
                        timestamp: Date.now(),
                        type: 'connection',
                    };
                    telemetry.publish(connectionError);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Set the SDK's log level.
     */
    Player.setLogLevel = function (level) {
        logLevel = level;
        var vendorPlayerLogLevel = level === Player.LogLevel.Off
            ? Player.LogLevel.Error : level;
        vendorPlayers.forEach(function (vendorPlayer) {
            return vendorPlayer.setLogLevel(vendorPlayerLogLevel);
        });
    };
    Object.defineProperty(Player.prototype, "availableQualities", {
        /**
         * Array of available [[Quality]] objects from the loaded source, or empty if
         * none are currently available. The qualities will be available after the
         * [[Player]] transitions to the [[State.Ready]] state. Note that this set will
         * contain only qualities capable of being played on the current device and not
         * all those present in the source stream.
         */
        get: function () {
            return this._vendorPlayer.getQualities().map(function (_a) {
                var bitrate = _a.bitrate, codecs = _a.codecs, height = _a.height, name = _a.name, width = _a.width;
                return ({
                    bitrate: bitrate,
                    codecs: codecs,
                    height: height,
                    name: name,
                    width: width,
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "duration", {
        /**
         * The playback duration in seconds. The duration is `Infinity`
         * if the media is a live stream. A [[Player.Event.DurationChanged]] is emitted
         * whenever the playback duration changes.
         */
        get: function () {
            return this._vendorPlayer.getDuration();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "isMuted", {
        /**
         * Whether the [[Player]] is muted. You can also mute the [[Player]] by setting
         * it to true, or unmute by setting it to false. Updating this property has no
         * effect once the [[Player]] transitions to the [[Player.State.Ended]] state.
         */
        get: function () {
            return this._vendorPlayer.isMuted();
        },
        set: function (shouldMute) {
            this._vendorPlayer.setMuted(shouldMute);
            var playback = {
                name: shouldMute ? 'muted' : 'unmuted',
                playerPosition: this._vendorPlayer.getPosition(),
                playerState: this._getState(),
                playerStreamerSid: this._streamerSid,
                timestamp: Date.now(),
                type: 'playback',
            };
            telemetry.publish(playback);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "liveLatency", {
        /**
         * For a live stream, the latency to the source in seconds.
         */
        get: function () {
            return this._vendorPlayer.getLiveLatency();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "position", {
        /**
         * The playback position in seconds.
         */
        get: function () {
            return this._vendorPlayer.getPosition();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "quality", {
        /**
         * The current quality of the [[Player]]'s live stream. You
         * can also change the quality of the live stream by setting
         * a new [[Player.Quality]] from [[Player.availableQualities]].
         * The [[Player]] will emit a [[Player.Event.QualityChanged]] event.
         */
        get: function () {
            var _a = this._vendorPlayer.getQuality(), bitrate = _a.bitrate, codecs = _a.codecs, height = _a.height, name = _a.name, width = _a.width;
            return {
                bitrate: bitrate,
                codecs: codecs,
                height: height,
                name: name,
                width: width,
            };
        },
        set: function (newQuality) {
            var vendorPlayerQuality = this._vendorPlayer.getQualities().find(function (quality) {
                return quality.name === newQuality.name;
            });
            if (vendorPlayerQuality) {
                var oldQuality = this.quality;
                this._vendorPlayer.setQuality(vendorPlayerQuality);
                var qualitySet = {
                    from: oldQuality,
                    name: 'quality-set',
                    playerLiveLatency: this._vendorPlayer.getLiveLatency(),
                    playerPosition: this._vendorPlayer.getPosition(),
                    playerStreamerSid: this._streamerSid,
                    playerVolume: this._vendorPlayer.getVolume(),
                    timestamp: Date.now(),
                    to: newQuality,
                    type: 'playback-quality',
                };
                Player.telemetry.publish(qualitySet);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "state", {
        /**
         * The [[Player]] state. Soon after a successful connection to a live stream,
         * the [[Player]] is in the [[Player.State.Idle]] state while it is preparing
         * the playback. Then it transitions to the [[Player.State.Ready]] state.
         */
        get: function () {
            return this._disconnected ? Player.State.Ended : this._getState();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "stats", {
        /**
         * The media statistics of the [[Player]]'s live stream.
         */
        get: function () {
            return {
                videoBitrate: this._vendorPlayer.getVideoBitRate() || 0,
                videoFramesDecoded: this._vendorPlayer.getDecodedFrames() || 0,
                videoFramesDropped: this._vendorPlayer.getDroppedFrames() || 0,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "streamerSid", {
        /**
         * The SID of the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
         * which the [[Player]] is connected to.
         */
        get: function () {
            return this._streamerSid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "videoElement", {
        /**
         * The HTMLVideoElement used to play back the live stream.
         */
        get: function () {
            return this._vendorPlayer.getHTMLVideoElement();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "videoSize", {
        /**
         * The [[Player]]'s video size.
         */
        get: function () {
            var _a = this.videoElement, height = _a.videoHeight, width = _a.videoWidth;
            return { height: height, width: width };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "volume", {
        /**
         * The [[Player]]'s volume level in the range [0.0, 1.0].
         */
        get: function () {
            return this._vendorPlayer.getVolume();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set an HTMLVideoElement to play back the live stream. For iOS browsers,
     * please enable inline playback before attaching the HTMLVideoElement.
     * @example
     * ```
     * const videoElement = document.querySelector('div#container > video');
     * videoElement.playsInline = true;
     * player.attach(videoElement);
     * ```
     * @param videoElement The HTMLVideoElement to be used to play back the live stream
     */
    Player.prototype.attach = function (videoElement) {
        this.videoElement.removeEventListener('resize', this._onVideoSizeChanged);
        this._vendorPlayer.attachHTMLVideoElement(videoElement);
        videoElement.addEventListener('resize', this._onVideoSizeChanged);
        return this;
    };
    /**
     * Disconnect from the live stream. The [[Player]] will transition to the terminal
     * [[Player.State.Ended]] state, release all resources related to the playback of the
     * live stream, and stop emitting events.
     */
    Player.prototype.disconnect = function () {
        if (!this._disconnect()) {
            return this;
        }
        var disconnected = {
            name: 'disconnected',
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            type: 'connection',
        };
        telemetry.publish(disconnected);
        return this;
    };
    /**
     * Pause the [[Player]]'s live stream. The [[Player]] transitions
     * to the [[Player.State.Idle]] state.
     */
    Player.prototype.pause = function () {
        this._vendorPlayer.pause();
        var paused = {
            name: 'paused',
            playerPosition: this._vendorPlayer.getPosition(),
            playerState: this._getState(),
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            type: 'playback',
        };
        telemetry.publish(paused);
        return this;
    };
    /**
     * Start the playback of the [[Player]]'s live stream. The [[Player]]
     * may transition to the [[Player.State.Buffering]] state if it is buffering
     * media for playback, and will finally transition to the [[Player.State.Playing]]
     * state.
     *
     * Calling this method before [[Player.state]] transitions to [[Player.State.Ready]]
     * will not have any effect.
     */
    Player.prototype.play = function () {
        this._vendorPlayer.play();
        var played = {
            name: 'played',
            playerPosition: this._vendorPlayer.getPosition(),
            playerState: this._getState(),
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            type: 'playback',
        };
        telemetry.publish(played);
        return this;
    };
    /**
     * Instruct the Player to seek to a specified time in the stream and begins
     * playing media in that position. The player state might change to buffering
     * if there is not enough buffered content in the specified position. This method is
     * asynchronous and a [[Player.Event.SeekCompleted]] is emitted upon completion.
     * This is only supported for recorded media and will emit a [[Player.Error]] if invoked on a live media.
     * @throws [[Player.Error]]
     * @param position
     */
    Player.prototype.seekTo = function (position) {
        // NOTE(csantos): We only support seeking for VOD/Recorded media.
        // A media is considered VOD (Video on Demand) if the playlist is tagged as VOD.
        // If VOD tag exists, the player duration is Finite, otherwise Infinity.
        var duration = this._vendorPlayer.getDuration();
        var isVOD = typeof duration === 'number' && isFinite(duration) && duration > 0;
        if (!isVOD) {
            var error = new Player.Error.PlaybackNotSupportedError();
            this._emitPlaybackError(error);
            throw error;
        }
        if (position < 0 || position > this._vendorPlayer.getDuration() || typeof position !== 'number') {
            var error = new Player.Error.PlaybackInvalidParameterError('position must be in the range [0, player.duration]');
            this._emitPlaybackError(error);
            throw error;
        }
        if (position === this._vendorPlayer.getDuration()) {
            // NOTE(csantos): Move near the end to get the ended event
            position = this._vendorPlayer.getDuration() - 1;
        }
        var currentPosition = this._vendorPlayer.getPosition();
        this._vendorPlayer.seekTo(position);
        var seekToData = {
            from: currentPosition,
            name: 'seek-to',
            playerPosition: this._vendorPlayer.getPosition(),
            playerState: this._getState(),
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            to: position,
            type: 'playback',
        };
        telemetry.publish(seekToData);
        return this;
    };
    /**
     * Set the [[Player]]'s volume level in the range [0.0, 1.0]. The [[Player.volume]]
     * property will be updated asynchronously and a [[Player.Event.VolumeChanged]] is emitted
     * with the updated volume. A [[Player.Error]] will be emitted for any invalid parameters.
     * @throws [[Player.Error]]
     * @param level
     */
    Player.prototype.setVolume = function (level) {
        if (level < 0 || level > 1 || typeof level !== 'number') {
            var error = new Player.Error.PlaybackInvalidParameterError('Volume must be in the range [0, 1]');
            this._emitPlaybackError(error);
            throw error;
        }
        var previousLevel = this._vendorPlayer.getVolume();
        this._vendorPlayer.setVolume(level);
        var volumeSet = {
            from: previousLevel,
            name: 'volume-set',
            playerPosition: this._vendorPlayer.getPosition(),
            playerState: this._getState(),
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            to: level,
            type: 'playback',
        };
        telemetry.publish(volumeSet);
        return this;
    };
    Player.prototype._disconnect = function () {
        if (this._disconnected) {
            return false;
        }
        this._disconnected = true;
        this.emit(Player.Event.StateChanged, this.state);
        this._release();
        return true;
    };
    Player.prototype._emitPlaybackError = function (error) {
        this.emit(Player.Event.Error, error);
        var playbackError = {
            name: 'error',
            playerError: error,
            playerPosition: this._vendorPlayer.getPosition(),
            playerState: this._getState(),
            playerStreamerSid: this._streamerSid,
            timestamp: Date.now(),
            type: 'playback',
        };
        telemetry.publish(playbackError);
        return this;
    };
    Player.prototype._release = function () {
        this._liveLatencyEventObserver.release();
        this._playerPositionObserver.release();
        this.videoElement.removeEventListener('resize', this._onVideoSizeChanged);
        this._stopRemittingVendorPlayerEvents();
        this._vendorPlayer.delete();
        vendorPlayers.delete(this._vendorPlayer);
        return this;
    };
    Player.prototype._handleLiveLatencyEvents = function () {
        var _this = this;
        var getData = function (name) { return ({
            name: name,
            playerLiveLatency: _this._vendorPlayer.getLiveLatency(),
            playerPosition: _this._vendorPlayer.getPosition(),
            playerStreamerSid: _this._streamerSid,
            playerVolume: _this._vendorPlayer.getVolume(),
            timestamp: Date.now(),
            type: 'playback-quality',
        }); };
        this._liveLatencyEventObserver.on(eventobservers_1.LiveLatencyEventObserver.Event.HighLatencyReductionReverted, function () { return telemetry.publish(getData('high-latency-reduction-reverted')); });
        this._liveLatencyEventObserver.on(eventobservers_1.LiveLatencyEventObserver.Event.IncreasePlaybackRate, function () { return telemetry.publish(getData('increase-playback-rate')); });
        this._liveLatencyEventObserver.on(eventobservers_1.LiveLatencyEventObserver.Event.SeekAhead, function () { return telemetry.publish(getData('seek-ahead')); });
    };
    return Player;
}(events_1.EventEmitter));
exports.Player = Player;
(function (Player) {
    /**
     * Description of an error that was encountered while connecting to
     * or playing back a live stream.
     */
    Player.Error = error_1.Error;
    /**
     * [[Player]] events.
     */
    var Event;
    (function (Event) {
        /**
         * The [[Player.duration]] property has changed.
         */
        Event["DurationChanged"] = "durationChanged";
        /**
         * The [[Player]] encountered an error while playing back the live stream.
         * The playback is stopped and the [[Player]] transitions to the [[Player.State.Ended]]
         * state.
         */
        Event["Error"] = "error";
        /**
         * The [[Player]]'s playback quality changed.
         */
        Event["QualityChanged"] = "qualityChanged";
        /**
         * The [[Player]] is rebuffering from a previous [[State.Playing]] state.
         */
        Event["Rebuffering"] = "rebuffering";
        /**
         * The player seeked to a given position (as requested by [[Player.seekTo]]).
         */
        Event["SeekCompleted"] = "seekCompleted";
        /**
         * The [[Player]]'s state changed.
         */
        Event["StateChanged"] = "stateChanged";
        /**
         * The [[Player]] received a [[TimedMetadata]] in the live stream.
         */
        Event["TimedMetadataReceived"] = "timedMetadataReceived";
        /**
         * The [[Player]]'s video size changed.
         */
        Event["VideoSizeChanged"] = "videoSizeChanged";
        /**
         * The [[Player]]'s volume level changed.
         */
        Event["VolumeChanged"] = "volumeChanged";
    })(Event = Player.Event || (Player.Event = {}));
    /**
     * Available log levels for the [[Player]].
     */
    var LogLevel;
    (function (LogLevel) {
        LogLevel["Debug"] = "debug";
        LogLevel["Error"] = "error";
        LogLevel["Info"] = "info";
        LogLevel["Off"] = "off";
        LogLevel["Warn"] = "warn";
    })(LogLevel = Player.LogLevel || (Player.LogLevel = {}));
    /**
     * [[Player]] states.
     */
    var State;
    (function (State) {
        /**
         * The [[Player]] is buffering.
         */
        State["Buffering"] = "buffering";
        /**
         * The [[Player]] has ended the playback of the live stream.
         */
        State["Ended"] = "ended";
        /**
         * The [[Player]] is idle.
         */
        State["Idle"] = "idle";
        /**
         * The [[Player]] is playing back the live stream.
         */
        State["Playing"] = "playing";
        /**
         * The [[Player]] is ready to play back the live stream.
         */
        State["Ready"] = "ready";
    })(State = Player.State || (Player.State = {}));
    /**
     * A [[Telemetry]] provides facilities for subscribing to event
     * and metric data published by the SDK.
     */
    Player.Telemetry = TelemetryExports.Telemetry;
})(Player = exports.Player || (exports.Player = {}));
exports.Player = Player;
// NOTE(mmalavalli): This represents the current log level of the SDK
// and is accessed by Player.logLevel and set by Player.setLogLevel().
var logLevel = Player.LogLevel.Error;
// NOTE(mmalavalli): This contains the VendorPlayer instances created so
// far. Whenever Player.logLevel is updated, the log levels of the VendorPlayer
// instances are updated as well.
var vendorPlayers = new Set();
//# sourceMappingURL=player.js.map