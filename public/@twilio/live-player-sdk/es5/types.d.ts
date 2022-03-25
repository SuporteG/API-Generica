/**
 * @private
 */
declare global {
    interface Window {
        Twilio: Object & {
            Live?: {
                Player?: any;
            };
        };
    }
}
/**
 * @private
 */
export declare type RequestCredentials = 'omit' | 'same-origin' | 'include';
