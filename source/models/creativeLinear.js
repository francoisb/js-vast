"use strict";
(function () {

    function setup(VastModelTracking) {

        /**
         * VastModelCreativeLinear model constructor.
         */
        function VastModelCreativeLinear(duration, target) {
            this.duration   = duration;
            this.target     = target;
            this.mediafiles = [];
            this.parameters = null;
            this.tracking   = new VastModelTracking();
        };
        VastModelCreativeLinear.prototype.constructor = VastModelCreativeLinear;

        /**
         * Instance properties.
         */
        Object.defineProperties(VastModelCreativeLinear.prototype, {
            type: {
                /**
                 * Get sponsor type.
                 *
                 * @returns {String}
                 */
                get: function () {
                    return 'linear';
                }
            }, 
            playerParameters: {
                /**
                 * Get player's parameters.
                 *
                 * @returns {Object}
                 */
                get: function () {
                    var
                        durations,
                        duration = 0;

                    if (this.duration && this.duration.length) {
                        durations = this.duration.split(':');
                        if (durations.length === 3) {
                            //convert a duration (exemple 00:00:15) to milliseconds
                            duration = (parseInt(durations[0]) * 3600000) + (parseInt(durations[1]) * 60000) + (parseInt(durations[2]) * 1000);
                        }
                        
                    }
                    return {
                        duration:     duration,
                        tracking:     this.tracking,
                        adParameters: this.parameters, 
                        target:       this.target
                    };
                }
            }
        });

        VastModelCreativeLinear.prototype.clone = function() {
            var result = new this.constructor(this.duration, this.target);

            if (this.parameters) {
                if (this.parameters.constructor === Array) {
                    result.parameters = this.parameters.slice(0);
                } else if (typeof this.parameters === 'object') {
                    result.parameters = JSON.parse(JSON.stringify(this.parameters))
                } else {
                    result.parameters = this.parameters;
                }
            }

            result.tracking = this.tracking.clone();

            for (var i=0; i<this.mediafiles.length; i++) {
                result.mediafiles.push(this.mediafiles[0].clone());
            }

            return result;
        };


        return VastModelCreativeLinear;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/models/creativelinear', ['vast/models/tracking'], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                       = window.Vast || {};
        window.Vast.Models                = window.Vast.Models || {};
        window.Vast.Models.CreativeLinear = window.Vast.Models.CreativeLinear || setup(window.Vast.Models.Tracking);
    }

})();