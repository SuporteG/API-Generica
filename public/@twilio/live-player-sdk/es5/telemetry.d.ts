import { Player } from './player';
import { Error as PlayerError } from './error';
import { RequestCredentials } from './types';
/**
 * A [[Telemetry]] provides facilities for subscribing to event
 * and metric data collected by the SDK.
 */
export declare class Telemetry {
    private readonly _subscribersToPredicates;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    publish(data: Telemetry.Data): this;
    /**
     * @private
     */
    publishPeriodically(getData: () => Telemetry.Data, periodMs: number): {
        start: () => void;
        stop: () => void;
    };
    /**
     * Subscribe to the published [[Telemetry.Data]] objects that satisfy the given
     * [[Telemetry.Predicate]]. If no [[Telemetry.Predicate]] is provided, all
     * [[Telemetry.Data]] objects will be subscribed to.
     * @param subscriber Consumer of the published [[Telemetry.Data]] objects
     * @param predicate The filter applied to the published [[Telemetry.Data]] objects
     */
    subscribe(subscriber: Telemetry.Subscriber, predicate?: Telemetry.Predicate): this;
    /**
     * Unsubscribe from the [[Telemetry.Data]] objects.
     * @param subscriber Consumer of the published [[Telemetry.Data]] objects
     */
    unsubscribe(subscriber: Telemetry.Subscriber): this;
}
export declare namespace Telemetry {
    /**
     * The common properties in all [[Telemetry]] data reported by the SDK.
     */
    interface Data {
        /**
         * The name of the [[Telemetry]] data.
         */
        name: string;
        /**
         * The time when the data was reported.
         */
        timestamp: number;
        /**
         * The type of the [[Telemetry]] data.
         */
        type: string;
    }
    namespace Data {
        /**
         * A type of [[Telemetry]] data pertaining to the SDK's connection to
         * a live stream.
         */
        interface Connection extends Data {
            /**
             * The SID associated with the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
             * to which the [[Player]] reporting the data is connected. It is set
             * to empty if the [[Player]] is not connected to the PlayerStreamer.
             */
            playerStreamerSid: string;
            /**
             * The type is set to "connection".
             */
            type: 'connection';
        }
        namespace Connection {
            /**
             * [[Telemetry]] data indicating that a [[Player]] has connected
             * to a live stream.
             */
            interface Connected extends Connection {
                /**
                 * The name is set to "connected".
                 */
                name: 'connected';
                /**
                 * Indicates what cross-origin request policy was used for cross-site
                 * cookies during media playback.
                 */
                requestCredentials?: RequestCredentials;
            }
            /**
             * [[Telemetry]] data indicating that a [[Player]] is connecting
             * to a live stream.
             */
            interface Connecting extends Connection {
                /**
                 * The name is set to "connecting".
                 */
                name: 'connecting';
            }
            /**
             * [[Telemetry]] data indicating that a [[Player]] has disconnected
             * from a live stream.
             */
            interface Disconnected extends Connection {
                /**
                 * The name is set to "disconnected".
                 */
                name: 'disconnected';
            }
            /**
             * [[Telemetry]] data indicating that a [[Player]] experienced an error
             * while connecting to a live stream.
             */
            interface Error extends Connection {
                /**
                 * The name is set to "error".
                 */
                name: 'error';
                /**
                 * The [[Player.Error]] describing the error.
                 */
                playerError: PlayerError;
            }
        }
        /**
         * [[Telemetry]] data pertaining to media playback.
         */
        interface Playback extends Data {
            /**
             * The [[Player]] position at the time the data was reported.
             */
            playerPosition: number;
            /**
             * The [[Player]]'s state at the time the data was reported.
             */
            playerState: Player.State;
            /**
             * The SID associated with the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
             * to which the [[Player]] is connected.
             */
            playerStreamerSid: string;
            /**
             * The type is set to "playback".
             */
            type: 'playback';
        }
        namespace Playback {
            /**
             * [[Telemetry]] data indicating that a [[Player]] experienced an error
             * while playing back a live stream.
             */
            interface Error extends Playback {
                /**
                 * The name is set to "error".
                 */
                name: 'error';
                /**
                 * The [[Player.Error]] describing the error.
                 */
                playerError: PlayerError;
            }
            /**
             * [[Telemetry]] data indicated that the player has been muted.
             */
            interface Muted extends Playback {
                /**
                 * The name is set to "muted".
                 */
                name: 'muted';
            }
            /**
             * [[Telemetry]] data indicating that the Player has been paused.
             */
            interface Paused extends Playback {
                /**
                 * The name is set to "played".
                 */
                name: 'paused';
            }
            /**
             * [[Telemetry]] data indicating that the Player has been played.
             */
            interface Played extends Playback {
                /**
                 * The name is set to "played".
                 */
                name: 'played';
            }
            /**
             * [[Telemetry]] data indicating that the Player is rebuffering.
             */
            interface Rebuffering extends Playback {
                /**
                 * The name is set to "rebuffering".
                 */
                name: 'rebuffering';
            }
            /**
             * [[Telemetry]] data indicating that the [[Player]]
             * seeked to a given position (as requested by [[Player.seekTo]]).
             */
            interface SeekCompleted extends Playback {
                /**
                 * The name is set to "seek-completed".
                 */
                name: 'seek-completed';
            }
            /**
             * [[Telemetry]] data indicating that the Player started seeking to a specified position.
             */
            interface SeekTo extends Playback {
                /**
                 * The previous position of the [[Player]].
                 */
                from: number;
                /**
                 * The name is set to "seek-to".
                 */
                name: 'seek-to';
                /**
                 * The current position of the [[Player]].
                 */
                to: number;
            }
            /**
             * [[Telemetry]] data indicated that the player has been unmuted.
             */
            interface Unmuted extends Playback {
                /**
                 * The name is set to "unmuted".
                 */
                name: 'unmuted';
            }
            interface VolumeSet extends Playback {
                /**
                 * The previous volume of the [[Player]].
                 */
                from: number;
                /**
                 * The name is set to "volume-set".
                 */
                name: 'volume-set';
                /**
                 * The current volume of the [[Player]].
                 */
                to: number;
            }
        }
        interface PlaybackQuality extends Data {
            /**
             * The [[Player]] live latency (in seconds) at the time the data was reported.
             */
            playerLiveLatency: number;
            /**
             * The [[Player]] position at the time the data was reported.
             */
            playerPosition: number;
            /**
             * The SID associated with the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
             * to which the [[Player]] is connected.
             */
            playerStreamerSid: string;
            /**
             * The [[Player]]'s volume at the time the data was reported.
             */
            playerVolume: number;
            /**
             * The type is set to "playback-quality".
             */
            type: 'playback-quality';
        }
        namespace PlaybackQuality {
            /**
             * [[Telemetry]] data indicating that the [[Player]]'s
             * [[Player.duration]] changed.
             */
            interface DurationChanged extends PlaybackQuality {
                /**
                 * The previous [[Player.duration]].
                 */
                from: number;
                /**
                 * The name is set to "duration-changed".
                 */
                name: 'duration-changed';
                /**
                 * The current [[Player.duration]].
                 */
                to: number;
            }
            /**
             * [[Telemetry]] data indicating that the [[Player]]
             * applied a high latency reduction strategy.
             */
            interface HighLatencyReductionApplied extends PlaybackQuality {
                /**
                 * The name of the high latency reduction technique applied.
                 */
                name: 'increase-playback-rate' | 'seek-ahead';
            }
            /**
             * [[Telemetry]] data indicating that the [[Player]]
             * has reverted all high latency reduction strategies.
             */
            interface HighLatencyReductionReverted extends PlaybackQuality {
                /**
                 * The name is set to "high-latency-reduction-reverted"
                 */
                name: 'high-latency-reduction-reverted';
            }
            /**
             * [[Telemetry]] data indicating that the [[Player]]'s
             * [[Player.Quality]] changed.
             */
            interface QualityChanged extends PlaybackQuality {
                /**
                 * The previous [[Player.Quality]].
                 */
                from: Player.Quality;
                /**
                 * The name is set to "quality-changed".
                 */
                name: 'quality-changed';
                /**
                 * The current [[Player.Quality]].
                 */
                to: Player.Quality;
            }
            /**
             * [[Telemetry]] data indicating that the [[Player]]'s
             * [[Player.Quality]] has been set.
             */
            interface QualitySet extends PlaybackQuality {
                /**
                 * The previous [[Player.Quality]].
                 */
                from: Player.Quality;
                /**
                 * The name is set to "quality-set".
                 */
                name: 'quality-set';
                /**
                 * The current [[Player.Quality]].
                 */
                to: Player.Quality;
            }
            /**
             * [[Telemetry]] data summarizing the quality metrics of the
             * live stream playback. It is reported every three seconds
             * while the [[Player]] is in either the [[Player.State.Playing]]
             * or [[Player.State.Buffering]] states.
             */
            interface Summary extends PlaybackQuality {
                /**
                 * The name is set to "summary".
                 */
                name: 'summary';
                /**
                 * The snapshot of the [[Player]] stats at the time the data
                 * was reported.
                 */
                playerStats: Player.Stats;
            }
            /**
             * [[Telemetry]] data indicating that the live stream's playback
             * video dimensions changed.
             */
            interface VideoSizeChanged extends PlaybackQuality {
                /**
                 * The previous video dimensions.
                 */
                from: Player.VideoDimensions;
                /**
                 * The name is set to "video-size-changed".
                 */
                name: 'video-size-changed';
                /**
                 * The current video dimensions.
                 */
                to: Player.VideoDimensions;
            }
        }
        /**
         * [[Telemetry]] data pertaining to the media playback state.
         */
        interface PlaybackState extends Data {
            /**
             * The SID associated with the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
             * to which the [[Player]] is connected.
             */
            playerStreamerSid: string;
            /**
             * The type is set to "playback-state".
             */
            type: 'playback-state';
        }
        namespace PlaybackState {
            /**
             * [[Telemetry]] data indicating the [[Player]]'s state changed.
             */
            interface Changed extends PlaybackState {
                /**
                 * The previous [[Player]] state.
                 */
                from: Player.State;
                /**
                 * The name is set to "changed".
                 */
                name: 'changed';
                /**
                 * The current [[Player]] state.
                 */
                to: Player.State;
            }
        }
        /**
         * [[Telemetry]] data pertaining to [[Player.TimedMetadata]].
         */
        interface TimedMetadataTelemetry extends Data {
            /**
             * The SID associated with the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
             * to which the [[Player]] is connected.
             */
            playerStreamerSid: string;
            /**
             * The type is set to "timed-metadata".
             */
            type: 'timed-metadata';
        }
        namespace TimedMetadataTelemetry {
            /**
             * [[Telemetry]] data indicating that a [[Player.TimedMetadata]] was received.
             */
            interface Received extends TimedMetadataTelemetry {
                /**
                 * The name is set to "received".
                 */
                name: 'received';
                /**
                 * The time in the stream that the [[Player.TimedMetadata]] was inserted.
                 */
                timedMetadataTime: number;
            }
        }
    }
    /**
     * A callback that determines if a published [[Data]] object should be
     * consumed by a [[Subscriber]].
     */
    type Predicate = (data: Data) => boolean;
    /**
     * A callback that consumes published [[Data]] objects.
     */
    type Subscriber = (data: Data) => void;
}
