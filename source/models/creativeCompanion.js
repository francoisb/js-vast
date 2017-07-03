"use strict";
(function () {

    function setup(VastModelTracking) {

        /**
         * VastModelCreativeCompanion model constructor.
         */
        function VastModelCreativeCompanion() {
            this.companions = [];
        };
        VastModelCreativeCompanion.prototype.constructor = VastModelCreativeCompanion;

        /**
         * Instance properties.
         */
        Object.defineProperties(VastModelCreativeCompanion.prototype, {
            type: {
                /**
                 * Get sponsor type.
                 *
                 * @returns {String}
                 */
                get: function () {
                    return 'companion';
                }
            }, 
            playerParameters: {
                /**
                 * Get player's parameters.
                 *
                 * @returns {Object}
                 */
                get: function () {
                    return {};
                }
            }
        });

        VastModelCreativeCompanion.prototype.getCompanionsByType = function(type) {
            var
                i,
                results = [];
            
            for (var i=0; i<=this.companions.length; i++) {
                if (this.companions[i].type === type) {
                    results.push(this.companions[i]);
                }
            }

            return results;
        };

        VastModelCreativeCompanion.prototype.clone = function() {
            var result = new this.constructor();

            for (var i=0; i<this.companions.length; i++) {
                result.companions.push(this.companions[i].clone());
            }

            return result;
        };


        return VastModelCreativeCompanion;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/models/creativecompanion', ['vast/models/tracking'], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                          = window.Vast || {};
        window.Vast.Models                   = window.Vast.Models || {};
        window.Vast.Models.CreativeCompanion = window.Vast.Models.CreativeCompanion || setup(window.Vast.Models.Tracking);
    }

})();