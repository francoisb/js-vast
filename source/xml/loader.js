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
    VastXmlLoader.prototype.load = function(url, onSuccess, onError) {
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

        if (window.jQuery && window.jQuery.ajax) {
            window.jQuery.ajax({
                async:    true,
                type:     'GET',
                url:      url,
                dataType: 'xml',
                success: function (xml) {
                    onSuccess(xml);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    onError(textStatus, errorThrown);
                    throw new VastXmlLoaderCompatibilityError(textStatus);
                }
            });
        } else {
            var xhttp = _xhhtpCreator();

            xhttp.overrideMimeType('text/xml');
            xhttp.onload = function() {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        onSuccess(xhttp.responseXML);
                    } else {
                        onError(textStatus, null);
                        throw new VastXmlLoaderCompatibilityError(xhttp.statusText);
                    }
                }
            };
            xhttp.onerror = function(err) {
                onError(textStatus, err);
                throw new VastXmlLoaderCompatibilityError(xhttp.statusText);
            };
            xhttp.open('GET', this.url, false);
            xhttp.send(null);
        }

        return this;
    };


    return VastXmlLoader;

})();
