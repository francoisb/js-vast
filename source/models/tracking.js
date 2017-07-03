"use strict";
(function () {

    function setup() {

        /**
         * VastModelTracking model constructor.
         */
        function VastModelTracking() {
            this._events = [];
        };
        VastModelTracking.prototype.constructor = VastModelTracking;

        VastModelTracking.prototype.addEvent = function(name, url) {
            this._events.push({ name: name, url: url });
            return this;
        };

        VastModelTracking.prototype.hasEvent = function(name) {
            var results = [];

            name = name.toLowerCase();
            for (var i=0; i<this._events.length; i++) {
                if (this._events[i].name.toLowerCase() === name) {
                    return true;
                }
            }

            return false;
        };

        VastModelTracking.prototype.getEvent = function(name) {
            var results = [];

            name = name.toLowerCase();
            for (var i=0; i<this._events.length; i++) {
                if (this._events[i].name.toLowerCase() === name) {
                    results.push(this._events[i].url);
                }
            }

            return results;
        };

        VastModelTracking.prototype.send = function(name) {
            var
                senders = [],
                urls    = this.getEvent(name);

            if (urls.length) {
                for (var i=0; i<urls.length; i++) {
                    senders.push(new Image(1,1));
                    senders[i].src = urls[i];
                }
            }

            return results;
        };

        VastModelTracking.prototype.clone = function() {
            var result = new this.constructor();

            result._events = this._events.slice(0);

            return result;
        };


        return VastModelTracking;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/models/tracking', [], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                 = window.Vast || {};
        window.Vast.Models          = window.Vast.Models || {};
        window.Vast.Models.Tracking = window.Vast.Models.Tracking || setup();
    }

})();