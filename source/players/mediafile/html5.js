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
