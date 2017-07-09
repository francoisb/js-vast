module.players.companion.Image = (function(VastPlayerBase) {

    /**
     * VastPlayerCompanionImage constructor.
     */
    function VastPlayerCompanionImage() {
        VastPlayerBase.apply(this, arguments);
    };
    VastPlayerCompanionImage.prototype             = new VastPlayerBase();
    VastPlayerCompanionImage.prototype.constructor = VastPlayerCompanionImage;

    VastPlayerCompanionImage.prototype._append = function(container, companion, parameters) {
        var elm = document.createElement('img');
        
        elm.width  = companion.width;
        elm.height = companion.height;
        elm.src    = companion.resource;

        if (companion.target) {
            var link = document.createElement('a');

            link.target = '_blank';
            link.href   = companion.target;

            link.appendChild(elm);
            container.appendChild(link);
        } else {
            container.appendChild(elm);
        }

        return this;
    };

    VastPlayerCompanionImage.prototype._init = function(companion, parameters) {
        this.trigger('ready', [companion]);

        companion.tracking.send('creativeView');

        return this;
    };


    return VastPlayerCompanionImage;

})(module.players.Base);
