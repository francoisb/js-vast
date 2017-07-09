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
