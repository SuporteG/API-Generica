declare const globalScope: Window & typeof globalThis;
/**
 * Description of an error that was encountered while connecting to
 * or playing back a live stream.
 */
export declare class Error extends globalScope.Error {
    private readonly _code;
    private readonly _explanation?;
    private readonly _message;
    /**
     * @private
     */
    constructor(code: Error.ErrorCode, message: string, explanation?: string);
    /**
     * A code representing the error.
     */
    get code(): Error.ErrorCode;
    /**
     * A message providing more details about the error.
     */
    get explanation(): string | undefined;
    /**
     * A message describing the error.
     */
    get message(): string;
    /**
     * @private
     */
    toJSON(): {
        code: Error.ErrorCode;
        explanation?: string;
        message: string;
    };
}
export declare namespace Error {
    /**
     * Twilio was unable to validate your Access Token
     */
    class AccessTokenInvalidError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * An error occurred playing back media content
     */
    class PlaybackMediaError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * A network resource is not authorized
     */
    class PlaybackAuthorizationError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * Data or input is invalid
     */
    class PlaybackInvalidDataError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * A method parameter is invalid
     */
    class PlaybackInvalidParameterError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * The Player or an internal object is in an invalid state
     */
    class PlaybackInvalidStateError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * A network error occurred
     */
    class PlaybackNetworkError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * A network I/O error occurred
     */
    class PlaybackNetworkIOError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * The stream is not available
     */
    class PlaybackStreamNotAvailableError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * The current-viewers limit was reached
     */
    class PlaybackTooManyStreamingRequestsError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * A method or feature is not supported
     */
    class PlaybackNotSupportedError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * There is no source for the Player to play
     */
    class PlaybackNoSourceError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    /**
     * The Player timed out performing an operation
     */
    class PlaybackTimeoutError extends Error {
        /**
         * @private
         */
        constructor(explanation?: string);
    }
    enum ErrorCode {
        /**
         * Twilio was unable to validate your Access Token
         */
        ACCESS_TOKEN_INVALID = 20101,
        /**
         * An error occurred playing back media content
         */
        PLAYBACK_MEDIA = 56000,
        /**
         * A network resource is not authorized
         */
        PLAYBACK_AUTHORIZATION = 56001,
        /**
         * Data or input is invalid
         */
        PLAYBACK_INVALID_DATA = 56002,
        /**
         * A method parameter is invalid
         */
        PLAYBACK_INVALID_PARAMETER = 56003,
        /**
         * The Player or an internal object is in an invalid state
         */
        PLAYBACK_INVALID_STATE = 56004,
        /**
         * A network error occurred
         */
        PLAYBACK_NETWORK = 56005,
        /**
         * A network I/O error occurred
         */
        PLAYBACK_NETWORK_IO = 56006,
        /**
         * The stream is not available
         */
        PLAYBACK_STREAM_NOT_AVAILABLE = 56007,
        /**
         * The current-viewers limit was reached
         */
        PLAYBACK_TOO_MANY_STREAMING_REQUESTS = 56008,
        /**
         * A method or feature is not supported
         */
        PLAYBACK_NOT_SUPPORTED = 56009,
        /**
         * There is no source for the Player to play
         */
        PLAYBACK_NO_SOURCE = 56010,
        /**
         * The Player timed out performing an operation
         */
        PLAYBACK_TIMEOUT = 56011
    }
}
/**
 * @private
 */
export declare function createError(code: Error.ErrorCode, message?: string, explanation?: string): Error;
export {};
