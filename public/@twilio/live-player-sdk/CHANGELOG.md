1.0.2 (January 27, 2022)
========================

Bug Fixes
---------

- Fixed stuttering when playing a stream from a source media playlist.
- Fixed a bug where a loaded stream could play without the play method being called, during a network reconnect.
- Improved how the player recovers from video decode and playlist network errors.


1.0.1 (November 4, 2021)
========================

Changes
-------

- The Player's default HTMLVideoElement is now configured for inline playback on iOS
  browsers. If you want to attach your own HTMLVideoElement to the Player, then we
  strongly recommend that you do the same as shown below. (VIDEO-7515)
  
  ```ts
  const videoElement = document.querySelector('div#container > video');
  videoElement.playsInline = true;
  player.attach(videoElement);
  ```

1.0.0 (October 19, 2021)
========================

Changes
-------

- The Twilio Live Player SDK is now generally available! Please check out the following documentation:
  - [Twilio Live Docs](https://www.twilio.com/docs/live)
  - [Twilio Live Player SDK Docs](https://twilio.github.io/twilio-live-player.js/docs/1.0.0/)

1.0.0-preview.10 (October 5, 2021)
==================================

Changes
-------

- Moved `Player` to the `Live` namespace. Now, you can import the SDK APIs as shown below. (VIDEO-7097)

  ```ts
  // TypeScript or ES Modules
  import { Player } from '@twilio/live-player-sdk';

  // CommonJS
  const { Player } = require('@twilio/live-player-sdk');

  // <script src="path/to/twilio-live-player.js">
  const Player = Twilio.Live.Player;
  ```

Bug Fixes
---------

- Fixed a bug where the `Player`, when running on Firefox, did not transition to
  the `ended` state when a live stream was ended. (VIDEO-6015)

1.0.0-preview.9 (August 4, 2021)
===============================

Changes
-------

#### Breaking API Changes

- `Player.connect(token, options)` has been updated to accept a [Twilio Access Token](https://www.twilio.com/docs/iam/access-tokens) with a [PlaybackGrant](https://www.twilio.com/docs/live/playbackgrant-resource) whose type is a JSON object instead of a stringified JSON. Providing a playback grant as stringified JSON as recommended from `1.0.0-preview.5` through `1.0.0-preview.7` will result in an `AccessTokenInvalid` error.

#### API Updates

- `Player.connect(token, options)` has been updated to accept a token with a `RecordingPlaybackGrant` to allow playback of recorded media. This is currently supported on Chrome browser.

- Added `player.duration` property. The duration is `Infinity` if the media is a live stream, otherwise a positive number in seconds.

- Added `player.seekTo(position)` for changing the player's position to a specified time in seconds. The player state might change to buffering if there is not enough buffered content in the specified position. This is only supported for recorded media and will throw an error if invoked on a live media. This is currently supported on Chrome browser.

#### New Player Events

- Added `Player.Event.DurationChanged` event which is raised whenever `Player.duration` property changes.

- Added `Player.Event.SeekCompleted` event which is raised when the player seeked to a given position (as requested by `Player.seekTo`).

#### New Telemetry Events

- Added a new telemetry event [Telemetry.Data.Playback.SeekTo](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.9/interfaces/player.telemetry.data.playback.seekto.html) indicating that the Player started seeking to a specified position.

- Added a new telemetry event [Telemetry.Data.Playback.SeekCompleted](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.9/interfaces/player.telemetry.data.playback.seekcompleted.html) indicating that the player seeked to a given position (as requested by `Player.seekTo`).

- Added [Telemetry.Data.Connection.Connected.requestCredentials](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.9/interfaces/player.telemetry.data.connection.connected.html) property to indicate what cross-origin request policy was used for cross-site cookies during media playback.

- Added a new telemetry event [Telemetry.Data.PlaybackQuality.DurationChanged](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.9/interfaces/player.telemetry.data.playbackquality.durationchanged.html) indicating that the Player's `Player.duration` has changed.

Bug Fixes
---------

- `player.setVolume(...)` will now emit a `Player.Error` for any invalid parameters.

1.0.0-preview.8 (July 29, 2021)
===============================

Changes
-------

- The SDK now officially supports playing video contents of a live stream. Check out the [README](README.md#rendering-the-live-stream) for more information on how to render a live stream.

1.0.0-preview.7 (July 28, 2021)
===============================

Changes
-------

- The SDK will now retry connecting to a stream when a recoverable error is detected upon the first invocation of `Player.connect(...)`.

1.0.0-preview.6 (July 22, 2021)
===============================

Changes
-------

- `Player.Error` now includes an optional [explanation](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.6/classes/player.error-1.html#explanation) property that provides more details about the error that occurred.

- `Player.Error` now includes [constant definitions](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.6/modules/player.error.html) for all the unique error code values.

1.0.0-preview.5 (July 9, 2021)
===============================

Changes
-------

- `Player.connect(token, options)` has been updated to accept a new different token format. With this change, the `token` parameter is now a [Twilio Access Token](https://www.twilio.com/docs/iam/access-tokens) with a `PlaybackGrant`. See this [page](https://www.twilio.com/docs/live/using-playbackgrant-at-scale) for more information on how to generate this token.

- Removed the following properties: `Player.sid`, `Telemetry.Data.Connection.playerSid`, `Telemetry.Data.Playback.playerSid`, `Telemetry.Data.PlaybackQuality.playerSid`, `Telemetry.Data.PlaybackState.playerSid` and `Telemetry.Data.TimedMetadataTelemetry.playerSid`.

1.0.0-preview.4 (July 1, 2021)
===============================

Improvements
------------

#### API Updates

Added a static property `Player.isHighLatencyReductionEnabled` that is `true` by default. The Player SDK considers a `player.liveLatency` value greater than 3 seconds as an occurence of high latency.
When this property is enabled, the Player SDK will periodiocally inspect `player.liveLatency` and perform the following when high latency is observed:

1. If the live latency is between 3 and 5 seconds, the Player will increase the playback rate to a value that should not be perceptible to a user. The increased playback rate will allow the Player to catch up to the live source, and will be reverted once the live latency drops below 3 seconds. Application of this strategy may result in audio pitch distortion.

2. If the live latency is greater than or equal to 5 seconds, the Player will seek ahead to near the end of the Player's buffered content. The user will notice skips in the media content when this strategy is applied.

#### New telemetry events

Added two new telemetry events: [HighLatencyReductionApplied](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.4/interfaces/player.telemetry.data.playbackquality-1.html) and [HighLatencyReductionReverted](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.4/interfaces/player.telemetry.data.playbackquality-1.html).

1.0.0-preview.3 (June 11, 2021)
===============================

Changes
-------

- The [Telemetry](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.3/classes/player.telemetry-1.html)
  API enables you to subscribe to event and metric data reported by the Player SDK.
  This data can be used to track stream quality, triage issues, and better understand
  your application's usage of the Player SDK. The current list of reported events and
  metrics can be found [here](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.3/modules/player.telemetry.data.html).
  You can subscribe to them as shown below. (VIDEO-5620)

  ```ts
  import { Player } from '@twilio/player-sdk';
  
  Player.telemetry.subscribe(data => {
    // Do something with the data.
  });
  ```

  If you want to subscribe only to certain events and metrics, you can pass a predicate
  as a second argument to `Player.subscribe()` as shown below.

  ```ts
  import { Player } from '@twilio/player-sdk';

  // Report to your analytics provider whenever the live stream's latency is
  // greater than or equal 5 seconds.
  Player.telemetry.subscribe(data => {
    analytics.send(data);
  }, data => {
    return 'playerLiveLatency' in data && data.playerLiveLatency >= 5;
  });
  ```

- `Player.quality` is now settable, which means you can change the quality of the
  live stream by setting it to one of the `Quality` objects in `Player.availableQualities`. (VIDEO-5594)
- Added a new property `streamerSid` to Player, which identifies the [PlayerStreamer](https://www.twilio.com/docs/live/playerstreamers)
  to which the Player is connected to. (VIDEO-5594)

1.0.0-preview.2 (June 1, 2021)
==============================

Improvements
------------

- Fixed an issue with audio playback of malformed mono input streams. (VIDEO-5334)
- Fixed a rare playback error that could occur when playing content outside the
  live HLS window. (VIDEO-5334)
- Improved the Player's ability to play standard HLS live and recorded streams. (VIDEO-5334)
- Improved the accuracy of `Player.liveLatency`. (VIDEO-5334)
- Improved the ABR (adaptive bitrate streaming) algorithm to increase video quality
  more quickly when network connections improve. (VIDEO-5334)
- Improved player stability by reducing occurrences of rare crashes. (VIDEO-5334)

Changes
-------

- Added a new value `Off` to the `LogLevel` enum, which allows you to disable logging
  for all the Player instances running in your application. (VIDEO-5267)
- Added a new API `setLogLevel()` to the Player class, using which you can change
  the log level of all the Player instances running in your application. (VIDEO-5267)
- Moved `logLevel` from the Player instance to the Player class, so that it now
  represents the log level of all the Player instances running in your application. (VIDEO-5267)
- Moved the following APIs and types from the Player SDK exports to the Player class:
  - `connect()`
  - `isSupported`
  - `version`
  - `VideoDimensions`
  - `TimedMetadata`

  The Player class is now the only export of the SDK. (VIDEO-5267)
- [Player.Options](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.2/interfaces/player.options.html)
  now has only one property `playerWasmAssetsPath`, which points to the folder where
  the application hosts `twilio-player-wasmworker-x-y-z.min.js` and `twilio-player-wasmworker-x-y-z.min.wasm`,
  where `x.y.z` is the version of the files. (VIDEO-5403)

Bug Fixes
---------

- Fixed a bug where the Player transitioned to the `idle` state instead of the `ended`
  state whenever a playback error occurred. (VIDEO-5266)

1.0.0-preview.1 (May 6, 2021)
=============================

- The Twilio Player SDK allows you to play back a live stream of a Video Room.
  You can now start a [live stream](https://www.twilio.com/docs/live) of an ongoing
  Room session. Then, with the SDK, you can:
  - [Connect](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.1/modules.html#connect)
    to the live stream.
  - [Pause](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.1/classes/player.html#pause)
    and [play](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.1/classes/player.html#play)
    the live stream.
  - [Mute and unmute](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.1/classes/player.html#ismuted)
    the audio of the live stream.
  - [Set the volume](https://sturdy-couscous-a4982282.pages.github.io/docs/1.0.0-preview.1/classes/player.html#setvolume)
    of the live stream audio.
  
  For more details, check out the [SDK Documentation](https://twilio.github.io/twilio-live-player.js/docs/1.0.0-preview.1/).
