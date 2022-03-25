# twilio-live-player.js

[![CircleCI](https://circleci.com/gh/twilio/twilio-live-player.js.svg?style=svg&circle-token=4046cd25e4ae3226fecede75b0c94e8d19ad0c16)](https://circleci.com/gh/twilio/twilio-live-player.js)

The Twilio Live Player SDK allows you to play back a live stream of a Video Room. Please
take a look at the SDK documentation [here](https://twilio.github.io/twilio-live-player.js/docs/latest/).

## License

The Twilio Live Player SDK is distributed under the [Twilio Terms of Service](https://www.twilio.com/legal/tos).

## Browser Support

| | Chrome | Edge (Chromium) | Firefox | Safari |
|---|---|---|---|---|
| Android | ✓ [*](#android-chrome) | - | - | - |
| iOS | ✓ [*](#ios-chrome) | - | - | ✓ [*](#ios-safari) |
| Linux | ✓ | ✓ | ✓ | ✓ |
| MacOS | ✓ | ✓ | ✓ [*](#desktop-firefox) | ✓ |
| Windows | ✓ | ✓ | ✓ [*](#desktop-firefox) | ✓ |

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- NPM (v6+)

## Installing the SDK

### NPM

You can install the SDK as a dependency of your app by running the following command:

```
npm install @twilio/live-player-sdk
```

You can now import the SDK to your project as shown below:

#### TypeScript or ES Modules

```ts
import { Player } from '@twilio/live-player-sdk';
```

#### CommonJS

```js
const { Player } = require('@twilio/live-player-sdk');
```

### \<script\> tag

You can deploy `node_modules/@twilio/live-player-sdk/dist/build/twilio-live-player.min.js` with your application.
Once you include it in a `<script>` tag, you can access the SDK APIs in `window` scope as shown below:

```js
const { Player } = Twilio.Live;
```

## Live Streaming a Video Room

Please refer to the [Twilio Live docs](https://www.twilio.com/docs/live) docs
for starting a live stream of a Video Room from your application server. At the end,
you will have an AccessToken which you can use to join the live stream.

## Checking for Browser Support

You can check whether the SDK supports the browser on which the application is running
as shown below:

```ts
import { Player } from '@twilio/live-player-sdk';

if (Player.isSupported) {
  /**
   * Load your application.
   */
} else {
  /**
   * Inform the user that the browser is not supported.
   */
}
```

## Joining a Live Stream

You can now join the live stream from your application using the AccessToken as
shown below:

```ts
import { Player } from '@twilio/live-player-sdk';

const {
  host,
  protocol,
} = window.location;

/**
 * Join a live stream.
 */
const player = await Player.connect('$accessToken', {
  playerWasmAssetsPath: `${protocol}//${host}/path/to/hosted/player/assets`,
});
```

In order for the SDK to run, your application must host the following artifacts
which are available in `node_modules/@twilio/live-player-sdk/dist/build`:

* `twilio-live-player-wasmworker-x-y-z.min.wasm`
* `twilio-live-player-wasmworker-x-y-z.min.js`

where `x.y.z` is the version of the SDK assets.

### Handling Player Events

After joining the live stream, you can listen to events on the Player as shown below:

```ts
player.on(Player.Event.StateChanged, (state: Player.State) => {
  switch (state) {
    case Player.State.Buffering:
      /**
       * The player is buffering content.
       */
    case Player.State.Ended:
      /**
       * The stream has ended.
       */
    case Player.State.Idle:
      /**
       * The player has successfully authenticated and is loading the stream. This
       * state is also reached as a result of calling player.pause().
       */
    case Player.State.Playing:
      /**
       * The player is now playing a stream. This state occurs as a result of calling
       * player.play().
       */
    case Player.State.Ready:
      /**
       * The player is ready to play back the stream.
       */
  }
});
```

## Live Stream Playback

You can perform the following playback actions on the live stream:

```ts
/**
 * Call this method after the Player transitions to the Player.State.Ready state.
 */
player.play();

/**
 * Pause playback.
 */
player.pause();

/**
 * Mute audio.
 */
player.isMuted = true;

/**
 * Unmute audio.
 */
player.isMuted = false;

/**
 * Set volume.
 */
player.setVolume(0.5);
```

### Handling the Browser's Autoplay Policy

If your application plays the live stream on page load without a user action, then
the browser's autoplay policy may come into effect, in which case the audio will be
muted. You can detect when this happens by listening to the `Player.Event.VolumeChanged`
event on the Player as shown below:

```ts
player.on(Player.Event.VolumeChanged, () => {
  if (player.isMuted) {
    /**
     * Show the unmute button.
     */
  } else {
    /**
     * Hide the unmute button.
     */
  }
});
```

## Rendering the Live Stream

In order to render the live stream, you can use the default HTMLVideoElement created
by the Player in your application as shown below:

```ts
const container = document.querySelector('div#container');
container.appendChild(player.videoElement);
```

Alternatively, if you want to render the live stream in your own HTMLVideoElement,
you can do so as shown below:

```ts
const videoElement = document.querySelector('div#container > video');
/**
 * Enable inline playback on iOS browsers.
 */
videoElement.playsInline = true;
player.attach(videoElement);
```

## Handling Timed Metadata

When a [Media Extension](https://www.twilio.com/docs/live/media-extensions-overview) inserts
TimedMetadata into a stream, you can receive them by  listening to the `Player.Event.TimedMetadataReceived`
event as shown below:

```ts
player.on(Player.Event.TimedMetadataReceived, (metadata: Player.TimedMetadata) => {
  /**
   * Handle the metadata.
   */
});
```

## Disconnecting from the Live Stream

You can disconnect from the live stream as shown below:

```ts
player.disconnect();
```

This is a terminal operation on the Player, which is no longer useful to the application.

## Known Issues

### Android Chrome

- Cannot resume playback of a paused live stream.
- The video of a live stream sometimes flickers.

### Desktop Firefox

- The Player takes a few seconds longer than usual to reach the `ended` state after
  a live stream is stopped by ending a MediaProcessor.

### iOS Chrome

- The parameters of `Player.stats` are always either 0 or null.
- Cannot change the volume of a live stream's audio.
- The live latency of a stream is sometimes greater than 3 seconds.

### iOS Safari

- The parameters of `Player.stats` are always either 0 or null.
- Cannot change the volume of a live stream's audio.
- The live latency of a stream is sometimes greater than 3 seconds.
