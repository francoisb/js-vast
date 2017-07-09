module.models.Ad = (function(VastModelTracking) {

    function VastModelAdInvalidError(message) {
        this.name    = 'InvalidError';
        this.message = message;
    }
    VastModelAdInvalidError.prototype             = Error.prototype;
    VastModelAdInvalidError.prototype.constructor = VastModelAdInvalidError;


    /**
     * VastModelAd constructor.
     */
    function VastModelAd(id, type, system, title, description) {
        this.id          = id;
        this.type        = type;
        this.system      = system;
        this.title       = title;
        this.description = description;
        this.tracking    = new VastModelTracking();
        this.creatives   = [];
        this.extensions  = [];
    };
    VastModelAd.prototype.constructor = VastModelAd;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastModelAd.prototype, {
        isWrapper: {
            /**
             * Whether ad is a wrapper or not.
             *
             * @returns {Boolean}
             */
            get: function() {
                return this.type.toLowerCase() === 'wrapper';
            }
        }
    });

    VastModelAd.prototype.addCreative = function(creative) {
        this.creatives.push(creative);

        return this;
    };

    VastModelAd.prototype.clone = function() {
        var result = new this.constructor(this.id, this.type, this.system, this.title, this.description);

        result.tracking   = this.tracking.clone();
        result.extensions = this.extensions.slice(0);

        for (var i=0; i<this.creatives.length; i++) {
            result.addCreative(this.creatives[i].clone());
        }

        return result;
    };

    VastModelAd.createFromInstance = function(record, id, type, system, title, description) {
        if (!record || record.constructor !== VastModelAd) {
            throw new VastModelAdInvalidError('The parameter "record" must be a VastModelAd instance.');
        }

        var
            result    = record.clone(),
            _creatives = result.creatives.slice(0);

        result.creatives = [];

        if (id && id.length) {
            result.id = id;
        }
        if (type && type.length) {
            result.type = type;
        }
        if (system && system.length) {
            result.system = system;
        }
        if (title && title.length) {
            result.title = title;
        }
        if (description && description.length) {
            result.description = description;
        }

        // redefine addCreative function ...
        if (_creatives.length > 0) {
            result.addCreative = function(creative) {
                if (creative.type === 'linear') {
                    for (var i=0; i<_creatives.length; i++) {
                        if (_creatives[i].type === creative.type) {
                            creative.tracking._events = creative.tracking._events.concat(_creatives[i].tracking._events)
                        }

                        if (!creative.target || !creative.target.length) {
                            creative.target = _creatives[i].target;
                        }
                        if (!creative.parameters) {
                            creative.parameters = _creatives[i].parameters;
                        }
                    }
                }

                this.creatives.push(creative);

                return this;
            };
        }
        

        return result;
    };


    return VastModelAd;

})(module.models.Tracking);
