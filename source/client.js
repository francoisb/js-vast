module.Client = (function(VastXmlLoader, VastXmlParser) {

    /**
     * VastClient constructor.
     */
    function VastClient(container) {
        this.container  = container;
        this._listeners = {};
        
    };
    VastClient.prototype.constructor = VastClient;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastClient.prototype, {
        _xmlParser: {
            /**
             * Get VastXmlParser.
             *
             * @returns {VastXmlParser}
             */
            get: (function() {
                var instance = null;
                return function () {
                    if (instance === null) {
                        instance = new VastXmlParser();
                    }
                    return instance;
                }
            })()
        },
        _xmlLoader: {
            /**
             * Get VastXmlLoader.
             *
             * @returns {VastXmlLoader}
             */
            get: (function() {
                var instance = null;
                return function () {
                    if (instance === null) {
                        instance = new VastXmlLoader();
                    }
                    return instance;
                }
            })()
        }
    });

    /**
     * Trigger an event.
     *
     * @public
     * @returns {Self}
     */
    VastClient.prototype.trigger = function(key, parameters) {
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
    VastClient.prototype.bind = function(key, callback) {
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
    VastClient.prototype.unbind = function(key, callback) {
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
    VastClient.prototype.unbindAll = function() {
        this._listeners = {};

        return this;
    };

    /**
     * Run the VAST client.
     *
     * @public
     * @returns {Self}
     */
    VastClient.prototype.run = function(vastUrl) {
        var self = this;

        var xmlDoc = this._xmlLoader.load(vastUrl, function(xmlDoc) {
            self.trigger('xml.loaded', [xmlDoc]);

            var vastData = self._xmlParser.parse(xmlDoc);
            self.trigger('xml.parsed', [vastData]);

            var
                ad, creative, playerObject,
                player = null;

            if (vastData) {
                for (var i=0; i<vastData.length; i++) {
                    if (player) {
                        break;
                    }

                    ad = vastData[i];

                    for (var ii=0; ii<ad.creatives.length; ii++) {
                        if (player) {
                            break;
                        }

                        creative = ad.creatives[ii];

                        if (creative.type === 'linear') {
                            for (var iii=0; iii<creative.mediafiles.length; iii++) {
                                if (player) {
                                    break;
                                }
                                playerObject = creative.mediafiles[iii];
                                if (playerObject.player) {
                                    player = new playerObject.player(self.container);
                                    if (!player.compatible) {
                                        player = null;
                                    }
                                }
                            }
                        } else if (creative.type === 'companion') {
                            for (var iii=0; iii<creative.companions.length; iii++) {
                                if (player) {
                                    break;
                                }
                                playerObject = creative.companions[iii];
                                if (playerObject.player) {
                                    player = new playerObject.player(self.container);
                                    if (!player.compatible) {
                                        player = null;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (!player) {
                self.trigger('empty', [vastData]);
                return;
            }

            player.bind('*', function(key, parameters) {
                self.trigger('player.' + key, [player, playerObject, creative, parameters]);
            });
            player.print(ad, playerObject, creative.playerParameters);
        }, function(status, err) {
            // an error occured on the loading step
        });

        return this;
    };


    return VastClient;

})(module.xml.Loader, module.xml.Parser);
