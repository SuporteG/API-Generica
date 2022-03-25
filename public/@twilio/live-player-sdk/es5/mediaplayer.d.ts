import { Player } from './player';
/**
 * Whether the SDK supports the browser. The SDK only supports browsers which are
 * capable of running WebAssembly (WASM).
 */
export declare const isSupported: boolean;
export declare class MediaPlayer extends Player {
    private _playbackUrlEventObserver?;
    constructor(playbackUrl: string, streamerSid: string, options: Player.Options);
    protected _getState(): Player.State;
    protected _reemitVendorPlayerEvents(): () => void;
}
