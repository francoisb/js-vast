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
