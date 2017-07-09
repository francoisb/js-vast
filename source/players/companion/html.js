module.players.companion.Html = (function(VastPlayerBase) {

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

})(module.players.Base);
