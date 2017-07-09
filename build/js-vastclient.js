/* js-vastclient - https://github.com/francoisb/js-vastclient */
"use strict";
(function(name, dependencies, context, definition) {

    // CommonJS and AMD suport
    if (typeof context['module'] === 'object') {
        // CommonJS
        if (dependencies && context['require']) {
            for (var i = 0; i < dependencies.length; i++) {
                context[dependencies[i]] = context['require'](dependencies[i]);
            }
        }
        context['module']['exports'] = definition.apply(context);
    } else if (typeof context['define'] === 'function' && context['define']['amd']) {
        // AMD
        define(name, (dependencies || []), definition);
    } else {
        // Global Variables
        if (dependencies && context['require']) {
            for (var i = 0; i < dependencies.length; i++) {
                dependencies[i] = context[dependencies[i]];
            }
        }
        context[name] = definition.call(context, dependencies);
    }

})('js-vastclient', ['Modernizr'], (this || {}), function() {

    var module = {
        models:  {},
        players: {
            companion: {},
            mediafile: {}
        },
        xml:     {}
    };


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

module.players.mediafile.Flash = (function(VastPlayerBase) {

    var _getSWF, _uniqId = 0;;
    if (navigator.appName.indexOf("Microsoft") != -1) {
        _getSWF = function (swfName) { return window[swfName]; };
    } else {
        _getSWF = function (swfName) { return document[swfName]; };
    }

    /**
     * VastPlayerMediaFileFlash constructor.
     */
    function VastPlayerMediaFileFlash() {
        VastPlayerBase.apply(this, arguments);
    };
    VastPlayerMediaFileFlash.prototype             = new VastPlayerBase();
    VastPlayerMediaFileFlash.prototype.constructor = VastPlayerMediaFileFlash;

    /**
     * Class properties.
     */
    Object.defineProperties(VastPlayerMediaFileFlash, {
        compatible: {
             get: function () {
                return window.swfobject && window.swfobject.embedSWF;
             }
        }
    });

    VastPlayerMediaFileFlash.prototype._append = function(container, mediafile, parameters) {
        var
            ratio = 1,
            elm   = document.createElement('div');

        if (mediafile.width > VastPlayerBase.MAX_HEIGHT) {
            ratio = vidElm.width / VastPlayerBase.MAX_HEIGHT;   
        }

        elm.id    = 'flashContent';
        elm.style = 'width: ' + Math.round(mediafile.width * ratio) + 'px; height: ' + Math.round(mediafile.height * ratio) + 'px;';

        container.appendChild(elm);
    };

    VastPlayerMediaFileFlash.prototype._init = function(adInstance, mediafile, parameters) {
        _uniqId++;
        var
            self         = this,
            _timers      = [],
            _firedEvents = {};

        function clearTimers() {
            for (var key in _timers) {
                clearTimeout(_timers[key]);
            }
        }

        window.adPlayerEventHandler = {
            /**
             * Handler invoked when the flash ad player is ready to get the ad. parameters.
             */
            onPlayerReady: function (playerId) {
                if (_firedEvents['ready']) {
                    return;
                }
                _firedEvents['ready'] = true;
                self.trigger('ready');
                var swf = _getSWF('flash-ad-player');
                swf.setAdParameters(mediafile.url, mediafile.mimetype, parameters.adParameters || '');
            },

            /**
             * Handler invoked when something has failed.
             * @param errorId (String) Error id.
             * @param errorMessage (String) Error message.
             */
            onAdError: function (playerId, errorId, errorMessage) {
                clearTimers();
                self.trigger('error', [{ error: { id: errorId, message: errorMessage } }]);
            },

            onAdStarted: function (playerId) {
                if (_firedEvents['ad.started']) {
                    return;
                }
                _firedEvents['ad.started'] = true;
                self.trigger('ad.started');
                if (!parameters.adParameters || !parameters.adParameters.length) {
                    adInstance.tracking.send('Impression');

                    if (parameters.tracking) {
                        parameters.tracking.send('Started');
                        parameters.tracking.send('Start');
                        if (parameters.duration && parameters.duration > 0) {
                            var quartile = Math.round(parameters.duration / 4);
                            if (quartile > 0) {
                                if (parameters.tracking.hasEvent('FirstQuartile')) {
                                    _timers['FirstQuartile'] = setTimeout(function(){
                                        window.adPlayerEventHandler.onAdFirstQuartile(playerId);
                                    }, quartile * 1);
                                }
                                if (parameters.tracking.hasEvent('MidPoint')) {
                                    _timers['MidPoint'] = setTimeout(function(){
                                        window.adPlayerEventHandler.onAdMidPoint(playerId);
                                    }, quartile * 2);
                                }
                                if (parameters.tracking.hasEvent('ThirdQuartile')) {
                                    _timers['ThirdQuartile'] = setTimeout(function(){
                                        window.adPlayerEventHandler.onAdThirdQuartile(playerId);
                                    }, quartile * 3);
                                }
                            }
                        }
                    }
                }
            },

            onAdVideoComplete: function (playerId) {
                if (_firedEvents['ad.complete']) {
                    return;
                }
                clearTimers();
                _firedEvents['ad.complete'] = true;
                self.trigger('ad.complete');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('Complete');
                }
            },

            onAdMidPoint: function (playerId) {
                if (_firedEvents['ad.mid-point']) {
                    return;
                }
                _firedEvents['ad.mid-point'] = true;
                self.trigger('ad.mid-point');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('MidPoint');
                }
            },

            onAdPaused: function (playerId) {
                // todo, pause all timers
                self.trigger('ad.paused');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('Paused');
                }
            },

            onAdResume: function (playerId) {
                // todo, resume all timers
                self.trigger('ad.resume');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('Resume');
                }
            },

            onAdFirstQuartile: function (playerId) {
                if (_firedEvents['ad.first-quartile']) {
                    return;
                }
                _firedEvents['ad.first-quartile'] = true;
                self.trigger('ad.first-quartile');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('FirstQuartile');
                }
            },

            onAdThirdQuartile: function (playerId) {
                if (_firedEvents['ad.third-quartile']) {
                    return;
                }
                _firedEvents['ad.third-quartile'] = true;
                self.trigger('ad.third-quartile');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('ThirdQuartile');
                }
            },

            onAdPlaying: function (playerId) {
                if (_firedEvents['ad.playing']) {
                    return;
                }
                _firedEvents['ad.playing'] = true;
                self.trigger('ad.playing');
                if ((!parameters.adParameters || !parameters.adParameters.length) && parameters.tracking) {
                    parameters.tracking.send('Playing');
                }
            }, 

            onAdClick: function (playerId){ 
                self.trigger('ad.click');
                if ((!parameters.adParameters || !parameters.adParameters.length)) {
                    if (parameters.target) {
                        var win = window.open(parameters.target, '_blank');
                        if(win){
                            win.focus();
                            if (parameters.tracking) {
                                parameters.tracking.send('Click');
                            }
                        } else {
                            self.trigger('ad.blocker');
                        }
                    }
                }
            }
        };

        swfobject.embedSWF(
            'sponsors/spotxchange/player-1.0.swf', 
            'flashContent',
            mediafile.width,
            mediafile.height,
            '10.0.0',
            '',
            {
                adPlayerId: _uniqId
            }, 
            {
                quality:           'high',
                bgcolor:           '#ffffff',
                allowscriptaccess: 'always',
                allowfullscreen:   'true',
                menu:              'true', 
                wmode:             'transparent'
            }, 
            {
                id:      'flash-ad-player',
                name:    'flash-ad-player',
                align:   'middle', 
                onmouseup: 'adPlayerEventHandler.onAdClick(' + _uniqId + ')'
            }
        );
        swfobject.createCSS("#flashContent", 'display:block;text-align:center;');

        return this;
    };


    return VastPlayerMediaFileFlash;

})(module.players.Base);

module.players.mediafile.Html5 = (function(Modernizr, VastPlayerBase) {

    var _uniqId = 0;

    /**
     * VastPlayerMediaFileHtml5 constructor.
     */
    function VastPlayerMediaFileHtml5() {
        VastPlayerBase.apply(this, arguments);
    };
    VastPlayerMediaFileHtml5.prototype             = new VastPlayerBase();
    VastPlayerMediaFileHtml5.prototype.constructor = VastPlayerMediaFileHtml5;

    /**
     * Class properties.
     */
    Object.defineProperties(VastPlayerMediaFileHtml5, {
        compatible: {
             get: function () {
                return Modernizr && Modernizr.video;
             }
        }
    });

    VastPlayerMediaFileHtml5.prototype._append = function(container, mediafile, parameters) {
        _uniqId++;

        var
            ratio  = 1,
            srcElm = document.createElement('source'),
            vidElm = document.createElement('video');

        srcElm.src  = mediafile.url;
        srcElm.type = mediafile.mimetype

        if (mediafile.width > VastPlayerBase.MAX_HEIGHT) {
            ratio = vidElm.width / VastPlayerBase.MAX_HEIGHT;
        }

        vidElm.id     = 'mediafile-html5-' + _uniqId;
        vidElm.width  = Math.round(mediafile.width * ratio);
        vidElm.height = Math.round(mediafile.height * ratio);

        vidElm.appendChild(srcElm);
        container.appendChild(vidElm);

        return this;
    };

    VastPlayerMediaFileHtml5.prototype._init = function(adInstance, mediafile, parameters) {
        var
            self         = this,
            _videoElm    = document.getElementById('mediafile-html5-' + _uniqId);
            _firedEvents = {},
            _muted       = false;

        _videoElm.addEventListener('error', function(event) {
            self.trigger('error', []);
        }, true);

        _videoElm.addEventListener('timeupdate', function(event) {
            if (_videoElm.duration < 1) {
                return;
            }

            if (!_firedEvents['ad.started']) {
                _firedEvents['ad.started'] = true;
                self.trigger('ad.started');

                if (parameters.tracking) {
                    adInstance.tracking.send('Impression');
                    parameters.tracking.send('Started');
                    parameters.tracking.send('Start');
                }
            }

            if (parameters.tracking) {
                var _quartile = Math.round(_videoElm.duration / 4);
                if (_quartile > 0) {
                    if (!_firedEvents['ad.first-quartile'] && _videoElm.currentTime <= _quartile) {
                        _firedEvents['ad.first-quartile'] = true;
                        self.trigger('ad.first-quartile');
                        parameters.tracking.send('FirstQuartile');
                    }

                    if (!_firedEvents['ad.mid-point'] && _videoElm.currentTime <= _quartile*2) {
                        _firedEvents['ad.mid-point'] = true;
                        self.trigger('ad.mid-point');
                        parameters.tracking.send('MidPoint');
                    }

                    if (!_firedEvents['ad.third-quartile'] && _videoElm.currentTime <= _quartile*3) {
                        _firedEvents['ad.third-quartile'] = true;
                        self.trigger('ad.third-quartile');
                        parameters.tracking.send('ThirdQuartile');
                    }
                }
            }
        }, true);

        _videoElm.addEventListener('ended', function(event) {
            if (!_firedEvents['ad.complete']) {
                _firedEvents['ad.complete'] = true;
                self.trigger('ad.complete');

                if (parameters.tracking) {
                    parameters.tracking.send('Complete');
                }
            }
        }, true);

        _videoElm.addEventListener('play', function(event) {
            if (_videoElm.paused) {
                self.trigger('ad.resume');

                if (parameters.tracking) {
                    parameters.tracking.send('Resume');
                }
            } else {
                if (!_firedEvents['ad.playing']) {
                    _firedEvents['ad.playing'] = true;
                    self.trigger('ad.playing');

                    if (parameters.tracking) {
                        parameters.tracking.send('Playing');
                    }
                }
            }
        }, true);

        _videoElm.addEventListener('pause', function(event) {
            self.trigger('ad.paused');

            if (parameters.tracking) {
                parameters.tracking.send('Paused');
                parameters.tracking.send('Pause');
            }
        }, true);

        _videoElm.addEventListener('volumechange', function(event) {
            if (video.muted) {
                if (!_muted) {
                    _muted = true;
                    self.trigger('ad.muted');

                    if (parameters.tracking) {
                        parameters.tracking.send('Muted');
                        parameters.tracking.send('Mute');
                    }
                }
            } else {
                if (_muted) {
                    _muted = false;
                    self.trigger('ad.unmuted');

                    if (parameters.tracking) {
                        parameters.tracking.send('UnMuted');
                        parameters.tracking.send('UnMute');
                    }
                }
            }
        }, false);

        _videoElm.addEventListener('click', function(event) {
            self.trigger('ad.click');
            if (parameters.target) {
                var win = window.open(parameters.target, '_blank');
                if(win){
                    win.focus();
                    if (parameters.tracking) {
                        parameters.tracking.send('Click');
                    }
                } else {
                    self.trigger('ad.blocker');
                }
            }
        }, true);


        // rewind

        // fullscreen
        
        if (_firedEvents['ready']) {
            return;
        }
        _firedEvents['ready'] = true;
        this.trigger('ready');
        _videoElm.play();

        return this;
    };


    return VastPlayerMediaFileHtml5;

})(Modernizr, module.players.Base);

module.models.Tracking = (function() {

    /**
     * VastModelTracking model constructor.
     */
    function VastModelTracking() {
        this._events = [];
    };
    VastModelTracking.prototype.constructor = VastModelTracking;

    VastModelTracking.prototype.addEvent = function(name, url) {
        this._events.push({ name: name, url: url });
        return this;
    };

    VastModelTracking.prototype.hasEvent = function(name) {
        var results = [];

        name = name.toLowerCase();
        for (var i=0; i<this._events.length; i++) {
            if (this._events[i].name.toLowerCase() === name) {
                return true;
            }
        }

        return false;
    };

    VastModelTracking.prototype.getEvent = function(name) {
        var results = [];

        name = name.toLowerCase();
        for (var i=0; i<this._events.length; i++) {
            if (this._events[i].name.toLowerCase() === name) {
                results.push(this._events[i].url);
            }
        }

        return results;
    };

    VastModelTracking.prototype.send = function(name) {
        var
            senders = [],
            urls    = this.getEvent(name);

        if (urls.length) {
            for (var i=0; i<urls.length; i++) {
                senders.push(new Image(1,1));
                senders[i].src = urls[i];
            }
        }

        return results;
    };

    VastModelTracking.prototype.clone = function() {
        var result = new this.constructor();

        result._events = this._events.slice(0);

        return result;
    };


    return VastModelTracking;

})();

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

module.models.CreativeLinear = (function(VastModelTracking) {

    /**
     * VastModelCreativeLinear model constructor.
     */
    function VastModelCreativeLinear(duration, target) {
        this.duration   = duration;
        this.target     = target;
        this.mediafiles = [];
        this.parameters = null;
        this.tracking   = new VastModelTracking();
    };
    VastModelCreativeLinear.prototype.constructor = VastModelCreativeLinear;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastModelCreativeLinear.prototype, {
        type: {
            /**
             * Get sponsor type.
             *
             * @returns {String}
             */
            get: function () {
                return 'linear';
            }
        }, 
        playerParameters: {
            /**
             * Get player's parameters.
             *
             * @returns {Object}
             */
            get: function () {
                var
                    durations,
                    duration = 0;

                if (this.duration && this.duration.length) {
                    durations = this.duration.split(':');
                    if (durations.length === 3) {
                        //convert a duration (exemple 00:00:15) to milliseconds
                        duration = (parseInt(durations[0]) * 3600000) + (parseInt(durations[1]) * 60000) + (parseInt(durations[2]) * 1000);
                    }
                    
                }
                return {
                    duration:     duration,
                    tracking:     this.tracking,
                    adParameters: this.parameters, 
                    target:       this.target
                };
            }
        }
    });

    VastModelCreativeLinear.prototype.clone = function() {
        var result = new this.constructor(this.duration, this.target);

        if (this.parameters) {
            if (this.parameters.constructor === Array) {
                result.parameters = this.parameters.slice(0);
            } else if (typeof this.parameters === 'object') {
                result.parameters = JSON.parse(JSON.stringify(this.parameters))
            } else {
                result.parameters = this.parameters;
            }
        }

        result.tracking = this.tracking.clone();

        for (var i=0; i<this.mediafiles.length; i++) {
            result.mediafiles.push(this.mediafiles[0].clone());
        }

        return result;
    };


    return VastModelCreativeLinear;

})(module.models.Tracking);

module.xml.Loader = (function() {

    function VastXmlLoaderCompatibilityError(message) {
        this.name    = 'CompatibilityError';
        this.message = message;
    }
    VastXmlLoaderCompatibilityError.prototype             = Error.prototype;
    VastXmlLoaderCompatibilityError.prototype.constructor = VastXmlLoaderCompatibilityError;


    function VastXmlLoaderParameterError(message) {
        this.name    = 'ParameterError';
        this.message = message;
    }
    VastXmlLoaderParameterError.prototype             = Error.prototype;
    VastXmlLoaderParameterError.prototype.constructor = VastXmlLoaderParameterError;


    var _xhhtpCreator = null;
    if (window.XMLHttpRequest) {
       _xhhtpCreator = function() { return new window.XMLHttpRequest(); };
    } else if (window.ActiveXObject) {
        // IE 5/6
       _xhhtpCreator = function() { return new window.ActiveXObject("Microsoft.XMLHTTP"); };
    }

    /**
     * Vast xml loader constructor.
     *
     */
    function VastXmlLoader(url) {
        this.url      = url;
        this._content = null;
    };
    // Apply constructor.
    VastXmlLoader.prototype.constructor = VastXmlLoader;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastXmlLoader.prototype, {
        compatible: {
             get: function () {
                if (window.jQuery && window.jQuery.ajax) {
                    return true;
                }

                return _xhhtpCreator !== null;
             }
        }
    });

    /**
     * load the XML.
     *
     * @public
     * @returns {Self}
     */
    VastXmlLoader.prototype.load = function(url) {
        if (url && url !== this.url) {
            this.url      = url;
            this._content = null;
        }

        if (!this.compatible) {
            throw new VastXmlLoaderCompatibilityError('');
        }

        if (!this.url) {
            throw new VastXmlLoaderParameterError('An url is required!');
        }

        var xmlDoc;

        if (window.jQuery && window.jQuery.ajax) {
            window.jQuery.ajax({
                async:    false,
                type:     'GET',
                url:      url,
                dataType: 'xml',
                success: function (xml) {
                    xmlDoc = xml;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new VastXmlLoaderCompatibilityError(textStatus);
                }
            });
        } else {
            xhttp = _xhhtpCreator();

            xhttp.overrideMimeType('text/xml');
            xhttp.open("GET", this.url, false);
            xhttp.send(null);

            xmlDoc = xhttp.responseXML;
        }

        return xmlDoc;
    };


    return VastXmlLoader;

})();

module.xml.Parser = (function(VastXmlLoader, VastModelAd, VastModelCompanion, VastModelCreativeCompanion, VastModelCreativeLinear, VastModelMediaFile, VastModelTracking) {

    function VastXmlParserInvalidError(message) {
        this.name    = 'ParameterError';
        this.message = message;
    }
    VastXmlParserInvalidError.prototype             = Error.prototype;
    VastXmlParserInvalidError.prototype.constructor = VastXmlParserInvalidError;


    function _parseNodeText (node) {
        return node && (node.textContent || node.text);
    };

    function _childByName (node, name) {
        if (node) {
            var child, _i, _len, _ref;
            _ref = node.childNodes;

            if (_ref) {
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    if (child.nodeName === name) {
                        return child;
                    }
                }
            }
        }

        return false;
    };

    function _childsByName (node, name) {
        if (node) {
            var child, childs, _i, _len, _ref;
            childs = [];
            _ref   = node.childNodes;

            if (_ref) {
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    child = _ref[_i];
                    if (child.nodeName === name) {
                        childs.push(child);
                    }
                }
            }
        }

        return childs;
    };

    function _xmlToJson(xml) {
        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.value;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.value;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item     = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = _xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old       = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(_xmlToJson(item));
                }
            }
        }
        return obj;
    };

    function _parseTracking(xmlNode, trackingRecord) {
        var 
            i, 
            nodes = _childsByName(_childByName(xmlNode, 'TrackingEvents'), 'Tracking');

        if (!trackingRecord) {
            trackingRecord = new VastModelTracking();
        }
        if (nodes && nodes.length) {
            for (i=0; i<nodes.length; i++) {
                trackingRecord.addEvent(nodes[i].getAttribute('event'), _parseNodeText(nodes[i]));
            }
        }

        return trackingRecord;
    };

    function _parseMediaFiles(xmlNode) {
        var 
            i, 
            nodes   = _childsByName(_childByName(xmlNode, 'MediaFiles'), 'MediaFile');
            results = [];

        if (nodes && nodes.length) {
            for (i=0; i<nodes.length; i++) {
                results.push(new VastModelMediaFile(
                    _parseNodeText(nodes[i]),
                    nodes[i].getAttribute('delivery'),
                    nodes[i].getAttribute('type'),
                    nodes[i].getAttribute('apiFramework'),
                    nodes[i].getAttribute('bitrate'),
                    nodes[i].getAttribute('width'),
                    nodes[i].getAttribute('height')
                ));
            }
        }

        return results;
    };

    function _getCompanionType(xmlNode) {
        var result, mimetype, pos, nodes;

        if (!result) {
            nodes = _childsByName(xmlNode, 'StaticResource');
            if (nodes && nodes.length > 0) {
                result   = ['static', _parseNodeText(nodes[0])];
                mimetype = nodes[0].getAttribute('creativeType');
                if (mimetype) {
                    pos    = mimetype.indexOf('/');
                    if (pos !== -1) {
                        result[0] = mimetype.substr(0, pos);
                    } else {
                        result[0] = mimetype;
                    }
                }
            }
        }
        
        if (!result) {
            nodes = _childsByName(xmlNode, 'HTMLResource');
            if (nodes && nodes.length > 0) {
                result = ['html', _parseNodeText(nodes[0])];
            }
        }

        if (!result) {
            nodes = _childsByName(xmlNode, 'Code');
            if (nodes && nodes.length > 0) {
                result = ['html', _parseNodeText(nodes[0])];
            }
        }

        if (!result) {
            nodes = _childsByName(xmlNode, 'IFrameResource');
            if (nodes && nodes.length > 0) {
                result = ['iframe', _parseNodeText(nodes[0])];
            }
        }

        return result;
    }

    function _parseCreativeLinear(xmlNode) {
        var
            creativeRecord, 
            clickTracking = _parseNodeText(_childByName(_childByName(xmlNode, 'VideoClicks'), 'ClickTracking'));

        creativeRecord = new VastModelCreativeLinear(
            _parseNodeText(_childByName(xmlNode, 'Duration')),
            _parseNodeText(_childByName(_childByName(xmlNode, 'VideoClicks'), 'ClickThrough'))
        );

        creativeRecord.parameters = _parseNodeText(_childByName(xmlNode, 'AdParameters'))
        creativeRecord.mediafiles = _parseMediaFiles(xmlNode);
        _parseTracking(xmlNode, creativeRecord.tracking);

        if (clickTracking && clickTracking.length) {
            creativeRecord.tracking.addEvent('click', clickTracking);
        }

        return creativeRecord;
    }

    function _parseCreativeCompanionAds(xmlNode) {
        var creativeRecord, nodes, companionRecord, type;

        creativeRecord = new VastModelCreativeCompanion();
        nodes          = _childsByName(xmlNode, 'Companion');

        for (i=0; i<nodes.length; i++) {
            type = _getCompanionType(nodes[i]);
            companionRecord = new VastModelCompanion(
                nodes[i].getAttribute('width'), 
                nodes[i].getAttribute('height'), 
                type[0], 
                type[1],
                _parseNodeText(_childByName(nodes[i], 'CompanionClickThrough'))
            );
            _parseTracking(nodes[i], companionRecord.tracking);
            creativeRecord.companions.push(companionRecord);
        }

        return creativeRecord;
    }

    function _parse(xmlDoc) {
        var
            adTypeNodes, 
            nodeTypes = ['InLine', 'Wrapper'],
            results   = [],
            adNodes   = xmlDoc.getElementsByTagName("Ad");

        function __createOrEnhanceRecord(id, node, record) {
            var
                adTypeNodes, type, title, desc, system, nodes, adRecord,
                nodeTypes = {
                    Linear:       _parseCreativeLinear, 
                    CompanionAds: _parseCreativeCompanionAds
                };

            type = node.nodeName;

            nodes  = node.getElementsByTagName("AdSystem");
            system = _parseNodeText(nodes[0]);

            nodes = node.getElementsByTagName("AdTitle");
            title = _parseNodeText(nodes[0]);

            nodes = node.getElementsByTagName("Description");
            desc  = _parseNodeText(nodes[0]);

            if (record && record.constructor === VastModelAd) {
                adRecord = VastModelAd.createFromInstance(record, id, type, system, title, desc);
            } else {
                adRecord = new VastModelAd(id, type, system, title, desc);
            }

            // tracking
            nodes = _childByName(node, 'Error');
            if (nodes) {
                adRecord.tracking.addEvent('error', _parseNodeText(nodes));
            }

            // impressions
            nodes = _childsByName(node, 'Impression');
            if (nodes && nodes.length > 0) {
                for (var y=0; y<nodes.length; y++) {
                    adRecord.tracking.addEvent('impression', _parseNodeText(nodes[y]));
                }
            }

            // creatives
            nodes = _childsByName(_childByName(node, 'Creatives'), 'Creative');
            if (nodes && nodes.length > 0) {
                for (var y=0; y<nodes.length; y++) {
                    for (var yy in nodeTypes) {
                        adTypeNodes = nodes[y].getElementsByTagName(yy);
                        if (adTypeNodes && adTypeNodes.length > 0) {
                            for (var yyy=0; yyy<adTypeNodes.length; yyy++) {
                                adRecord.addCreative(nodeTypes[yy](adTypeNodes[yyy]))
                            }
                        }
                    }
                }
            }

            // extensions
            nodes = _childsByName(_childByName(node, 'Extensions'), 'Extension');
            if (nodes && nodes.length > 0) {
                for (var y=0; y<nodes.length; y++) {
                    adRecord.extensions.push(_xmlToJson(nodes[y]));
                }
            }

            if (adRecord.isWrapper) {
                (function() {
                    var
                        _xmlDoc, 
                        _xmlLoader = new VastXmlLoader();

                    nodes = node.getElementsByTagName("VASTAdTagURI");
                    if (nodes && nodes.length > 0) {
                        _xmlDoc = _xmlLoader.load(_parseNodeText(nodes[0]));
                    } else {
                        nodes = node.getElementsByTagName("VASTAdTagURL");
                        if (nodes && nodes.length > 0) {
                            _xmlDoc = _xmlLoader.load(_parseNodeText(nodes[0]));
                        }
                    }

                    if (_xmlDoc) {
                        nodes = _xmlDoc.getElementsByTagName('InLine');
                        if (nodes && nodes.length > 0) {
                            for (var y=0; y<nodes.length; y++) {
                                adRecord = __createOrEnhanceRecord(id, nodes[y], adRecord);
                            }
                        }
                    }
                })();
            }

            return adRecord;
        }

        for (var i=0; i<adNodes.length; i++) {
            for (var ii=0; ii<nodeTypes.length; ii++) {
                adTypeNodes = adNodes[i].getElementsByTagName(nodeTypes[ii]);
                if (adTypeNodes && adTypeNodes.length) {
                    for (var iii=0; iii<adTypeNodes.length; iii++) {
                        results.push(__createOrEnhanceRecord(adNodes[i].getAttribute('id'), adTypeNodes[iii]));
                    }
                }
            }
        }

        return results;
    }


    /**
     * Vast xml parser constructor.
     *
     */
    function VastXmlParser(xmlDoc) {
        this.xmlDoc         = xmlDoc;
        this._valid         = null;
        this._parsedContent = null;
    };
    // Apply constructor.
    VastXmlParser.prototype.constructor = VastXmlParser;

    /**
     * Instance properties.
     */
    Object.defineProperties(VastXmlParser.prototype, {
        version: {
             get: function () {
                if (!this.valid) {
                    return null;
                }

                return this.xmlDoc.firstChild.getAttribute('version');
             }
        },
        valid: {
             get: function () {
                if (this._valid === null) {
                    this._valid = false;
                    if (
                        this.xmlDoc 
                        && this.xmlDoc.firstChild 
                        && this.xmlDoc.firstChild.nodeName 
                        && (this.xmlDoc.firstChild.nodeName + '').toUpperCase() === 'VAST'
                    ) {
                        this._valid = true;
                    }
                }

                return this._valid;
             }
        }
    });

    /**
     * Parse the XML.
     *
     * @public
     * @returns {Self}
     */
    VastXmlParser.prototype.parse = function(xmlDoc) {
        if (xmlDoc && xmlDoc !== this.xmlDoc) {
            this.xmlDoc         = xmlDoc;
            this._valid         = null;
            this._parsedContent = null;
        }

        if (!this.valid) {
            throw new VastXmlParserInvalidError('Xml is not a valid VAST format.');
        }

        if (this._parsedContent === null) {
            this._parsedContent = _parse(this.xmlDoc);
        }

        return this._parsedContent;
    };


    return VastXmlParser;

})(module.xml.Loader, module.models.Ad, module.models.Companion, module.models.CreativeCompanion, module.models.CreativeLinear, module.models.MediaFile, module.models.Tracking);

module.VastClient = (function(VastXmlLoader, VastXmlParser) {

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
        var xmlDoc = this._xmlLoader.load(vastUrl);
        this.trigger('xml.loaded', [xmlDoc]);

        var vastData = this._xmlParser.parse(xmlDoc);
        this.trigger('xml.parsed', [vastData]);

        var
            ad, creative, playerObject,
            self   = this,
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
                                player = new playerObject.player(this.container);
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
                                player = new playerObject.player(this.container);
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
            this.trigger('empty', [vastData]);
            return this;
        }

        player.bind('*', function(key, parameters) {
            self.trigger('player.' + key, [player, playerObject, creative, parameters]);
        });
        player.print(ad, playerObject, creative.playerParameters);

        return this;
    };


    return VastClient;

})(module.xml.Loader, module.xml.Parser);


    return module;    
});