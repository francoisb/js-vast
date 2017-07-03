"use strict";
(function () {

    function setup(VastModelTracking, VastPlayerCompanionHtml, VastPlayerCompanionIframe, VastPlayerCompanionImage) {

        /**
         * VastModelCompanion model constructor.
         */
        function VastModelCompanion(width, height, type, resource, target) {
            this.width    = width;
            this.height   = height;
            this.type     = type; // [iframe, html, image, ...]
            this.resource = resource;
            this.target   = target;
            this.tracking = new VastModelTracking();
        };
        VastModelCompanion.prototype.constructor = VastModelCompanion;

        /**
         * Instance properties.
         */
        Object.defineProperties(VastModelCompanion.prototype, {
            player: {
                /**
                 * Get VastPlayerCompanion.
                 *
                 * @returns {VastPlayerCompanion}
                 */
                get: function() {
                    switch (this.type) {
                        case 'html':
                            return VastPlayerCompanionHtml;
                        case 'iframe':
                            return VastPlayerCompanionIframe;
                        case 'image':
                            return VastPlayerCompanionImage;
                        default:
                            return null;
                    }
                }
            }
        });

        VastModelCompanion.prototype.clone = function() {
            var result = new this.constructor(this.width, this.height, this.type, this.resource, this.target);

            result.tracking = this.tracking.clone();

            return result;
        };


        return VastModelCompanion;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/models/companion', [
            'vast/models/tracking', 
            'vast/players/companion/html', 
            'vast/players/companion/iframe', 
            'vast/players/companion/image'
        ], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                  = window.Vast || {};
        window.Vast.Models           = window.Vast.Models || {};
        window.Vast.Models.Companion = window.Vast.Models.Companion || setup(
            window.Vast.Models.Tracking, 
            window.Vast.Players.Companion.Html, 
            window.Vast.Players.Companion.Iframe, 
            window.Vast.Players.Companion.Image
        );
    }

})();