module.models.MediaFile = (function(Modernizr, VastPlayerMediaFileFlash, VastPlayerMediaFileHtml5) {

    /**
     * MEDIAFILE model constructor.
     *
     * @param   {string}        url                 Location of file.
     * @param   {string}        delivery            Method of delivery of ad. ['streaming', 'progressive']
     * @param   {string}        mimetype            MIME type. Popular MIME types include, but are not limited to “video/x-ms-wmv” for Windows Media, and “video/x-flv” for Flash Video.
     * @param   {string}        api                 The apiFramework defines the method to use for communication if the MediaFile is interactive. Suggested values for this element are “VPAID”, “FlashVars” (for Flash/Flex), “initParams” (for Silverlight) and “GetVariables” (variables placed in key/value pairs on the asset request).
     * @param   {integer}       bitrate             Bitrate of encoded video in Kbps.
     * @param   {integer}       width               Pixel dimensions of video.
     * @param   {integer}       height              Pixel dimensions of video.
     *
     */
    function VastModelMediaFile(url, delivery, mimetype, api, bitrate, width, height) {
        this.url      = url;
        this.delivery = delivery;
        this.mimetype = mimetype;
        this.api      = api;
        this.bitrate  = bitrate;
        this.width    = width;
        this.height   = height;
    };
    VastModelMediaFile.prototype.constructor = VastModelMediaFile;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastModelMediaFile.prototype, {
        player: {
            /**
             * Get VastPlayerMediaFile.
             *
             * @returns {VastPlayerMediaFile}
             */
            get: function() {
                switch (this.mimetype) {
                    case 'application/x-shockwave-flash':
                    case 'video/x-flv':
                        return VastPlayerMediaFileFlash;
                    case 'video/mp4':
                        if (Modernizr && Modernizr.video && Modernizr.video.h264) {
                            return VastPlayerMediaFileHtml5;
                        }
                        return null;
                    case 'video/webm':
                        if (Modernizr && Modernizr.video && Modernizr.video.webm) {
                            return VastPlayerMediaFileHtml5;
                        }
                        return null;
                    case 'video/ogg':
                        if (Modernizr && Modernizr.video && Modernizr.video.ogg) {
                            return VastPlayerMediaFileHtml5;
                        }
                        return null;
                    default:
                        return null;
                }
            }
        }
    });

    VastModelMediaFile.prototype.clone = function() {
        var result = new this.constructor(
            this.url, 
            this.delivery,
            this.mimetype, 
            this.api, 
            this.bitrate, 
            this.width, 
            this.height
        );

        return result;
    };


    return VastModelMediaFile;

})(Modernizr, module.players.mediafile.Flash, module.players.mediafile.Html5);
