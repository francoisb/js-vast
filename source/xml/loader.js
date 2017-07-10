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
            var xhttp = _xhhtpCreator();

            xhttp.overrideMimeType('text/xml');
            xhttp.open("GET", this.url, false);
            xhttp.send(null);

            xmlDoc = xhttp.responseXML;
        }

        return xmlDoc;
    };


    return VastXmlLoader;

})();
