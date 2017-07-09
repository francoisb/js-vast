module.players.Base = (function() {

    /**
     * VastPlayerBase constructor.
     */
    function VastPlayerBase(container) {
        this.container  = container || window.document.body;
        this._listeners = {};
        
    };
    VastPlayerBase.prototype.constructor = VastPlayerBase;
    VastPlayerBase.MAX_HEIGHT            = 600;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastPlayerBase.prototype, {
        compatible: {
             get: function () {
                return true;
             }
        }
    });

    /**
     * Trigger an event.
     *
     * @public
     * @returns {Self}
     */
    VastPlayerBase.prototype.trigger = function(key, parameters) {
        var self   = this;
        parameters = parameters || [];

        function _hear(key, parameters) {
            if (self._listeners[key] !== undefined) {
                var i;
                for (i=0; i<self._listeners[key].length; i++) {
                    self._listeners[key][i].apply(undefined, parameters);
                }
            }
        }

        if (self._listeners[key] !== undefined) {
            _hear(key, parameters);
        } else {
            _hear('default', [key, parameters]);
        }

        _hear('*', [key, parameters]);

        return this;
    };

    /**
     * Add a listener.
     *
     * @public
     * @returns {Self}
     */
    VastPlayerBase.prototype.bind = function(key, callback) {
        if (this._listeners[key] === undefined) {
            this._listeners[key] = [];
        }

        this._listeners[key].push(callback);

        return this;
    };

    /**
     * Remove one or many listener(s).
     *
     * @public
     * @returns {Self}
     */
    VastPlayerBase.prototype.unbind = function(key, callback) {
        if (this._listeners[key] !== undefined) {
            if (callback !== undefined) {
                for (var i=this._listeners[key].length - 1; i>=0; i--) {
                    if (this._listeners[key][i] === callback) {
                        this._listeners[key][i].splice(i, 1);
                    }
                }
            } else {
                this._listeners[key] = [];
                delete(this._listeners[key])
            }
        }

        return this;
    };

    /**
     * Remove all listeners.
     *
     * @public
     * @returns {Self}
     */
    VastPlayerBase.prototype.unbindAll = function() {
        this._listeners = {};

        return this;
    };

    VastPlayerBase.prototype.print = function(adInstance, playerObject, playerParameters) {
        if (!this.compatible) {
            throw Error('Player is not compatible!');
        }

        this._append(this.container, playerObject, playerParameters);
        this._init(adInstance, playerObject, playerParameters);

        return this;
    };

    VastPlayerBase.prototype._append = function(container, playerObject, playerParameters) {
        return this;
    };

    VastPlayerBase.prototype._init = function(adInstance, playerObject, playerParameters) {
        return this;
    };


    return VastPlayerBase;

})();
