"use strict";
(function () {

    function setup(VastPlayerBase) {

        /**
         * VastPlayerCompanionIframe constructor.
         */
        function VastPlayerCompanionIframe() {
            VastPlayerBase.apply(this, arguments);
        };
        VastPlayerCompanionIframe.prototype             = new VastPlayerBase();
        VastPlayerCompanionIframe.prototype.constructor = VastPlayerCompanionIframe;

        VastPlayerCompanionIframe.prototype._append = function(container, companion, parameters) {
            var elm = document.createElement('iframe');
            
            elm.width       = companion.width;
            elm.height      = companion.height;
            elm.frameborder = "0";
            elm.scrolling   = "no";
            elm.src         = companion.resource;
                    
            container.appendChild(elm);

            return this;
        };

        VastPlayerCompanionIframe.prototype._init = function(companion, parameters) {
            this.trigger('ready', [companion]);

            companion.tracking.send('creativeView');

            return this;
        };


        return VastPlayerCompanionIframe;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/players/companion/iframe', [
            'vast/players/base'
        ], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                          = window.Vast || {};
        window.Vast.Players                  = window.Vast.Players || {};
        window.Vast.Players.Companion        = window.Vast.Players.Companion || {};
        window.Vast.Players.Companion.Iframe = window.Vast.Players.Companion.Iframe || setup(
            window.Vast.Players.Base
        );
    }

})();