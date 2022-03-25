/// <reference types="node" />
import { EventEmitter } from 'events';
import { RequestCredentials } from './types';
import { Error as PlayerError } from './error';
import * as TelemetryExports from './telemetry';
export interface VendorPlayer {
    addEventListener: (event: any, callback: (...args: any[]) => void) => void;
    attachHTMLVideoElement: (videoElement: HTMLVideoElement) => void;
    delete: () => void;
    getBufferDuration: () => number;
    getDecodedFrames: () => number;
    getDroppedFrames: () => number;
    getDuration: () => number;
    getHTMLVideoElement: () => HTMLVideoElement;
    getLiveLatency: () => number;
    getPlaybackRate: () => number;
    getPosition: () => number;
    getQualities: () => VendorPlayerQuality[];
    getQuality: () => VendorPlayerQuality;
    getState: () => string;
    getVideoBitRate: () => number;
    getVolume: () => number;
    isMuted: () => boolean;
    load: (playbackUrl: string) => void;
    pause: () => void;
    play: () => void;
    removeEventListener: (event: any, callback: (...args: any[]) => void) => void;
    seekTo: (time: number) => void;
    setLogLevel: (level: any) => void;
    setMuted: (mute: boolean) => void;
    setPlaybackRate: (rate: number) => void;
    setQuality: (quality: VendorPlayerQuality) => void;
    setRebufferToLive: (rebufferToLive: boolean) => void;
    setRequestCredentials: (requestCredentials: RequestCredentials) => void;
    setVolume: (level: number) => void;
}
interface VendorPlayerConfig {
    wasmBinary: string;
    wasmWorker: string;
}
interface VendorPlayerQuality {
    bitrate: number;
    codecs: string;
    height: number;
    name: string;
    width: number;
}
/**
 * @private
 */
export declare function setDerivedPlayer(Class: any): void;
/**
 * @private
 */
export declare function setIsPlayerSupported(value: boolean): void;
export declare interface Player {
    /**
     * The [[Player.duration]] property has changed.
     * @param event [[Player.Event.DurationChanged]]
     * @param listener A callback that has the updated [[Player.duration]], in seconds.
     */
    on(event: Player.Event.DurationChanged, listener: (duration: number) => void): this;
    /**
     * The [[Player]] encountered an error while playing back the live stream.
     * @param event [[Player.Event.Error]]
     * @param listener A callback that has the [[Player.Error]]
     */
    on(event: Player.Event.Error, listener: (error: Player.Error) => void): this;
    /**
     * The [[Player]]'s playback quality changed.
     * @param event [[Player.Event.QualityChanged]]
     * @param listener A callback that has the updated [[Player.Quality]]
     */
    on(event: Player.Event.QualityChanged, listener: (quality: Player.Quality) => void): this;
    /**
     * The [[Player]] is rebuffering from a previous [[Player.State.Playing]] state.
     * @param event [[Player.Event.Rebuffering]]
     * @param listener A callback called when the event is emitted
     */
    on(event: Player.Event.Rebuffering, listener: () => void): this;
    /**
     * The player seeked to a given position (as requested by [[Player.seekTo]]).
     * @param event [[Player.Event.SeekCompleted]]
     * @param listener A callback that has the position where the seek completed, in seconds.
     */
    on(event: Player.Event.SeekCompleted, listener: (position: number) => void): this;
    /**
     * The [[Player]]'s state changed.
     * @param event [[Player.Event.StateChanged]]
     * @param listener A callback that has the new [[Player.State]]
     */
    on(event: Player.Event.StateChanged, listener: (state: Player.State) => void): this;
    /**
     * The [[Player]] received a timed metadata from the live stream source.
     * @param event [[Player.Event.TimedMetadataReceived]]
     * @param listener A callback that has the [[Player.TimedMetadata]]
     */
    on(event: Player.Event.TimedMetadataReceived, listener: (metadata: Player.TimedMetadata) => void): this;
    /**
     * The [[Player]]'s video size changed.
     * @param event [[Player.Event.VideoSizeChanged]]
     * @param listener A callback that has the new [[Player.VideoDimensions]]
     */
    on(event: Player.Event.VideoSizeChanged, listener: (videoSize: Player.VideoDimensions) => void): this;
    /**
     * The [[Player]]'s volume level changed.
     * @param event [[Player.Event.VolumeChanged]]
     * @param listener A callback that has the new volume level
     */
    on(event: Player.Event.VolumeChanged, listener: (level: number) => void): this;
}
/**
 * A [[Player]] controls the playback of a live stream.
 */
export declare abstract class Player extends EventEmitter {
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
    static get isHighLatencyReductionEnabled(): boolean;
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
    static set isHighLatencyReductionEnabled(isEnabled: boolean);
    /**
     * Whether the SDK supports the browser. The SDK only supports
     * browsers which are capable of running WebAssembly (WASM).
     */
    static get isSupported(): boolean;
    /**
     * The SDK's log level.
     */
    static get logLevel(): Player.LogLevel;
    /**
     * A [[Telemetry]] provides facilities for subscribing to event
     * and metric data collected by the SDK.
     */
    static get telemetry(): Player.Telemetry;
    /**
     * The SDK version.
     */
    static get version(): string;
    /**
     * Connect to a live stream.
     * @throws [[Player.Error]] or TypeError
     * @param token The access token used to connect to the live stream
     * @param options The options for creating a [[Player]]
     */
    static connect(token: string, options: Player.Options): Promise<Player>;
    /**
     * Set the SDK's log level.
     */
    static setLogLevel(level: Player.LogLevel): void;
    protected readonly _playbackUrl: string;
    protected readonly _streamerSid: string;
    protected readonly _vendorPlayer: VendorPlayer;
    private _disconnected;
    private _liveLatencyEventObserver;
    private _playerPositionObserver;
    private _previousVideoSize;
    private readonly _stopRemittingVendorPlayerEvents;
    protected constructor(playbackUrl: string, streamerSid: string, createVendorPlayer: (config: VendorPlayerConfig) => VendorPlayer, options: Player.Options);
    /**
     * Array of available [[Quality]] objects from the loaded source, or empty if
     * none are currently available. The qualities will be available after the
     * [[Player]] transitions to the [[State.Ready]] state. Note that this set will
     * contain only qualities capable of being played on the current device and not
     * all those present in the source stream.
     */
    get availableQualities(): Player.Quality[];
    /**
     * The playback duration in seconds. The duration is `Infinity`
     * if the media is a live stream. A [[Player.Event.DurationChanged]] is emitted
     * whenever the playback duration changes.
     */
    get duration(): number;
    /**
     * Whether the [[Player]] is muted. You can also mute the [[Player]] by setting
     * it to true, or unmute by setting it to false. Updating this property has no
     * effect once the [[Player]] transitions to the [[Player.State.Ended]] state.
     */
    get isMuted(): boolean;
    set isMuted(shouldMute: boolean);
    /**
     * For a live stream, the latency to the source in seconds.
     */
    get liveLatency(): number;
    /**
     * The playback position in seconds.
     */
    get position(): number;
    /**
     * The current quality of the [[Player]]'s live stream. You
     * can also change the quality of the live stream by setting
     * a new [[Player.Quality]] from [[Player.availableQualities]].
     * The [[Player]] will emit a [[Player.Event.QualityChanged]] event.
     */
    get quality(): Player.Quality;
    set quality(newQuality: Player.Quality);
    /**
     * The [[Player]] state. Soon after a successful connection to a live stream,
     * the [[Player]] is in the [[Player.State.Idle]] state while it is preparing
     * the playback. Then it transitions to the [[Player.State.Ready]] state.
     */
    get state(): Player.State;
    /**
     * The media statistics of the [[Player]]'s live stream.
     */
    get stats(): Player.Stats;
    /**
     * The SID of the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
     * which the [[Player]] is connected to.
     */
    get streamerSid(): string;
    /**
     * The HTMLVideoElement used to play back the live stream.
     */
    get videoElement(): HTMLVideoElement;
    /**
     * The [[Player]]'s video size.
     */
    get videoSize(): Player.VideoDimensions;
    /**
     * The [[Player]]'s volume level in the range [0.0, 1.0].
     */
    get volume(): number;
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
    attach(videoElement: HTMLVideoElement): this;
    /**
     * Disconnect from the live stream. The [[Player]] will transition to the terminal
     * [[Player.State.Ended]] state, release all resources related to the playback of the
     * live stream, and stop emitting events.
     */
    disconnect(): this;
    /**
     * Pause the [[Player]]'s live stream. The [[Player]] transitions
     * to the [[Player.State.Idle]] state.
     */
    pause(): this;
    /**
     * Start the playback of the [[Player]]'s live stream. The [[Player]]
     * may transition to the [[Player.State.Buffering]] state if it is buffering
     * media for playback, and will finally transition to the [[Player.State.Playing]]
     * state.
     *
     * Calling this method before [[Player.state]] transitions to [[Player.State.Ready]]
     * will not have any effect.
     */
    play(): this;
    /**
     * Instruct the Player to seek to a specified time in the stream and begins
     * playing media in that position. The player state might change to buffering
     * if there is not enough buffered content in the specified position. This method is
     * asynchronous and a [[Player.Event.SeekCompleted]] is emitted upon completion.
     * This is only supported for recorded media and will emit a [[Player.Error]] if invoked on a live media.
     * @throws [[Player.Error]]
     * @param position
     */
    seekTo(position: number): this;
    /**
     * Set the [[Player]]'s volume level in the range [0.0, 1.0]. The [[Player.volume]]
     * property will be updated asynchronously and a [[Player.Event.VolumeChanged]] is emitted
     * with the updated volume. A [[Player.Error]] will be emitted for any invalid parameters.
     * @throws [[Player.Error]]
     * @param level
     */
    setVolume(level: number): this;
    protected _disconnect(): boolean;
    protected _emitPlaybackError(error: Player.Error): this;
    protected abstract _getState(): Player.State;
    protected abstract _reemitVendorPlayerEvents(): () => void;
    protected _release(): this;
    private _handleLiveLatencyEvents;
    private _onVideoSizeChanged;
}
export declare namespace Player {
    /**
     * Description of an error that was encountered while connecting to
     * or playing back a live stream.
     */
    export import Error = PlayerError;
    /**
     * [[Player]] events.
     */
    enum Event {
        /**
         * The [[Player.duration]] property has changed.
         */
        DurationChanged = "durationChanged",
        /**
         * The [[Player]] encountered an error while playing back the live stream.
         * The playback is stopped and the [[Player]] transitions to the [[Player.State.Ended]]
         * state.
         */
        Error = "error",
        /**
         * The [[Player]]'s playback quality changed.
         */
        QualityChanged = "qualityChanged",
        /**
         * The [[Player]] is rebuffering from a previous [[State.Playing]] state.
         */
        Rebuffering = "rebuffering",
        /**
         * The player seeked to a given position (as requested by [[Player.seekTo]]).
         */
        SeekCompleted = "seekCompleted",
        /**
         * The [[Player]]'s state changed.
         */
        StateChanged = "stateChanged",
        /**
         * The [[Player]] received a [[TimedMetadata]] in the live stream.
         */
        TimedMetadataReceived = "timedMetadataReceived",
        /**
         * The [[Player]]'s video size changed.
         */
        VideoSizeChanged = "videoSizeChanged",
        /**
         * The [[Player]]'s volume level changed.
         */
        VolumeChanged = "volumeChanged"
    }
    /**
     * Available log levels for the [[Player]].
     */
    enum LogLevel {
        Debug = "debug",
        Error = "error",
        Info = "info",
        Off = "off",
        Warn = "warn"
    }
    /**
     * [[Player]] options.
     */
    interface Options {
        /**
         * Absolute path of the hosted "twilio-live-player-wasmworker-x-y-z.min.js"
         * and "twilio-live-player-wasmworker-x-y-z.min.wasm" files, where x.y.z is
         * the version of the files.
         */
        playerWasmAssetsPath: string;
        /**
         * @private
         */
        rebufferToLive?: boolean;
        /**
         * @private
         */
        requestCredentials?: RequestCredentials;
        /**
         * @private
         */
        vendorPlayerVersion?: string;
    }
    /**
     * The quality statistics of a [[Player]]'s live stream.
     */
    interface Quality {
        /**
         * The bitrate of the live stream in bits per second (bps).
         */
        bitrate: number;
        /**
         * The codec string, both for audio and video tracks.
         * Example: "avc1.64002A,mp4a.40.2".
         */
        codecs: string;
        /**
         * The height of the video frames. It is set to 0 if unknown or not
         * applicable.
         */
        height: number;
        /**
         * The name of the [[Quality]] object.
         */
        name: string;
        /**
         * The width of the video frames. It is set to 0 if unknown or not
         * applicable.
         */
        width: number;
    }
    /**
     * [[Player]] states.
     */
    enum State {
        /**
         * The [[Player]] is buffering.
         */
        Buffering = "buffering",
        /**
         * The [[Player]] has ended the playback of the live stream.
         */
        Ended = "ended",
        /**
         * The [[Player]] is idle.
         */
        Idle = "idle",
        /**
         * The [[Player]] is playing back the live stream.
         */
        Playing = "playing",
        /**
         * The [[Player]] is ready to play back the live stream.
         */
        Ready = "ready"
    }
    /**
     * The statistics of the [[Player]]'s live stream.
     */
    interface Stats {
        /**
         * The bitrate of the video stream in bits per second (bps).
         */
        videoBitrate: number;
        /**
         * The number of video frames decoded.
         */
        videoFramesDecoded: number;
        /**
         * The number of video frames dropped.
         */
        videoFramesDropped: number;
    }
    /**
     * A [[Telemetry]] provides facilities for subscribing to event
     * and metric data published by the SDK.
     */
    export import Telemetry = TelemetryExports.Telemetry;
    /**
     * Timed metadata that is sent to the [[Player]] by the live stream source.
     */
    interface TimedMetadata {
        /**
         * The metadata string.
         */
        metadata: string;
        /**
         * The time when the metadata should be displayed.
         */
        time: number;
    }
    /**
     * Representation of the [[Player]]'s video size.
     */
    interface VideoDimensions {
        /**
         * Height of the video in pixels.
         */
        height: number;
        /**
         * Width of the video in pixels.
         */
        width: number;
    }
}
export {};
