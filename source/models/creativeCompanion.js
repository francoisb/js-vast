module.models.CreativeCompanion = (function(VastModelTracking) {

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

})(module.models.Tracking);
