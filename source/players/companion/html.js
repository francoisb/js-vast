"use strict";
(function () {

    function setup(VastPlayerBase) {

        /**
         * VastPlayerCompanionHtml constructor.
         */
        function VastPlayerCompanionHtml() {
            VastPlayerBase.apply(this, arguments);
        };
        VastPlayerCompanionHtml.prototype             = new VastPlayerBase();
        VastPlayerCompanionHtml.prototype.constructor = VastPlayerCompanionHtml;

        VastPlayerCompanionHtml.prototype._append = function(container, companion, parameters) {
            var elm = document.createElement('div');
            
            elm.style     = 'width: ' + companion.width + 'px; height: ' + companion.height + ';';
            elm.innerHTML = companion.resource;
                    
            container.appendChild(elm);

            return this;
        };

        VastPlayerCompanionHtml.prototype._init = function(companion, parameters) {
            this.trigger('ready', [companion]);

            companion.tracking.send('creativeView');

            return this;
        };


        return VastPlayerCompanionHtml;
    };


    if (typeof define === "function" && define.amd) {
        define('vast/players/companion/html', [
            'vast/players/base'
        ], setup);
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Vast                        = window.Vast || {};
        window.Vast.Players                = window.Vast.Players || {};
        window.Vast.Players.Companion      = window.Vast.Players.Companion || {};
        window.Vast.Players.Companion.Html = window.Vast.Players.Companion.Html || setup(
            window.Vast.Players.Base
        );
    }

})();