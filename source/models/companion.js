module.models.Companion = (function(VastModelTracking, VastPlayerCompanionHtml, VastPlayerCompanionIframe, VastPlayerCompanionImage) {

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

})(module.models.Tracking, module.players.companion.Html, module.players.companion.Iframe, module.players.companion.Image);
