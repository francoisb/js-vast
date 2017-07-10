module.compatibility.video = (function() {

    var
        result,
        yes      = ['probably', 'maybe'],
        videoElm = document.createElement('video');

    if (typeof videoElm !== 'undefined' && videoElm.canPlayType) {
        result = {
            ogg:  yes.indexOf(videoElm.canPlayType('video/ogg; codecs="theora"')) !== -1,
            h264: yes.indexOf(videoElm.canPlayType('video/mp4; codecs="avc1.42E01E"')) !== -1,
            webm: yes.indexOf(videoElm.canPlayType('video/webm; codecs="vp8, vorbis"')) !== -1
        };
    } else {
        result = false;
    }

    return result;

})();
