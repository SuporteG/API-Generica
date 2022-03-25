"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telemetry = void 0;
/**
 * A [[Telemetry]] provides facilities for subscribing to event
 * and metric data collected by the SDK.
 */
var Telemetry = /** @class */ (function () {
    /**
     * @private
     */
    function Telemetry() {
        this._subscribersToPredicates = new Map();
    }
    /**
     * @private
     */
    Telemetry.prototype.publish = function (data) {
        this._subscribersToPredicates.forEach(function (predicate, subscriber) {
            if (predicate(data)) {
                subscriber(data);
            }
        });
        return this;
    };
    /**
     * @private
     */
    Telemetry.prototype.publishPeriodically = function (getData, periodMs) {
        var _this = this;
        var stop = function () {
            if (interval !== null) {
                clearInterval(interval);
                interval = null;
            }
        };
        var start = function () {
            if (interval === null) {
                interval = setInterval(function () { return _this.publish(getData()); }, periodMs);
            }
        };
        var interval = null;
        return { start: start, stop: stop };
    };
    /**
     * Subscribe to the published [[Telemetry.Data]] objects that satisfy the given
     * [[Telemetry.Predicate]]. If no [[Telemetry.Predicate]] is provided, all
     * [[Telemetry.Data]] objects will be subscribed to.
     * @param subscriber Consumer of the published [[Telemetry.Data]] objects
     * @param predicate The filter applied to the published [[Telemetry.Data]] objects
     */
    Telemetry.prototype.subscribe = function (subscriber, predicate) {
        this._subscribersToPredicates.set(subscriber, predicate || (function () { return true; }));
        return this;
    };
    /**
     * Unsubscribe from the [[Telemetry.Data]] objects.
     * @param subscriber Consumer of the published [[Telemetry.Data]] objects
     */
    Telemetry.prototype.unsubscribe = function (subscriber) {
        this._subscribersToPredicates.delete(subscriber);
        return this;
    };
    return Telemetry;
}());
exports.Telemetry = Telemetry;
//# sourceMappingURL=telemetry.js.map