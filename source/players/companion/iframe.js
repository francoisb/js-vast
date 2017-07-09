module.players.companion.Iframe = (function(VastPlayerBase) {

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

})(module.players.Base);
