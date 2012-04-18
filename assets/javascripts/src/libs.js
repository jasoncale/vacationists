/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if (typeof deconcept == "undefined") {
    var deconcept = new Object();
}
if (typeof deconcept.util == "undefined") {
    deconcept.util = new Object();
}
if (typeof deconcept.SWFObjectUtil == "undefined") {
    deconcept.SWFObjectUtil = new Object();
}
deconcept.SWFObject = function(_1, id, w, h, _5, c, _7, _8, _9, _a) {
    if (!document.getElementById) {
        return;
    }
    this.DETECT_KEY = _a ? _a: "detectflash";
    this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Array();
    if (_1) {
        this.setAttribute("swf", _1);
    }
    if (id) {
        this.setAttribute("id", id);
    }
    if (w) {
        this.setAttribute("width", w);
    }
    if (h) {
        this.setAttribute("height", h);
    }
    if (_5) {
        this.setAttribute("version", new deconcept.PlayerVersion(_5.toString().split(".")));
    }
    this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
    if (!window.opera && document.all && this.installedVer.major > 7) {
        deconcept.SWFObject.doPrepUnload = true;
    }
    if (c) {
        this.addParam("bgcolor", c);
    }
    var q = _7 ? _7: "high";
    this.addParam("quality", q);
    this.setAttribute("useExpressInstall", false);
    this.setAttribute("doExpressInstall", false);
    var _c = (_8) ? _8: window.location;
    this.setAttribute("xiRedirectUrl", _c);
    this.setAttribute("redirectUrl", "");
    if (_9) {
        this.setAttribute("redirectUrl", _9);
    }
};
deconcept.SWFObject.prototype = {
    useExpressInstall: function(_d) {
        this.xiSWFPath = !_d ? "expressinstall.swf": _d;
        this.setAttribute("useExpressInstall", true);
    },
    setAttribute: function(_e, _f) {
        this.attributes[_e] = _f;
    },
    getAttribute: function(_10) {
        return this.attributes[_10];
    },
    addParam: function(_11, _12) {
        this.params[_11] = _12;
    },
    getParams: function() {
        return this.params;
    },
    addVariable: function(_13, _14) {
        this.variables[_13] = _14;
    },
    getVariable: function(_15) {
        return this.variables[_15];
    },
    getVariables: function() {
        return this.variables;
    },
    getVariablePairs: function() {
        var _16 = new Array();
        var key;
        var _18 = this.getVariables();
        for (key in _18) {
            _16[_16.length] = key + "=" + _18[key];
        }
        return _16;
    },
    getSWFHTML: function() {
        var _19 = "";
        if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "PlugIn");
                this.setAttribute("swf", this.xiSWFPath);
            }
            _19 = "<embed type=\"application/x-shockwave-flash\" src=\"" + this.getAttribute("swf") + "\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\"";
            _19 += " id=\"" + this.getAttribute("id") + "\" name=\"" + this.getAttribute("id") + "\" ";
            var _1a = this.getParams();
            for (var key in _1a) {
                _19 += [key] + "=\"" + _1a[key] + "\" ";
            }
            var _1c = this.getVariablePairs().join("&");
            if (_1c.length > 0) {
                _19 += "flashvars=\"" + _1c + "\"";
            }
            _19 += "/>";
        } else {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "ActiveX");
                this.setAttribute("swf", this.xiSWFPath);
            }
            _19 = "<object id=\"" + this.getAttribute("id") + "\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\">";
            _19 += "<param name=\"movie\" value=\"" + this.getAttribute("swf") + "\" />";
            var _1d = this.getParams();
            for (var key in _1d) {
                _19 += "<param name=\"" + key + "\" value=\"" + _1d[key] + "\" />";
            }
            var _1f = this.getVariablePairs().join("&");
            if (_1f.length > 0) {
                _19 += "<param name=\"flashvars\" value=\"" + _1f + "\" />";
            }
            _19 += "</object>";
        }
        return _19;
    },
    write: function(_20) {
        if (this.getAttribute("useExpressInstall")) {
            var _21 = new deconcept.PlayerVersion([6, 0, 65]);
            if (this.installedVer.versionIsValid(_21) && !this.installedVer.versionIsValid(this.getAttribute("version"))) {
                this.setAttribute("doExpressInstall", true);
                this.addVariable("MMredirectURL", escape(this.getAttribute("xiRedirectUrl")));
                document.title = document.title.slice(0, 47) + " - Flash Player Installation";
                this.addVariable("MMdoctitle", document.title);
            }
        }
        if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) {
            var n = (typeof _20 == "string") ? document.getElementById(_20) : _20;
            n.innerHTML = this.getSWFHTML();
            return true;
        } else {
            if (this.getAttribute("redirectUrl") != "") {
                document.location.replace(this.getAttribute("redirectUrl"));
            }
        }
        return false;
    }
};
deconcept.SWFObjectUtil.getPlayerVersion = function() {
    var _23 = new deconcept.PlayerVersion([0, 0, 0]);
    if (navigator.plugins && navigator.mimeTypes.length) {
        var x = navigator.plugins["Shockwave Flash"];
        if (x && x.description) {
            _23 = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
        }
    } else {
        if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
            var axo = 1;
            var _26 = 3;
            while (axo) {
                try {
                    _26++;
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + _26);
                    _23 = new deconcept.PlayerVersion([_26, 0, 0]);
                } catch(e) {
                    axo = null;
                }
            }
        } else {
            try {
                var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
            } catch(e) {
                try {
                    var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    _23 = new deconcept.PlayerVersion([6, 0, 21]);
                    axo.AllowScriptAccess = "always";
                } catch(e) {
                    if (_23.major == 6) {
                        return _23;
                    }
                }
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                } catch(e) {}
            }
            if (axo != null) {
                _23 = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
            }
        }
    }
    return _23;
};
deconcept.PlayerVersion = function(_29) {
    this.major = _29[0] != null ? parseInt(_29[0]) : 0;
    this.minor = _29[1] != null ? parseInt(_29[1]) : 0;
    this.rev = _29[2] != null ? parseInt(_29[2]) : 0;
};
deconcept.PlayerVersion.prototype.versionIsValid = function(fv) {
    if (this.major < fv.major) {
        return false;
    }
    if (this.major > fv.major) {
        return true;
    }
    if (this.minor < fv.minor) {
        return false;
    }
    if (this.minor > fv.minor) {
        return true;
    }
    if (this.rev < fv.rev) {
        return false;
    }
    return true;
};
deconcept.util = {
    getRequestParameter: function(_2b) {
        var q = document.location.search || document.location.hash;
        if (_2b == null) {
            return q;
        }
        if (q) {
            var _2d = q.substring(1).split("&");
            for (var i = 0; i < _2d.length; i++) {
                if (_2d[i].substring(0, _2d[i].indexOf("=")) == _2b) {
                    return _2d[i].substring((_2d[i].indexOf("=") + 1));
                }
            }
        }
        return "";
    }
};
deconcept.SWFObjectUtil.cleanupSWFs = function() {
    var _2f = document.getElementsByTagName("OBJECT");
    for (var i = _2f.length - 1; i >= 0; i--) {
        _2f[i].style.display = "none";
        for (var x in _2f[i]) {
            if (typeof _2f[i][x] == "function") {
                _2f[i][x] = function() {};
            }
        }
    }
};
if (deconcept.SWFObject.doPrepUnload) {
    if (!deconcept.unloadSet) {
        deconcept.SWFObjectUtil.prepUnload = function() {
            __flash_unloadHandler = function() {};
            __flash_savedUnloadHandler = function() {};
            window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs);
        };
        window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
        deconcept.unloadSet = true;
    }
}
if (!document.getElementById && document.all) {
    document.getElementById = function(id) {
        return document.all[id];
    };
}
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;

var jwplayer = function(a) {
    if (jwplayer.api) {
        return jwplayer.api.selectPlayer(a)
    }
};
var $jw = jwplayer;
jwplayer.version = "5.5.1641";
jwplayer.vid = document.createElement("video");
jwplayer.audio = document.createElement("audio");
jwplayer.source = document.createElement("source"); (function(b) {
    b.utils = function() {};
    b.utils.typeOf = function(d) {
        var c = typeof d;
        if (c === "object") {
            if (d) {
                if (d instanceof Array) {
                    c = "array"
                }
            } else {
                c = "null"
            }
        }
        return c
    };
    b.utils.extend = function() {
        var c = b.utils.extend["arguments"];
        if (c.length > 1) {
            for (var e = 1; e < c.length; e++) {
                for (var d in c[e]) {
                    c[0][d] = c[e][d]
                }
            }
            return c[0]
        }
        return null
    };
    b.utils.clone = function(f) {
        var c;
        var d = b.utils.clone["arguments"];
        if (d.length == 1) {
            switch (b.utils.typeOf(d[0])) {
            case "object":
                c = {};
                for (var e in d[0]) {
                    c[e] = b.utils.clone(d[0][e])
                }
                break;
            case "array":
                c = [];
                for (var e in d[0]) {
                    c[e] = b.utils.clone(d[0][e])
                }
                break;
            default:
                return d[0];
                break
            }
        }
        return c
    };
    b.utils.extension = function(c) {
        c = c.substring(c.lastIndexOf("/") + 1, c.length);
        c = c.split("?")[0];
        if (c.lastIndexOf(".") > -1) {
            return c.substr(c.lastIndexOf(".") + 1, c.length).toLowerCase()
        }
        return
    };
    b.utils.html = function(c, d) {
        c.innerHTML = d
    };
    b.utils.wrap = function(c, d) {
        c.parentNode.replaceChild(d, c);
        d.appendChild(c)
    };
    b.utils.ajax = function(f, e, c) {
        var d;
        if (window.XMLHttpRequest) {
            d = new XMLHttpRequest()
        } else {
            d = new ActiveXObject("Microsoft.XMLHTTP")
        }
        d.onreadystatechange = function() {
            if (d.readyState === 4) {
                if (d.status === 200) {
                    if (e) {
                        e(d)
                    }
                } else {
                    if (c) {
                        c(f)
                    }
                }
            }
        };
        d.open("GET", f, true);
        d.send(null);
        return d
    };
    b.utils.load = function(d, e, c) {
        d.onreadystatechange = function() {
            if (d.readyState === 4) {
                if (d.status === 200) {
                    if (e) {
                        e()
                    }
                } else {
                    if (c) {
                        c()
                    }
                }
            }
        }
    };
    b.utils.find = function(d, c) {
        return d.getElementsByTagName(c)
    };
    b.utils.append = function(c, d) {
        c.appendChild(d)
    };
    b.utils.isIE = function() {
        return ((!+"\v1") || (typeof window.ActiveXObject != "undefined"))
    };
    b.utils.isLegacyAndroid = function() {
        var c = navigator.userAgent.toLowerCase();
        return (c.match(/android 2.[012]/i) !== null)
    };
    b.utils.isIOS = function() {
        var c = navigator.userAgent.toLowerCase();
        return (c.match(/iP(hone|ad)/i) !== null)
    };
    b.utils.getFirstPlaylistItemFromConfig = function(c) {
        var d = {};
        var e;
        if (c.playlist && c.playlist.length) {
            e = c.playlist[0]
        } else {
            e = c
        }
        d.file = e.file;
        d.levels = e.levels;
        d.streamer = e.streamer;
        d.playlistfile = e.playlistfile;
        if (d.file && d.file.toLowerCase().indexOf("youtube.com") > -1) {
            d.provider = "youtube"
        }
        if (d.streamer && d.streamer.toLowerCase().indexOf("rtmp://") == 0) {
            d.provider = "rtmp"
        }
        if (e.type) {
            d.provider = e.type.toLowerCase()
        } else {
            if (e.provider) {
                d.provider = e.provider.toLowerCase()
            }
        }
        return d
    };
    b.utils.getOuterHTML = function(d) {
        if (d.outerHTML) {
            return d.outerHTML
        } else {
            var e = d.parentNode;
            var c = document.createElement(e.tagName);
            var g = document.createElement(d.tagName);
            e.replaceChild(g, d);
            c.appendChild(d);
            var f = c.innerHTML;
            e.replaceChild(d, g);
            return f
        }
    };
    b.utils.setOuterHTML = function(f, e) {
        if (f.outerHTML) {
            f.outerHTML = e
        } else {
            var g = document.createElement("div");
            g.innerHTML = e;
            var c = document.createRange();
            c.selectNodeContents(g);
            var d = c.extractContents();
            f.parentNode.insertBefore(d, f);
            f.parentNode.removeChild(f)
        }
    };
    b.utils.hasFlash = function() {
        return (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] != "undefined") || (typeof window.ActiveXObject != "undefined")
    };
    b.utils.getPluginName = function(c) {
        if (c.lastIndexOf("/") >= 0) {
            c = c.substring(c.lastIndexOf("/") + 1, c.length)
        }
        if (c.lastIndexOf("-") >= 0) {
            c = c.substring(0, c.lastIndexOf("-"))
        }
        if (c.lastIndexOf(".swf") >= 0) {
            c = c.substring(0, c.lastIndexOf(".swf"))
        }
        if (c.lastIndexOf(".js") >= 0) {
            c = c.substring(0, c.lastIndexOf(".js"))
        }
        return c
    };
    b.utils.getAbsolutePath = function(j, h) {
        if (h === undefined) {
            h = document.location.href
        }
        if (j === undefined) {
            return undefined
        }
        if (a(j)) {
            return j
        }
        var k = h.substring(0, h.indexOf("://") + 3);
        var g = h.substring(k.length, h.indexOf("/", k.length + 1));
        var d;
        if (j.indexOf("/") === 0) {
            d = j.split("/")
        } else {
            var e = h.split("?")[0];
            e = e.substring(k.length + g.length + 1, e.lastIndexOf("/"));
            d = e.split("/").concat(j.split("/"))
        }
        var c = [];
        for (var f = 0; f < d.length; f++) {
            if (!d[f] || d[f] === undefined || d[f] == ".") {
                continue
            } else {
                if (d[f] == "..") {
                    c.pop()
                } else {
                    c.push(d[f])
                }
            }
        }
        return k + g + "/" + c.join("/")
    };
    function a(d) {
        if (d === null) {
            return
        }
        var e = d.indexOf("://");
        var c = d.indexOf("?");
        return (e > 0 && (c < 0 || (c > e)))
    }
    b.utils.pluginPathType = {
        ABSOLUTE: "ABSOLUTE",
        RELATIVE: "RELATIVE",
        CDN: "CDN"
    };
    b.utils.getPluginPathType = function(d) {
        if (typeof d != "string") {
            return
        }
        d = d.split("?")[0];
        var e = d.indexOf("://");
        if (e > 0) {
            return b.utils.pluginPathType.ABSOLUTE
        }
        var c = d.indexOf("/");
        var f = b.utils.extension(d);
        if (e < 0 && c < 0 && (!f || !isNaN(f))) {
            return b.utils.pluginPathType.CDN
        }
        return b.utils.pluginPathType.RELATIVE
    };
    b.utils.mapEmpty = function(c) {
        for (var d in c) {
            return false
        }
        return true
    };
    b.utils.mapLength = function(d) {
        var c = 0;
        for (var e in d) {
            c++
        }
        return c
    };
    b.utils.log = function(d, c) {
        if (typeof console != "undefined" && typeof console.log != "undefined") {
            if (c) {
                console.log(d, c)
            } else {
                console.log(d)
            }
        }
    };
    b.utils.css = function(d, g, c) {
        if (d !== undefined) {
            for (var e in g) {
                try {
                    if (typeof g[e] === "undefined") {
                        continue
                    } else {
                        if (typeof g[e] == "number" && !(e == "zIndex" || e == "opacity")) {
                            if (isNaN(g[e])) {
                                continue
                            }
                            if (e.match(/color/i)) {
                                g[e] = "#" + b.utils.strings.pad(g[e].toString(16), 6)
                            } else {
                                g[e] = Math.ceil(g[e]) + "px"
                            }
                        }
                    }
                    d.style[e] = g[e]
                } catch(f) {}
            }
        }
    };
    b.utils.isYouTube = function(c) {
        return c.indexOf("youtube.com") > -1
    };
    b.utils.getYouTubeId = function(c) {
        c.indexOf("youtube.com" > 0)
    };
    b.utils.transform = function(c, d) {
        c.style.webkitTransform = d;
        c.style.MozTransform = d;
        c.style.OTransform = d
    };
    b.utils.stretch = function(h, m, l, f, k, g) {
        if (typeof l == "undefined" || typeof f == "undefined" || typeof k == "undefined" || typeof g == "undefined") {
            return
        }
        var d = l / k;
        var e = f / g;
        var j = 0;
        var i = 0;
        m.style.overflow = "hidden";
        b.utils.transform(m, "");
        var c = {};
        switch (h.toUpperCase()) {
        case b.utils.stretching.NONE:
            c.width = k;
            c.height = g;
            break;
        case b.utils.stretching.UNIFORM:
            if (d > e) {
                c.width = k * e;
                c.height = g * e
            } else {
                c.width = k * d;
                c.height = g * d
            }
            break;
        case b.utils.stretching.FILL:
            if (d > e) {
                c.width = k * d;
                c.height = g * d
            } else {
                c.width = k * e;
                c.height = g * e
            }
            break;
        case b.utils.stretching.EXACTFIT:
            b.utils.transform(m, ["scale(", d, ",", e, ")", " translate(0px,0px)"].join(""));
            c.width = k;
            c.height = g;
            break;
        default:
            break
        }
        c.top = (f - c.height) / 2;
        c.left = (l - c.width) / 2;
        b.utils.css(m, c)
    };
    b.utils.stretching = {
        NONE: "NONE",
        FILL: "FILL",
        UNIFORM: "UNIFORM",
        EXACTFIT: "EXACTFIT"
    }
})(jwplayer); (function(a) {
    a.events = function() {};
    a.events.COMPLETE = "COMPLETE";
    a.events.ERROR = "ERROR"
})(jwplayer); (function(jwplayer) {
    jwplayer.events.eventdispatcher = function(debug) {
        var _debug = debug;
        var _listeners;
        var _globallisteners;
        this.resetEventListeners = function() {
            _listeners = {};
            _globallisteners = []
        };
        this.resetEventListeners();
        this.addEventListener = function(type, listener, count) {
            try {
                if (_listeners[type] === undefined) {
                    _listeners[type] = []
                }
                if (typeof(listener) == "string") {
                    eval("listener = " + listener)
                }
                _listeners[type].push({
                    listener: listener,
                    count: count
                })
            } catch(err) {
                jwplayer.utils.log("error", err)
            }
            return false
        };
        this.removeEventListener = function(type, listener) {
            try {
                for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) {
                    if (_listeners[type][lisenterIndex].toString() == listener.toString()) {
                        _listeners[type].slice(lisenterIndex, lisenterIndex + 1);
                        break
                    }
                }
            } catch(err) {
                jwplayer.utils.log("error", err)
            }
            return false
        };
        this.addGlobalListener = function(listener, count) {
            try {
                if (typeof(listener) == "string") {
                    eval("listener = " + listener)
                }
                _globallisteners.push({
                    listener: listener,
                    count: count
                })
            } catch(err) {
                jwplayer.utils.log("error", err)
            }
            return false
        };
        this.removeGlobalListener = function(listener) {
            try {
                for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) {
                    if (_globallisteners[globalListenerIndex].toString() == listener.toString()) {
                        _globallisteners.slice(globalListenerIndex, globalListenerIndex + 1);
                        break
                    }
                }
            } catch(err) {
                jwplayer.utils.log("error", err)
            }
            return false
        };
        this.sendEvent = function(type, data) {
            if (data === undefined) {
                data = {}
            }
            if (_debug) {
                jwplayer.utils.log(type, data)
            }
            if (typeof _listeners[type] != "undefined") {
                for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) {
                    try {
                        _listeners[type][listenerIndex].listener(data)
                    } catch(err) {
                        jwplayer.utils.log("There was an error while handling a listener: " + err.toString(), _listeners[type][listenerIndex].listener)
                    }
                    if (_listeners[type][listenerIndex].count === 1) {
                        delete _listeners[type][listenerIndex]
                    } else {
                        if (_listeners[type][listenerIndex].count > 0) {
                            _listeners[type][listenerIndex].count = _listeners[type][listenerIndex].count - 1
                        }
                    }
                }
            }
            for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) {
                try {
                    _globallisteners[globalListenerIndex].listener(data)
                } catch(err) {
                    jwplayer.utils.log("There was an error while handling a listener: " + err.toString(), _globallisteners[globalListenerIndex].listener)
                }
                if (_globallisteners[globalListenerIndex].count === 1) {
                    delete _globallisteners[globalListenerIndex]
                } else {
                    if (_globallisteners[globalListenerIndex].count > 0) {
                        _globallisteners[globalListenerIndex].count = _globallisteners[globalListenerIndex].count - 1
                    }
                }
            }
        }
    }
})(jwplayer); (function(a) {
    var b = {};
    a.utils.animations = function() {};
    a.utils.animations.transform = function(c, d) {
        c.style.webkitTransform = d;
        c.style.MozTransform = d;
        c.style.OTransform = d
    };
    a.utils.animations.transformOrigin = function(c, d) {
        c.style.webkitTransformOrigin = d;
        c.style.MozTransformOrigin = d;
        c.style.OTransformOrigin = d
    };
    a.utils.animations.rotate = function(c, d) {
        a.utils.animations.transform(c, ["rotate(", d, "deg)"].join(""))
    };
    a.utils.cancelAnimation = function(c) {
        delete b[c.id]
    };
    a.utils.fadeTo = function(l, f, e, i, h, d) {
        if (b[l.id] != d && d !== undefined) {
            return
        }
        var c = new Date().getTime();
        if (d > c) {
            setTimeout(function() {
                a.utils.fadeTo(l, f, e, i, 0, d)
            },
            d - c)
        }
        l.style.display = "block";
        if (i === undefined) {
            i = l.style.opacity === "" ? 1: l.style.opacity
        }
        if (l.style.opacity == f && l.style.opacity !== "" && d !== undefined) {
            if (f === 0) {
                l.style.display = "none"
            }
            return
        }
        if (d === undefined) {
            d = c;
            b[l.id] = d
        }
        if (h === undefined) {
            h = 0
        }
        var j = (c - d) / (e * 1000);
        j = j > 1 ? 1: j;
        var k = f - i;
        var g = i + (j * k);
        if (g > 1) {
            g = 1
        } else {
            if (g < 0) {
                g = 0
            }
        }
        l.style.opacity = g;
        if (h > 0) {
            b[l.id] = d + h * 1000;
            a.utils.fadeTo(l, f, e, i, 0, b[l.id]);
            return
        }
        setTimeout(function() {
            a.utils.fadeTo(l, f, e, i, 0, d)
        },
        10)
    }
})(jwplayer); (function(a) {
    a.utils.arrays = function() {};
    a.utils.arrays.indexOf = function(c, d) {
        for (var b = 0; b < c.length; b++) {
            if (c[b] == d) {
                return b
            }
        }
        return - 1
    };
    a.utils.arrays.remove = function(c, d) {
        var b = a.utils.arrays.indexOf(c, d);
        if (b > -1) {
            c.splice(b, 1)
        }
    }
})(jwplayer); (function(a) {
    a.utils.extensionmap = {
        "3gp": {
            html5: "video/3gpp",
            flash: "video"
        },
        "3gpp": {
            html5: "video/3gpp"
        },
        "3g2": {
            html5: "video/3gpp2",
            flash: "video"
        },
        "3gpp2": {
            html5: "video/3gpp2"
        },
        flv: {
            flash: "video"
        },
        f4a: {
            html5: "audio/mp4"
        },
        f4b: {
            html5: "audio/mp4",
            flash: "video"
        },
        f4p: {
            html5: "video/mp4",
            flash: "video"
        },
        f4v: {
            html5: "video/mp4",
            flash: "video"
        },
        mov: {
            html5: "video/quicktime",
            flash: "video"
        },
        m4a: {
            html5: "audio/mp4",
            flash: "video"
        },
        m4b: {
            html5: "audio/mp4"
        },
        m4p: {
            html5: "audio/mp4"
        },
        m4v: {
            html5: "video/mp4",
            flash: "video"
        },
        mkv: {
            html5: "video/x-matroska"
        },
        mp4: {
            html5: "video/mp4",
            flash: "video"
        },
        rbs: {
            flash: "sound"
        },
        sdp: {
            html5: "application/sdp",
            flash: "video"
        },
        vp6: {
            html5: "video/x-vp6"
        },
        aac: {
            html5: "audio/aac",
            flash: "video"
        },
        mp3: {
            flash: "sound"
        },
        ogg: {
            html5: "audio/ogg"
        },
        ogv: {
            html5: "video/ogg"
        },
        webm: {
            html5: "video/webm"
        },
        m3u8: {
            html5: "audio/x-mpegurl"
        },
        gif: {
            flash: "image"
        },
        jpeg: {
            flash: "image"
        },
        jpg: {
            flash: "image"
        },
        swf: {
            flash: "image"
        },
        png: {
            flash: "image"
        }
    }
})(jwplayer); (function(e) {
    e.utils.mediaparser = function() {};
    var g = {
        element: {
            width: "width",
            height: "height",
            id: "id",
            "class": "className",
            name: "name"
        },
        media: {
            src: "file",
            preload: "preload",
            autoplay: "autostart",
            loop: "repeat",
            controls: "controls"
        },
        source: {
            src: "file",
            type: "type",
            media: "media",
            "data-jw-width": "width",
            "data-jw-bitrate": "bitrate"
        },
        video: {
            poster: "image"
        }
    };
    var f = {};
    e.utils.mediaparser.parseMedia = function(i) {
        return d(i)
    };
    function c(j, i) {
        if (i === undefined) {
            i = g[j]
        } else {
            e.utils.extend(i, g[j])
        }
        return i
    }
    function d(m, i) {
        if (f[m.tagName.toLowerCase()] && (i === undefined)) {
            return f[m.tagName.toLowerCase()](m)
        } else {
            i = c("element", i);
            var n = {};
            for (var j in i) {
                if (j != "length") {
                    var l = m.getAttribute(j);
                    if (! (l === "" || l === undefined || l === null)) {
                        n[i[j]] = m.getAttribute(j)
                    }
                }
            }
            var k = m.style["#background-color"];
            if (k && !(k == "transparent" || k == "rgba(0, 0, 0, 0)")) {
                n.screencolor = k
            }
            return n
        }
    }
    function h(n, k) {
        k = c("media", k);
        var l = [];
        var j = e.utils.selectors("source", n);
        for (var m in j) {
            if (!isNaN(m)) {
                l.push(a(j[m]))
            }
        }
        var o = d(n, k);
        if (o.file !== undefined) {
            l[0] = {
                file: o.file
            }
        }
        o.levels = l;
        return o
    }
    function a(k, j) {
        j = c("source", j);
        var i = d(k, j);
        i.width = i.width ? i.width: 0;
        i.bitrate = i.bitrate ? i.bitrate: 0;
        return i
    }
    function b(k, j) {
        j = c("video", j);
        var i = h(k, j);
        return i
    }
    f.media = h;
    f.audio = h;
    f.source = a;
    f.video = b
})(jwplayer); (function(a) {
    a.utils.loaderstatus = {
        NEW: "NEW",
        LOADING: "LOADING",
        ERROR: "ERROR",
        COMPLETE: "COMPLETE"
    };
    a.utils.scriptloader = function(c) {
        var d = a.utils.loaderstatus.NEW;
        var b = new a.events.eventdispatcher();
        a.utils.extend(this, b);
        this.load = function() {
            if (d == a.utils.loaderstatus.NEW) {
                d = a.utils.loaderstatus.LOADING;
                var e = document.createElement("script");
                e.onload = function(f) {
                    d = a.utils.loaderstatus.COMPLETE;
                    b.sendEvent(a.events.COMPLETE)
                };
                e.onerror = function(f) {
                    d = a.utils.loaderstatus.ERROR;
                    b.sendEvent(a.events.ERROR)
                };
                e.onreadystatechange = function() {
                    if (e.readyState == "loaded" || e.readyState == "complete") {
                        d = a.utils.loaderstatus.COMPLETE;
                        b.sendEvent(a.events.COMPLETE)
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(e);
                e.src = c
            }
        };
        this.getStatus = function() {
            return d
        }
    }
})(jwplayer); (function(a) {
    a.utils.selectors = function(b, d) {
        if (d === undefined) {
            d = document
        }
        b = a.utils.strings.trim(b);
        var c = b.charAt(0);
        if (c == "#") {
            return d.getElementById(b.substr(1))
        } else {
            if (c == ".") {
                if (d.getElementsByClassName) {
                    return d.getElementsByClassName(b.substr(1))
                } else {
                    return a.utils.selectors.getElementsByTagAndClass("*", b.substr(1))
                }
            } else {
                if (b.indexOf(".") > 0) {
                    selectors = b.split(".");
                    return a.utils.selectors.getElementsByTagAndClass(selectors[0], selectors[1])
                } else {
                    return d.getElementsByTagName(b)
                }
            }
        }
        return null
    };
    a.utils.selectors.getElementsByTagAndClass = function(e, h, g) {
        elements = [];
        if (g === undefined) {
            g = document
        }
        var f = g.getElementsByTagName(e);
        for (var d = 0; d < f.length; d++) {
            if (f[d].className !== undefined) {
                var c = f[d].className.split(" ");
                for (var b = 0; b < c.length; b++) {
                    if (c[b] == h) {
                        elements.push(f[d])
                    }
                }
            }
        }
        return elements
    }
})(jwplayer); (function(a) {
    a.utils.strings = function() {};
    a.utils.strings.trim = function(b) {
        return b.replace(/^\s*/, "").replace(/\s*$/, "")
    };
    a.utils.strings.pad = function(c, d, b) {
        if (!b) {
            b = "0"
        }
        while (c.length < d) {
            c = b + c
        }
        return c
    };
    a.utils.strings.serialize = function(b) {
        if (b == null) {
            return null
        } else {
            if (b == "true") {
                return true
            } else {
                if (b == "false") {
                    return false
                } else {
                    if (isNaN(Number(b)) || b.length > 5 || b.length == 0) {
                        return b
                    } else {
                        return Number(b)
                    }
                }
            }
        }
    };
    a.utils.strings.seconds = function(d) {
        d = d.replace(",", ".");
        var b = d.split(":");
        var c = 0;
        if (d.substr( - 1) == "s") {
            c = Number(d.substr(0, d.length - 1))
        } else {
            if (d.substr( - 1) == "m") {
                c = Number(d.substr(0, d.length - 1)) * 60
            } else {
                if (d.substr( - 1) == "h") {
                    c = Number(d.substr(0, d.length - 1)) * 3600
                } else {
                    if (b.length > 1) {
                        c = Number(b[b.length - 1]);
                        c += Number(b[b.length - 2]) * 60;
                        if (b.length == 3) {
                            c += Number(b[b.length - 3]) * 3600
                        }
                    } else {
                        c = Number(d)
                    }
                }
            }
        }
        return c
    };
    a.utils.strings.xmlAttribute = function(b, c) {
        for (var d in b.attributes) {
            if (b.attributes[d].name && b.attributes[d].name.toLowerCase() == c.toLowerCase()) {
                return b.attributes[d].value.toString()
            }
        }
        return ""
    }
})(jwplayer); (function(c) {
    var d = new RegExp(/^(#|0x)[0-9a-fA-F]{3,6}/);
    c.utils.typechecker = function(g, f) {
        f = f === null ? b(g) : f;
        return e(g, f)
    };
    function b(f) {
        var g = ["true", "false", "t", "f"];
        if (g.toString().indexOf(f.toLowerCase().replace(" ", "")) >= 0) {
            return "boolean"
        } else {
            if (d.test(f)) {
                return "color"
            } else {
                if (!isNaN(parseInt(f, 10)) && parseInt(f, 10).toString().length == f.length) {
                    return "integer"
                } else {
                    if (!isNaN(parseFloat(f)) && parseFloat(f).toString().length == f.length) {
                        return "float"
                    }
                }
            }
        }
        return "string"
    }
    function e(g, f) {
        if (f === null) {
            return g
        }
        switch (f) {
        case "color":
            if (g.length > 0) {
                return a(g)
            }
            return null;
        case "integer":
            return parseInt(g, 10);
        case "float":
            return parseFloat(g);
        case "boolean":
            if (g.toLowerCase() == "true") {
                return true
            } else {
                if (g == "1") {
                    return true
                }
            }
            return false
        }
        return g
    }
    function a(f) {
        switch (f.toLowerCase()) {
        case "blue":
            return parseInt("0000FF", 16);
        case "green":
            return parseInt("00FF00", 16);
        case "red":
            return parseInt("FF0000", 16);
        case "cyan":
            return parseInt("00FFFF", 16);
        case "magenta":
            return parseInt("FF00FF", 16);
        case "yellow":
            return parseInt("FFFF00", 16);
        case "black":
            return parseInt("000000", 16);
        case "white":
            return parseInt("FFFFFF", 16);
        default:
            f = f.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2");
            if (f.length == 3) {
                f = f.charAt(0) + f.charAt(0) + f.charAt(1) + f.charAt(1) + f.charAt(2) + f.charAt(2)
            }
            return parseInt(f, 16)
        }
        return parseInt("000000", 16)
    }
})(jwplayer); (function(a) {
    var c = {};
    var b = {};
    a.plugins = function() {};
    a.plugins.loadPlugins = function(e, d) {
        b[e] = new a.plugins.pluginloader(new a.plugins.model(c), d);
        return b[e]
    };
    a.plugins.registerPlugin = function(g, e, d) {
        if (c[g]) {
            c[g].registerPlugin(g, e, d)
        } else {
            a.utils.log("A plugin (" + g + ") was registered with the player that was not loaded. Please check your configuration.");
            for (var f in b) {
                b[f].pluginFailed()
            }
        }
    }
})(jwplayer); (function(a) {
    a.plugins.model = function(b) {
        this.addPlugin = function(c) {
            var d = a.utils.getPluginName(c);
            if (!b[d]) {
                b[d] = new a.plugins.plugin(c)
            }
            return b[d]
        }
    }
})(jwplayer); (function(a) {
    a.plugins.pluginmodes = {
        FLASH: "FLASH",
        JAVASCRIPT: "JAVASCRIPT",
        HYBRID: "HYBRID"
    };
    a.plugins.plugin = function(b) {
        var d = "http://plugins.longtailvideo.com";
        var i = a.utils.loaderstatus.NEW;
        var j;
        var h;
        var k;
        var c = new a.events.eventdispatcher();
        a.utils.extend(this, c);
        function e() {
            switch (a.utils.getPluginPathType(b)) {
            case a.utils.pluginPathType.ABSOLUTE:
                return b;
            case a.utils.pluginPathType.RELATIVE:
                return a.utils.getAbsolutePath(b, window.location.href);
            case a.utils.pluginPathType.CDN:
                var l = a.utils.getPluginName(b);
                return d + "/" + a.version.split(".")[0] + "/" + l + "/" + l + ".js"
            }
        }
        function g(l) {
            k = setTimeout(function() {
                i = a.utils.loaderstatus.COMPLETE;
                c.sendEvent(a.events.COMPLETE)
            },
            1000)
        }
        function f(l) {
            i = a.utils.loaderstatus.ERROR;
            c.sendEvent(a.events.ERROR)
        }
        this.load = function() {
            if (i == a.utils.loaderstatus.NEW) {
                if (b.lastIndexOf(".swf") > 0) {
                    j = b;
                    i = a.utils.loaderstatus.COMPLETE;
                    c.sendEvent(a.events.COMPLETE);
                    return
                }
                i = a.utils.loaderstatus.LOADING;
                var l = new a.utils.scriptloader(e());
                l.addEventListener(a.events.COMPLETE, g);
                l.addEventListener(a.events.ERROR, f);
                l.load()
            }
        };
        this.registerPlugin = function(n, m, l) {
            if (k) {
                clearTimeout(k);
                k = undefined
            }
            if (m && l) {
                j = l;
                h = m
            } else {
                if (typeof m == "string") {
                    j = m
                } else {
                    if (typeof m == "function") {
                        h = m
                    } else {
                        if (!m && !l) {
                            j = n
                        }
                    }
                }
            }
            i = a.utils.loaderstatus.COMPLETE;
            c.sendEvent(a.events.COMPLETE)
        };
        this.getStatus = function() {
            return i
        };
        this.getPluginName = function() {
            return a.utils.getPluginName(b)
        };
        this.getFlashPath = function() {
            if (j) {
                switch (a.utils.getPluginPathType(j)) {
                case a.utils.pluginPathType.ABSOLUTE:
                    return j;
                case a.utils.pluginPathType.RELATIVE:
                    if (b.lastIndexOf(".swf") > 0) {
                        return a.utils.getAbsolutePath(j, window.location.href)
                    }
                    return a.utils.getAbsolutePath(j, e());
                case a.utils.pluginPathType.CDN:
                    if (j.indexOf("-") > -1) {
                        return j + "h"
                    }
                    return j + "-h"
                }
            }
            return null
        };
        this.getJS = function() {
            return h
        };
        this.getPluginmode = function() {
            if (typeof j != "undefined" && typeof h != "undefined") {
                return a.plugins.pluginmodes.HYBRID
            } else {
                if (typeof j != "undefined") {
                    return a.plugins.pluginmodes.FLASH
                } else {
                    if (typeof h != "undefined") {
                        return a.plugins.pluginmodes.JAVASCRIPT
                    }
                }
            }
        };
        this.getNewInstance = function(m, l, n) {
            return new h(m, l, n)
        };
        this.getURL = function() {
            return b
        }
    }
})(jwplayer); (function(a) {
    a.plugins.pluginloader = function(h, e) {
        var g = {};
        var j = a.utils.loaderstatus.NEW;
        var d = false;
        var b = false;
        var c = new a.events.eventdispatcher();
        a.utils.extend(this, c);
        function f() {
            if (!b) {
                b = true;
                j = a.utils.loaderstatus.COMPLETE;
                c.sendEvent(a.events.COMPLETE)
            }
        }
        function i() {
            if (!b) {
                var k = 0;
                for (plugin in g) {
                    if (g[plugin].getStatus() == a.utils.loaderstatus.LOADING) {
                        k++
                    }
                }
                if (k == 0) {
                    f()
                }
            }
        }
        this.setupPlugins = function(m, k, r) {
            var l = {
                length: 0,
                plugins: {}
            };
            var o = {
                length: 0,
                plugins: {}
            };
            for (var n in g) {
                var p = g[n].getPluginName();
                if (g[n].getFlashPath()) {
                    l.plugins[g[n].getFlashPath()] = k.plugins[n];
                    l.plugins[g[n].getFlashPath()].pluginmode = g[n].getPluginmode();
                    l.length++
                }
                if (g[n].getJS()) {
                    var q = document.createElement("div");
                    q.id = m.id + "_" + p;
                    q.style.position = "absolute";
                    q.style.zIndex = o.length + 10;
                    o.plugins[p] = g[n].getNewInstance(m, k.plugins[n], q);
                    o.length++;
                    if (typeof o.plugins[p].resize != "undefined") {
                        m.onReady(r(o.plugins[p], q, true));
                        m.onResize(r(o.plugins[p], q))
                    }
                }
            }
            m.plugins = o.plugins;
            return l
        };
        this.load = function() {
            j = a.utils.loaderstatus.LOADING;
            d = true;
            for (var k in e) {
                g[k] = h.addPlugin(k);
                g[k].addEventListener(a.events.COMPLETE, i);
                g[k].addEventListener(a.events.ERROR, i);
                g[k].load()
            }
            d = false;
            i()
        };
        this.pluginFailed = function() {
            f()
        };
        this.getStatus = function() {
            return j
        }
    }
})(jwplayer); (function(b) {
    var a = [];
    b.api = function(d) {
        this.container = d;
        this.id = d.id;
        var l = {};
        var q = {};
        var c = [];
        var h = undefined;
        var k = false;
        var i = [];
        var o = b.utils.getOuterHTML(d);
        var p = {};
        var m = 0;
        var j = {};
        this.getBuffer = function() {
            return this.callInternal("jwGetBuffer")
        };
        this.getContainer = function() {
            return this.container
        };
        function e(r) {
            return function(w, s, t, u) {
                var v;
                if (s) {
                    j[w] = s;
                    v = "jwplayer('" + r + "').callback('" + w + "')"
                } else {
                    if (!s && j[w]) {
                        delete j[w]
                    }
                }
                h.jwDockSetButton(w, v, t, u)
            }
        }
        this.getPlugin = function(s) {
            var r = this.callInternal;
            if (s == "dock") {
                return {
                    setButton: e(this.id)
                }
            }
            return this.plugins[s]
        };
        this.callback = function(r) {
            if (j[r]) {
                return j[r]()
            }
        };
        this.getDuration = function() {
            return this.callInternal("jwGetDuration")
        };
        this.getFullscreen = function() {
            return this.callInternal("jwGetFullscreen")
        };
        this.getHeight = function() {
            return this.callInternal("jwGetHeight")
        };
        this.getLockState = function() {
            return this.callInternal("jwGetLockState")
        };
        this.getMeta = function() {
            return this.getItemMeta()
        };
        this.getMute = function() {
            return this.callInternal("jwGetMute")
        };
        this.getPlaylist = function() {
            var s = this.callInternal("jwGetPlaylist");
            for (var r = 0; r < s.length; r++) {
                if (s[r].index === undefined) {
                    s[r].index = r
                }
            }
            return s
        };
        this.getPlaylistItem = function(r) {
            if (r === undefined) {
                r = this.getCurrentItem()
            }
            return this.getPlaylist()[r]
        };
        this.getPosition = function() {
            return this.callInternal("jwGetPosition")
        };
        this.getRenderingMode = function() {
            return this.renderingMode
        };
        this.getState = function() {
            return this.callInternal("jwGetState")
        };
        this.getVolume = function() {
            return this.callInternal("jwGetVolume")
        };
        this.getWidth = function() {
            return this.callInternal("jwGetWidth")
        };
        this.setFullscreen = function(r) {
            if (r === undefined) {
                this.callInternal("jwSetFullscreen", !this.callInternal("jwGetFullscreen"))
            } else {
                this.callInternal("jwSetFullscreen", r)
            }
            return this
        };
        this.setMute = function(r) {
            if (r === undefined) {
                this.callInternal("jwSetMute", !this.callInternal("jwGetMute"))
            } else {
                this.callInternal("jwSetMute", r)
            }
            return this
        };
        this.lock = function() {
            return this
        };
        this.unlock = function() {
            return this
        };
        this.load = function(r) {
            this.callInternal("jwLoad", r);
            return this
        };
        this.playlistItem = function(r) {
            this.callInternal("jwPlaylistItem", r);
            return this
        };
        this.playlistPrev = function() {
            this.callInternal("jwPlaylistPrev");
            return this
        };
        this.playlistNext = function() {
            this.callInternal("jwPlaylistNext");
            return this
        };
        this.resize = function(s, r) {
            if (this.renderingMode == "html5") {
                h.jwResize(s, r)
            } else {
                this.container.width = s;
                this.container.height = r
            }
            return this
        };
        this.play = function(r) {
            if (typeof r == "undefined") {
                r = this.getState();
                if (r == b.api.events.state.PLAYING || r == b.api.events.state.BUFFERING) {
                    this.callInternal("jwPause")
                } else {
                    this.callInternal("jwPlay")
                }
            } else {
                this.callInternal("jwPlay", r)
            }
            return this
        };
        this.pause = function(r) {
            if (typeof r == "undefined") {
                r = this.getState();
                if (r == b.api.events.state.PLAYING || r == b.api.events.state.BUFFERING) {
                    this.callInternal("jwPause")
                } else {
                    this.callInternal("jwPlay")
                }
            } else {
                this.callInternal("jwPause", r)
            }
            return this
        };
        this.stop = function() {
            this.callInternal("jwStop");
            return this
        };
        this.seek = function(r) {
            this.callInternal("jwSeek", r);
            return this
        };
        this.setVolume = function(r) {
            this.callInternal("jwSetVolume", r);
            return this
        };
        this.onBufferChange = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER, r)
        };
        this.onBufferFull = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL, r)
        };
        this.onError = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_ERROR, r)
        };
        this.onFullscreen = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_FULLSCREEN, r)
        };
        this.onMeta = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_META, r)
        };
        this.onMute = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_MUTE, r)
        };
        this.onPlaylist = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED, r)
        };
        this.onPlaylistItem = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM, r)
        };
        this.onReady = function(r) {
            return this.eventListener(b.api.events.API_READY, r)
        };
        this.onResize = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_RESIZE, r)
        };
        this.onComplete = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE, r)
        };
        this.onTime = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_TIME, r)
        };
        this.onVolume = function(r) {
            return this.eventListener(b.api.events.JWPLAYER_MEDIA_VOLUME, r)
        };
        this.onBuffer = function(r) {
            return this.stateListener(b.api.events.state.BUFFERING, r)
        };
        this.onPause = function(r) {
            return this.stateListener(b.api.events.state.PAUSED, r)
        };
        this.onPlay = function(r) {
            return this.stateListener(b.api.events.state.PLAYING, r)
        };
        this.onIdle = function(r) {
            return this.stateListener(b.api.events.state.IDLE, r)
        };
        this.remove = function() {
            l = {};
            i = [];
            if (b.utils.getOuterHTML(this.container) != o) {
                b.api.destroyPlayer(this.id, o)
            }
        };
        this.setup = function(s) {
            if (b.embed) {
                var r = this.id;
                this.remove();
                var t = b(r);
                t.config = s;
                return new b.embed(t)
            }
            return this
        };
        this.registerPlugin = function(t, s, r) {
            b.plugins.registerPlugin(t, s, r)
        };
        this.setPlayer = function(r, s) {
            h = r;
            this.renderingMode = s
        };
        this.stateListener = function(r, s) {
            if (!q[r]) {
                q[r] = [];
                this.eventListener(b.api.events.JWPLAYER_PLAYER_STATE, g(r))
            }
            q[r].push(s);
            return this
        };
        function g(r) {
            return function(t) {
                var s = t.newstate,
                v = t.oldstate;
                if (s == r) {
                    var u = q[s];
                    if (u) {
                        for (var w = 0; w < u.length; w++) {
                            if (typeof u[w] == "function") {
                                u[w].call(this, {
                                    oldstate: v,
                                    newstate: s
                                })
                            }
                        }
                    }
                }
            }
        }
        this.addInternalListener = function(r, s) {
            r.jwAddEventListener(s, 'function(dat) { jwplayer("' + this.id + '").dispatchEvent("' + s + '", dat); }')
        };
        this.eventListener = function(r, s) {
            if (!l[r]) {
                l[r] = [];
                if (h && k) {
                    this.addInternalListener(h, r)
                }
            }
            l[r].push(s);
            return this
        };
        this.dispatchEvent = function(t) {
            if (l[t]) {
                var s = f(t, arguments[1]);
                for (var r = 0; r < l[t].length; r++) {
                    if (typeof l[t][r] == "function") {
                        l[t][r].call(this, s)
                    }
                }
            }
        };
        function f(t, r) {
            var v = b.utils.extend({},
            r);
            if (t == b.api.events.JWPLAYER_FULLSCREEN && !v.fullscreen) {
                v.fullscreen = v.message == "true" ? true: false;
                delete v.message
            } else {
                if (typeof v.data == "object") {
                    v = b.utils.extend(v, v.data);
                    delete v.data
                }
            }
            var s = ["position", "duration", "offset"];
            for (var u in s) {
                if (v[s[u]]) {
                    v[s[u]] = Math.round(v[s[u]] * 1000) / 1000
                }
            }
            return v
        }
        this.callInternal = function(s, r) {
            if (k) {
                if (typeof h != "undefined" && typeof h[s] == "function") {
                    if (r !== undefined) {
                        return (h[s])(r)
                    } else {
                        return (h[s])()
                    }
                }
                return null
            } else {
                i.push({
                    method: s,
                    parameters: r
                })
            }
        };
        this.playerReady = function(t) {
            k = true;
            if (!h) {
                this.setPlayer(document.getElementById(t.id))
            }
            this.container = document.getElementById(this.id);
            for (var r in l) {
                this.addInternalListener(h, r)
            }
            this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM,
            function(u) {
                if (u.index !== undefined) {
                    m = u.index
                }
                p = {}
            });
            this.eventListener(b.api.events.JWPLAYER_MEDIA_META,
            function(u) {
                b.utils.extend(p, u.metadata)
            });
            this.dispatchEvent(b.api.events.API_READY);
            while (i.length > 0) {
                var s = i.shift();
                this.callInternal(s.method, s.parameters)
            }
        };
        this.getItemMeta = function() {
            return p
        };
        this.getCurrentItem = function() {
            return m
        };
        function n(t, v, u) {
            var r = [];
            if (!v) {
                v = 0
            }
            if (!u) {
                u = t.length - 1
            }
            for (var s = v; s <= u; s++) {
                r.push(t[s])
            }
            return r
        }
        return this
    };
    b.api.selectPlayer = function(d) {
        var c;
        if (d === undefined) {
            d = 0
        }
        if (d.nodeType) {
            c = d
        } else {
            if (typeof d == "string") {
                c = document.getElementById(d)
            }
        }
        if (c) {
            var e = b.api.playerById(c.id);
            if (e) {
                return e
            } else {
                return b.api.addPlayer(new b.api(c))
            }
        } else {
            if (typeof d == "number") {
                return b.getPlayers()[d]
            }
        }
        return null
    };
    b.api.events = {
        API_READY: "jwplayerAPIReady",
        JWPLAYER_READY: "jwplayerReady",
        JWPLAYER_FULLSCREEN: "jwplayerFullscreen",
        JWPLAYER_RESIZE: "jwplayerResize",
        JWPLAYER_ERROR: "jwplayerError",
        JWPLAYER_MEDIA_BUFFER: "jwplayerMediaBuffer",
        JWPLAYER_MEDIA_BUFFER_FULL: "jwplayerMediaBufferFull",
        JWPLAYER_MEDIA_ERROR: "jwplayerMediaError",
        JWPLAYER_MEDIA_LOADED: "jwplayerMediaLoaded",
        JWPLAYER_MEDIA_COMPLETE: "jwplayerMediaComplete",
        JWPLAYER_MEDIA_TIME: "jwplayerMediaTime",
        JWPLAYER_MEDIA_VOLUME: "jwplayerMediaVolume",
        JWPLAYER_MEDIA_META: "jwplayerMediaMeta",
        JWPLAYER_MEDIA_MUTE: "jwplayerMediaMute",
        JWPLAYER_PLAYER_STATE: "jwplayerPlayerState",
        JWPLAYER_PLAYLIST_LOADED: "jwplayerPlaylistLoaded",
        JWPLAYER_PLAYLIST_ITEM: "jwplayerPlaylistItem"
    };
    b.api.events.state = {
        BUFFERING: "BUFFERING",
        IDLE: "IDLE",
        PAUSED: "PAUSED",
        PLAYING: "PLAYING"
    };
    b.api.playerById = function(d) {
        for (var c = 0; c < a.length; c++) {
            if (a[c].id == d) {
                return a[c]
            }
        }
        return null
    };
    b.api.addPlayer = function(c) {
        for (var d = 0; d < a.length; d++) {
            if (a[d] == c) {
                return c
            }
        }
        a.push(c);
        return c
    };
    b.api.destroyPlayer = function(g, d) {
        var f = -1;
        for (var i = 0; i < a.length; i++) {
            if (a[i].id == g) {
                f = i;
                continue
            }
        }
        if (f >= 0) {
            var c = document.getElementById(a[f].id);
            if (document.getElementById(a[f].id + "_wrapper")) {
                c = document.getElementById(a[f].id + "_wrapper")
            }
            if (c) {
                if (d) {
                    b.utils.setOuterHTML(c, d)
                } else {
                    var h = document.createElement("div");
                    var e = c.id;
                    if (c.id.indexOf("_wrapper") == c.id.length - 8) {
                        newID = c.id.substring(0, c.id.length - 8)
                    }
                    h.setAttribute("id", e);
                    c.parentNode.replaceChild(h, c)
                }
            }
            a.splice(f, 1)
        }
        return null
    };
    b.getPlayers = function() {
        return a.slice(0)
    }
})(jwplayer);
var _userPlayerReady = (typeof playerReady == "function") ? playerReady: undefined;
playerReady = function(b) {
    var a = jwplayer.api.playerById(b.id);
    if (a) {
        a.playerReady(b)
    }
    if (_userPlayerReady) {
        _userPlayerReady.call(this, b)
    }
}; (function(a) {
    a.embed = function(g) {
        var i = {
            width: 400,
            height: 300,
            components: {
                controlbar: {
                    position: "over"
                }
            }
        };
        var f = a.utils.mediaparser.parseMedia(g.container);
        var e = new a.embed.config(a.utils.extend(i, f, g.config), this);
        var h = a.plugins.loadPlugins(g.id, e.plugins);
        function c(l, k) {
            for (var j in k) {
                if (typeof l[j] == "function") { (l[j]).call(l, k[j])
                }
            }
        }
        function d() {
            if (h.getStatus() == a.utils.loaderstatus.COMPLETE) {
                for (var l = 0; l < e.modes.length; l++) {
                    if (e.modes[l].type && a.embed[e.modes[l].type]) {
                        var j = e;
                        if (e.modes[l].config) {
                            j = a.utils.extend(a.utils.clone(e), e.modes[l].config)
                        }
                        var k = new a.embed[e.modes[l].type](document.getElementById(g.id), e.modes[l], j, h, g);
                        if (k.supportsConfig()) {
                            k.embed();
                            c(g, e.events);
                            return g
                        }
                    }
                }
                a.utils.log("No suitable players found");
                new a.embed.logo(a.utils.extend({
                    hide: true
                },
                e.components.logo), "none", g.id)
            }
        }
        h.addEventListener(a.events.COMPLETE, d);
        h.addEventListener(a.events.ERROR, d);
        h.load();
        return g
    };
    function b() {
        if (!document.body) {
            return setTimeout(b, 15)
        }
        var c = a.utils.selectors.getElementsByTagAndClass("video", "jwplayer");
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            a(e.id).setup({})
        }
    }
    b()
})(jwplayer); (function(a) {
    function b() {
        return [{
            type: "flash",
            src: "/jwplayer/player.swf"
        },
        {
            type: "html5"
        },
        {
            type: "download"
        }]
    }
    function d(h) {
        var g = h.toLowerCase();
        var f = ["left", "right", "top", "bottom"];
        for (var e = 0; e < f.length; e++) {
            if (g == f[e]) {
                return true
            }
        }
        return false
    }
    function c(f) {
        var e = false;
        e = (f instanceof Array) || (typeof f == "object" && !f.position && !f.size);
        return e
    }
    a.embed.config = function(f, p) {
        var o = a.utils.extend({},
        f);
        var m;
        if (c(o.playlist)) {
            m = o.playlist;
            delete o.playlist
        }
        for (var i in o) {
            if (i.indexOf(".") > -1) {
                var q = i.split(".");
                var r = o;
                for (var e = 0; e < q.length; e++) {
                    if (e == q.length - 1) {
                        if (a.utils.typeOf(r) == "object") {
                            r[q[e]] = o[i];
                            delete o[i]
                        }
                    } else {
                        if (r[q[e]] === undefined) {
                            r[q[e]] = {}
                        }
                        r = r[q[e]]
                    }
                }
            }
        }
        if (typeof o.plugins == "string") {
            var g = o.plugins.split(",");
            if (typeof o.plugins != "object") {
                o.plugins = {}
            }
            for (var k = 0; k < g.length; k++) {
                var l = a.utils.getPluginName(g[k]);
                if (typeof o[l] == "object") {
                    o.plugins[g[k]] = o[l];
                    delete o[l]
                } else {
                    o.plugins[g[k]] = {}
                }
            }
        }
        var j = ["playlist", "dock", "controlbar"];
        for (var n = 0; n < j.length; n++) {
            if (typeof o[j[n]] == "string") {
                if (!o.components[j[n]]) {
                    o.components[j[n]] = {}
                }
                o.components[j[n]].position = o[j[n]];
                delete o[j[n]]
            } else {
                if (o[j[n]]) {
                    o.components[j[n]] = o[j[n]];
                    delete o[j[n]]
                }
            }
            if (typeof o[j[n] + "size"] != "undefined") {
                if (!o.components[j[n]]) {
                    o.components[j[n]] = {}
                }
                o.components[j[n]].size = o[j[n] + "size"];
                delete o[j[n] + "size"]
            }
        }
        if (typeof o.icons != "undefined") {
            if (!o.components.display) {
                o.components.display = {}
            }
            o.components.display.icons = o.icons;
            delete o.icons
        }
        if (o.players) {
            o.modes = o.players;
            delete o.players
        }
        var h;
        if (o.flashplayer && !o.modes) {
            h = b();
            h[0].src = o.flashplayer;
            delete o.flashplayer
        } else {
            if (o.modes) {
                if (typeof o.modes == "string") {
                    h = b();
                    h[0].src = o.modes
                } else {
                    if (o.modes instanceof Array) {
                        h = o.modes
                    } else {
                        if (typeof o.modes == "object" && o.modes.type) {
                            h = [o.modes]
                        }
                    }
                }
                delete o.modes
            } else {
                h = b()
            }
        }
        o.modes = h;
        if (m) {
            o.playlist = m
        }
        return o
    }
})(jwplayer); (function(a) {
    a.embed.download = function(c, g, b, d, f) {
        this.embed = function() {
            var j = a.utils.extend({},
            b);
            var p = {};
            var i = b.width ? b.width: 480;
            if (typeof i != "number") {
                i = parseInt(i, 10)
            }
            var l = b.height ? b.height: 320;
            if (typeof l != "number") {
                l = parseInt(l, 10)
            }
            var t,
            n,
            m;
            var r = {};
            if (b.playlist && b.playlist.length) {
                r.file = b.playlist[0].file;
                n = b.playlist[0].image;
                r.levels = b.playlist[0].levels
            } else {
                r.file = b.file;
                n = b.image;
                r.levels = b.levels
            }
            if (r.file) {
                t = r.file
            } else {
                if (r.levels && r.levels.length) {
                    t = r.levels[0].file
                }
            }
            m = t ? "pointer": "auto";
            var k = {
                display: {
                    style: {
                        cursor: m,
                        width: i,
                        height: l,
                        backgroundColor: "#000",
                        position: "relative",
                        textDecoration: "none",
                        border: "none",
                        display: "block"
                    }
                },
                display_icon: {
                    style: {
                        cursor: m,
                        position: "absolute",
                        display: t ? "block": "none",
                        top: 0,
                        left: 0,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        zIndex: 3,
                        width: 50,
                        height: 50,
                        backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg==)"
                    }
                },
                display_iconBackground: {
                    style: {
                        cursor: m,
                        position: "absolute",
                        display: t ? "block": "none",
                        top: ((l - 50) / 2),
                        left: ((i - 50) / 2),
                        border: 0,
                        width: 50,
                        height: 50,
                        margin: 0,
                        padding: 0,
                        zIndex: 2,
                        backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC)"
                    }
                },
                display_image: {
                    style: {
                        width: i,
                        height: l,
                        display: n ? "block": "none",
                        position: "absolute",
                        cursor: m,
                        left: 0,
                        top: 0,
                        margin: 0,
                        padding: 0,
                        textDecoration: "none",
                        zIndex: 1,
                        border: "none"
                    }
                }
            };
            var h = function(u, w, x) {
                var v = document.createElement(u);
                if (x) {
                    v.id = x
                } else {
                    v.id = c.id + "_jwplayer_" + w
                }
                a.utils.css(v, k[w].style);
                return v
            };
            p.display = h("a", "display", c.id);
            if (t) {
                p.display.setAttribute("href", a.utils.getAbsolutePath(t))
            }
            p.display_image = h("img", "display_image");
            p.display_image.setAttribute("alt", "Click to download...");
            if (n) {
                p.display_image.setAttribute("src", a.utils.getAbsolutePath(n))
            }
            if (true) {
                p.display_icon = h("div", "display_icon");
                p.display_iconBackground = h("div", "display_iconBackground");
                p.display.appendChild(p.display_image);
                p.display_iconBackground.appendChild(p.display_icon);
                p.display.appendChild(p.display_iconBackground)
            }
            _css = a.utils.css;
            _hide = function(u) {
                _css(u, {
                    display: "none"
                })
            };
            function q(u) {
                _imageWidth = p.display_image.naturalWidth;
                _imageHeight = p.display_image.naturalHeight;
                s()
            }
            function s() {
                a.utils.stretch(a.utils.stretching.UNIFORM, p.display_image, i, l, _imageWidth, _imageHeight)
            }
            p.display_image.onerror = function(u) {
                _hide(p.display_image)
            };
            p.display_image.onload = q;
            c.parentNode.replaceChild(p.display, c);
            var o = (b.plugins && b.plugins.logo) ? b.plugins.logo: {};
            p.display.appendChild(new a.embed.logo(b.components.logo, "download", c.id));
            f.container = document.getElementById(f.id);
            f.setPlayer(p.display, "download")
        };
        this.supportsConfig = function() {
            if (b) {
                var j = a.utils.getFirstPlaylistItemFromConfig(b);
                if (typeof j.file == "undefined" && typeof j.levels == "undefined") {
                    return true
                } else {
                    if (j.file) {
                        return e(j.file, j.provider, j.playlistfile)
                    } else {
                        if (j.levels && j.levels.length) {
                            for (var h = 0; h < j.levels.length; h++) {
                                if (j.levels[h].file && e(j.levels[h].file, j.provider, j.playlistfile)) {
                                    return true
                                }
                            }
                        }
                    }
                }
            } else {
                return true
            }
        };
        function e(i, k, h) {
            if (h) {
                return false
            }
            var j = ["image", "sound", "youtube", "http"];
            if (k && (j.toString().indexOf(k) > -1)) {
                return true
            }
            if (!k || (k && k == "video")) {
                var l = a.utils.extension(i);
                if (l && a.utils.extensionmap[l]) {
                    return true
                }
            }
            return false
        }
    }
})(jwplayer); (function(a) {
    a.embed.flash = function(g, h, l, f, j) {
        function m(o, n, p) {
            var q = document.createElement("param");
            q.setAttribute("name", n);
            q.setAttribute("value", p);
            o.appendChild(q)
        }
        function k(o, p, n) {
            return function(q) {
                if (n) {
                    document.getElementById(j.id + "_wrapper").appendChild(p)
                }
                var s = document.getElementById(j.id).getPluginConfig("display");
                o.resize(s.width, s.height);
                var r = {
                    left: s.x,
                    top: s.y
                };
                a.utils.css(p, r)
            }
        }
        function e(p) {
            if (!p) {
                return {}
            }
            var r = {};
            for (var o in p) {
                var n = p[o];
                for (var q in n) {
                    r[o + "." + q] = n[q]
                }
            }
            return r
        }
        function i(q, p) {
            if (q[p]) {
                var s = q[p];
                for (var o in s) {
                    var n = s[o];
                    if (typeof n == "string") {
                        if (!q[o]) {
                            q[o] = n
                        }
                    } else {
                        for (var r in n) {
                            if (!q[o + "." + r]) {
                                q[o + "." + r] = n[r]
                            }
                        }
                    }
                }
                delete q[p]
            }
        }
        function c(q) {
            if (!q) {
                return {}
            }
            var t = {},
            s = [];
            for (var n in q) {
                var p = a.utils.getPluginName(n);
                var o = q[n];
                s.push(n);
                for (var r in o) {
                    t[p + "." + r] = o[r]
                }
            }
            t.plugins = s.join(",");
            return t
        }
        function d(p) {
            var n = p.netstreambasepath ? "": "netstreambasepath=" + encodeURIComponent(window.location.href) + "&";
            for (var o in p) {
                n += o + "=" + encodeURIComponent(p[o]) + "&"
            }
            return n.substring(0, n.length - 1)
        }
        function b(n) {
            return function(p) {
                if (n.playlist) {
                    this.load(n.playlist)
                } else {
                    if (n.levels) {
                        var o = this.getPlaylistItem(0);
                        if (!o) {
                            o = n
                        }
                        if (!o.image) {
                            o.image = n.image
                        }
                        if (!o.levels) {
                            o.levels = n.levels
                        }
                        this.load(o)
                    }
                }
            }
        }
        this.embed = function() {
            if (l.levels || l.playlist) {
                j.onReady(b(l))
            }
            l.id = j.id;
            var y;
            if (g.id + "_wrapper" == g.parentNode.id) {
                y = document.getElementById(g.id + "_wrapper")
            } else {
                y = document.createElement("div");
                y.id = g.id + "_wrapper";
                a.utils.wrap(g, y);
                y.style.position = "relative"
            }
            var q = a.utils.extend({},
            l);
            var o = f.setupPlugins(j, q, k);
            if (o.length > 0) {
                a.utils.extend(q, c(o.plugins))
            } else {
                delete q.plugins
            }
            var n = q.width;
            var w = q.height;
            var r = ["height", "width", "levels", "playlist", "modes", "events"];
            for (var u = 0; u < r.length; u++) {
                delete q[r[u]]
            }
            var p = "opaque";
            if (q.wmode) {
                p = q.wmode
            }
            i(q, "components");
            i(q, "providers");
            var x = "#000000";
            var t;
            if (a.utils.isIE()) {
                var v = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" bgcolor="' + x + '" width="' + n + '" height="' + w + '" id="' + g.id + '" name="' + g.id + '">';
                v += '<param name="movie" value="' + h.src + '">';
                v += '<param name="allowfullscreen" value="true">';
                v += '<param name="allowscriptaccess" value="always">';
                v += '<param name="seamlesstabbing" value="true">';
                v += '<param name="wmode" value="' + p + '">';
                v += '<param name="flashvars" value="' + d(q) + '">';
                v += "</object>";
                a.utils.setOuterHTML(g, v);
                t = document.getElementById(g.id)
            } else {
                var s = document.createElement("object");
                s.setAttribute("type", "application/x-shockwave-flash");
                s.setAttribute("data", h.src);
                s.setAttribute("width", n);
                s.setAttribute("height", w);
                s.setAttribute("bgcolor", "#000000");
                s.setAttribute("id", g.id);
                s.setAttribute("name", g.id);
                m(s, "allowfullscreen", "true");
                m(s, "allowscriptaccess", "always");
                m(s, "seamlesstabbing", "true");
                m(s, "wmode", p);
                m(s, "flashvars", d(q));
                g.parentNode.replaceChild(s, g);
                t = s
            }
            j.container = t;
            j.setPlayer(t, "flash")
        };
        this.supportsConfig = function() {
            if (a.utils.hasFlash()) {
                if (l) {
                    var o = a.utils.getFirstPlaylistItemFromConfig(l);
                    if (typeof o.file == "undefined" && typeof o.levels == "undefined") {
                        return true
                    } else {
                        if (o.file) {
                            return flashCanPlay(o.file, o.provider)
                        } else {
                            if (o.levels && o.levels.length) {
                                for (var n = 0; n < o.levels.length; n++) {
                                    if (o.levels[n].file && flashCanPlay(o.levels[n].file, o.provider)) {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                } else {
                    return true
                }
            }
            return false
        };
        flashCanPlay = function(n, p) {
            var o = ["video", "http", "sound", "image"];
            if (p && (o.toString().indexOf(p < 0))) {
                return true
            }
            var q = a.utils.extension(n);
            if (!q) {
                return true
            }
            if (a.utils.extensionmap[q] !== undefined && a.utils.extensionmap[q].flash === undefined) {
                return false
            }
            return true
        }
    }
})(jwplayer); (function(a) {
    a.embed.html5 = function(c, g, b, d, f) {
        function e(i, j, h) {
            return function(k) {
                var l = document.getElementById(c.id + "_displayarea");
                if (h) {
                    l.appendChild(j)
                }
                var m = l.style;
                i.resize(parseInt(m.width.replace("px", "")), parseInt(m.height.replace("px", "")));
                j.left = m.left;
                j.top = m.top
            }
        }
        this.embed = function() {
            if (a.html5) {
                d.setupPlugins(f, b, e);
                c.innerHTML = "";
                var j = a.utils.extend({
                    screencolor: "0x000000"
                },
                b);
                var h = ["plugins", "modes", "events"];
                for (var k = 0; k < h.length; k++) {
                    delete j[h[k]]
                }
                if (j.levels && !j.sources) {
                    j.sources = b.levels
                }
                if (j.skin && j.skin.toLowerCase().indexOf(".zip") > 0) {
                    j.skin = j.skin.replace(/\.zip/i, ".xml")
                }
                var l = new(a.html5(c)).setup(j);
                f.container = document.getElementById(f.id);
                f.setPlayer(l, "html5")
            } else {
                return null
            }
        };
        this.supportsConfig = function() {
            var h = document.createElement("video");
            if ( !! h.canPlayType) {
                if (b) {
                    var k = a.utils.getFirstPlaylistItemFromConfig(b);
                    if (typeof k.file == "undefined" && typeof k.levels == "undefined") {
                        return true
                    } else {
                        if (k.file) {
                            return html5CanPlay(h, k.file, k.provider, k.playlistfile)
                        } else {
                            if (k.levels && k.levels.length) {
                                for (var j = 0; j < k.levels.length; j++) {
                                    if (k.levels[j].file && html5CanPlay(h, k.levels[j].file, k.provider, k.playlistfile)) {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                } else {
                    return true
                }
            }
            return false
        };
        html5CanPlay = function(j, i, k, h) {
            if (h) {
                return false
            }
            if (k && k == "youtube") {
                return true
            }
            if (k && k != "video" && k != "http") {
                return false
            }
            var l = a.utils.extension(i);
            if (!l || a.utils.extensionmap[l] === undefined) {
                return true
            }
            if (a.utils.extensionmap[l].html5 === undefined) {
                return false
            }
            if (a.utils.isLegacyAndroid() && l.match(/m4v|mp4/)) {
                return true
            }
            return browserCanPlay(j, a.utils.extensionmap[l].html5)
        };
        browserCanPlay = function(i, h) {
            if (!h) {
                return true
            }
            return i.canPlayType(h)
        }
    }
})(jwplayer); (function(a) {
    a.embed.logo = function(l, k, d) {
        var i = {
            prefix: "http://l.longtailvideo.com/" + k + "/",
            file: "logo.png",
            link: "http://www.longtailvideo.com/players/jw-flv-player/",
            margin: 8,
            out: 0.5,
            over: 1,
            timeout: 3,
            hide: false,
            position: "bottom-left"
        };
        _css = a.utils.css;
        var b;
        var h;
        j();
        function j() {
            n();
            c();
            f()
        }
        function n() {
            if (i.prefix) {
                var p = a.version.split(/\W/).splice(0, 2).join("/");
                if (i.prefix.indexOf(p) < 0) {
                    i.prefix += p + "/"
                }
            }
            h = a.utils.extend({},
            i)
        }
        function o() {
            var r = {
                border: "none",
                textDecoration: "none",
                position: "absolute",
                cursor: "pointer",
                zIndex: 10
            };
            r.display = h.hide ? "none": "block";
            var q = h.position.toLowerCase().split("-");
            for (var p in q) {
                r[q[p]] = h.margin
            }
            return r
        }
        function c() {
            b = document.createElement("img");
            b.id = d + "_jwplayer_logo";
            b.style.display = "none";
            b.onload = function(p) {
                _css(b, o());
                e()
            };
            if (!h.file) {
                return
            }
            if (h.file.indexOf("http://") === 0) {
                b.src = h.file
            } else {
                b.src = h.prefix + h.file
            }
        }
        if (!h.file) {
            return
        }
        function f() {
            if (h.link) {
                b.onmouseover = g;
                b.onmouseout = e;
                b.onclick = m
            } else {
                this.mouseEnabled = false
            }
        }
        function m(p) {
            if (typeof p != "undefined") {
                p.preventDefault();
                p.stopPropagation()
            }
            if (h.link) {
                window.open(h.link, "_blank")
            }
            return
        }
        function e(p) {
            if (h.link) {
                b.style.opacity = h.out
            }
            return
        }
        function g(p) {
            if (h.hide) {
                b.style.opacity = h.over
            }
            return
        }
        return b
    }
})(jwplayer); (function(a) {
    a.html5 = function(b) {
        var c = b;
        this.setup = function(d) {
            a.utils.extend(this, new a.html5.api(c, d));
            return this
        };
        return this
    }
})(jwplayer); (function(b) {
    var c = b.utils.css;
    b.html5.view = function(p, o, e) {
        var s = p;
        var l = o;
        var v = e;
        var u;
        var f;
        var z;
        var q;
        var A;
        var n;
        function x() {
            u = document.createElement("div");
            u.id = l.id;
            u.className = l.className;
            _videowrapper = document.createElement("div");
            _videowrapper.id = u.id + "_video_wrapper";
            l.id = u.id + "_video";
            c(u, {
                position: "relative",
                height: v.height,
                width: v.width,
                padding: 0,
                backgroundColor: B(),
                zIndex: 0
            });
            function B() {
                if (s.skin.getComponentSettings("display") && s.skin.getComponentSettings("display").backgroundcolor) {
                    return s.skin.getComponentSettings("display").backgroundcolor
                }
                return parseInt("000000", 16)
            }
            c(l, {
                width: v.width,
                height: v.height,
                top: 0,
                left: 0,
                zIndex: 1,
                margin: "auto",
                display: "block"
            });
            c(_videowrapper, {
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            });
            b.utils.wrap(l, u);
            b.utils.wrap(l, _videowrapper);
            q = document.createElement("div");
            q.id = u.id + "_displayarea";
            u.appendChild(q)
        }
        function j() {
            for (var B = 0; B < v.plugins.order.length; B++) {
                var C = v.plugins.order[B];
                if (v.plugins.object[C].getDisplayElement !== undefined) {
                    v.plugins.object[C].height = h(v.plugins.object[C].getDisplayElement().style.height);
                    v.plugins.object[C].width = h(v.plugins.object[C].getDisplayElement().style.width);
                    v.plugins.config[C].currentPosition = v.plugins.config[C].position
                }
            }
            t()
        }
        function t(C) {
            if (v.getMedia() !== undefined) {
                for (var B = 0; B < v.plugins.order.length; B++) {
                    var D = v.plugins.order[B];
                    if (v.plugins.object[D].getDisplayElement !== undefined) {
                        if (v.getMedia().hasChrome()) {
                            v.plugins.config[D].currentPosition = b.html5.view.positions.NONE
                        } else {
                            v.plugins.config[D].currentPosition = v.plugins.config[D].position
                        }
                    }
                }
            }
            i(v.width, v.height)
        }
        function h(B) {
            if (typeof B == "string") {
                if (B === "") {
                    return 0
                } else {
                    if (B.lastIndexOf("%") > -1) {
                        return B
                    } else {
                        return parseInt(B.replace("px", ""), 10)
                    }
                }
            }
            return B
        }
        this.setup = function(B) {
            l = B;
            x();
            j();
            s.jwAddEventListener(b.api.events.JWPLAYER_MEDIA_LOADED, t);
            s.jwAddEventListener(b.api.events.JWPLAYER_MEDIA_META,
            function() {
                w()
            });
            var C;
            if (window.onresize !== null) {
                C = window.onresize
            }
            window.onresize = function(D) {
                if (C !== undefined) {
                    try {
                        C(D)
                    } catch(F) {}
                }
                if (s.jwGetFullscreen()) {
                    var E = document.body.getBoundingClientRect();
                    v.width = Math.abs(E.left) + Math.abs(E.right);
                    v.height = window.innerHeight
                }
                i(v.width, v.height)
            }
        };
        function g(B) {
            switch (B.keyCode) {
            case 27:
                if (s.jwGetFullscreen()) {
                    s.jwSetFullscreen(false)
                }
                break;
            case 32:
                if (s.jwGetState() != b.api.events.state.IDLE && s.jwGetState() != b.api.events.state.PAUSED) {
                    s.jwPause()
                } else {
                    s.jwPlay()
                }
                break
            }
        }
        function i(E, B) {
            if (u.style.display == "none") {
                return
            }
            var D = [].concat(v.plugins.order);
            D.reverse();
            A = D.length + 2;
            if (!v.fullscreen) {
                v.width = E;
                v.height = B;
                f = E;
                z = B;
                c(q, {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: E,
                    height: B
                });
                c(u, {
                    height: z,
                    width: f
                });
                var C = m(r, D);
                if (C.length > 0) {
                    A += C.length;
                    m(k, C, true)
                }
            } else {
                if (navigator.vendor.indexOf("Apple") !== 0) {
                    m(y, D, true)
                }
            }
            w()
        }
        function m(G, D, E) {
            var C = [];
            for (var B = 0; B < D.length; B++) {
                var H = D[B];
                if (v.plugins.object[H].getDisplayElement !== undefined) {
                    if (v.plugins.config[H].currentPosition != b.html5.view.positions.NONE) {
                        var F = G(H, A--);
                        if (!F) {
                            C.push(H)
                        } else {
                            v.plugins.object[H].resize(F.width, F.height);
                            if (E) {
                                delete F.width;
                                delete F.height
                            }
                            c(v.plugins.object[H].getDisplayElement(), F)
                        }
                    } else {
                        c(v.plugins.object[H].getDisplayElement(), {
                            display: "none"
                        })
                    }
                }
            }
            return C
        }
        function r(C, D) {
            if (v.plugins.object[C].getDisplayElement !== undefined) {
                if (v.plugins.config[C].position && a(v.plugins.config[C].position)) {
                    if (v.plugins.object[C].getDisplayElement().parentNode === null) {
                        u.appendChild(v.plugins.object[C].getDisplayElement())
                    }
                    var B = d(C);
                    B.zIndex = D;
                    return B
                }
            }
            return false
        }
        function k(D, E) {
            if (v.plugins.object[D].getDisplayElement().parentNode === null) {
                q.appendChild(v.plugins.object[D].getDisplayElement())
            }
            var B = v.width,
            C = v.height;
            if (typeof v.width == "string" && v.width.lastIndexOf("%") > -1) {
                percentage = parseFloat(v.width.substring(0, v.width.lastIndexOf("%"))) / 100;
                B = Math.round(window.innerWidth * percentage)
            }
            if (typeof v.height == "string" && v.height.lastIndexOf("%") > -1) {
                percentage = parseFloat(v.height.substring(0, v.height.lastIndexOf("%"))) / 100;
                C = Math.round(window.innerHeight * percentage)
            }
            return {
                position: "absolute",
                width: (B - h(q.style.left) - h(q.style.right)),
                height: (C - h(q.style.top) - h(q.style.bottom)),
                zIndex: E
            }
        }
        function y(B, C) {
            return {
                position: "fixed",
                width: v.width,
                height: v.height,
                zIndex: C
            }
        }
        function w() {
            q.style.position = "absolute";
            v.getMedia().getDisplayElement().style.position = "absolute";
            if (v.getMedia().getDisplayElement().videoWidth == 0 || v.getMedia().getDisplayElement().videoHeight == 0) {
                return
            }
            var B,
            D;
            if (q.style.width.toString().lastIndexOf("%") > -1 || q.style.width.toString().lastIndexOf("%") > -1) {
                var C = q.getBoundingClientRect();
                B = Math.abs(C.left) + Math.abs(C.right);
                D = Math.abs(C.top) + Math.abs(C.bottom)
            } else {
                B = h(q.style.width);
                D = h(q.style.height)
            }
            b.utils.stretch(s.jwGetStretching(), v.getMedia().getDisplayElement(), B, D, v.getMedia().getDisplayElement().videoWidth, v.getMedia().getDisplayElement().videoHeight)
        }
        function d(C) {
            var D = {
                position: "absolute",
                margin: 0,
                padding: 0,
                top: null
            };
            var B = v.plugins.config[C].currentPosition.toLowerCase();
            switch (B.toUpperCase()) {
            case b.html5.view.positions.TOP:
                D.top = h(q.style.top);
                D.left = h(q.style.left);
                D.width = f - h(q.style.left) - h(q.style.right);
                D.height = v.plugins.object[C].height;
                q.style[B] = h(q.style[B]) + v.plugins.object[C].height + "px";
                q.style.height = h(q.style.height) - D.height + "px";
                break;
            case b.html5.view.positions.RIGHT:
                D.top = h(q.style.top);
                D.right = h(q.style.right);
                D.width = D.width = v.plugins.object[C].width;
                D.height = z - h(q.style.top) - h(q.style.bottom);
                q.style[B] = h(q.style[B]) + v.plugins.object[C].width + "px";
                q.style.width = h(q.style.width) - D.width + "px";
                break;
            case b.html5.view.positions.BOTTOM:
                D.bottom = h(q.style.bottom);
                D.left = h(q.style.left);
                D.width = f - h(q.style.left) - h(q.style.right);
                D.height = v.plugins.object[C].height;
                q.style[B] = h(q.style[B]) + v.plugins.object[C].height + "px";
                q.style.height = h(q.style.height) - D.height + "px";
                break;
            case b.html5.view.positions.LEFT:
                D.top = h(q.style.top);
                D.left = h(q.style.left);
                D.width = v.plugins.object[C].width;
                D.height = z - h(q.style.top) - h(q.style.bottom);
                q.style[B] = h(q.style[B]) + v.plugins.object[C].width + "px";
                q.style.width = h(q.style.width) - D.width + "px";
                break;
            default:
                break
            }
            return D
        }
        this.resize = i;
        this.fullscreen = function(E) {
            if (navigator.vendor.indexOf("Apple") === 0) {
                if (v.getMedia().getDisplayElement().webkitSupportsFullscreen) {
                    if (E) {
                        try {
                            v.getMedia().getDisplayElement().webkitEnterFullscreen()
                        } catch(D) {}
                    } else {
                        try {
                            v.getMedia().getDisplayElement().webkitExitFullscreen()
                        } catch(D) {}
                    }
                }
            } else {
                if (E) {
                    document.onkeydown = g;
                    clearInterval(n);
                    var C = document.body.getBoundingClientRect();
                    v.width = Math.abs(C.left) + Math.abs(C.right);
                    v.height = window.innerHeight;
                    var B = {
                        position: "fixed",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        zIndex: 2147483000
                    };
                    c(u, B);
                    B.zIndex = 1;
                    c(v.getMedia().getDisplayElement(), B);
                    B.zIndex = 2;
                    c(q, B)
                } else {
                    document.onkeydown = "";
                    v.width = f;
                    v.height = z;
                    c(u, {
                        position: "relative",
                        height: v.height,
                        width: v.width,
                        zIndex: 0
                    })
                }
                i(v.width, v.height)
            }
        }
    };
    function a(d) {
        return ([b.html5.view.positions.TOP, b.html5.view.positions.RIGHT, b.html5.view.positions.BOTTOM, b.html5.view.positions.LEFT].toString().indexOf(d.toUpperCase()) > -1)
    }
    b.html5.view.positions = {
        TOP: "TOP",
        RIGHT: "RIGHT",
        BOTTOM: "BOTTOM",
        LEFT: "LEFT",
        OVER: "OVER",
        NONE: "NONE"
    }
})(jwplayer); (function(a) {
    var b = {
        backgroundcolor: "",
        margin: 10,
        font: "Arial,sans-serif",
        fontsize: 10,
        fontcolor: parseInt("000000", 16),
        fontstyle: "normal",
        fontweight: "bold",
        buttoncolor: parseInt("ffffff", 16),
        position: a.html5.view.positions.BOTTOM,
        idlehide: false,
        layout: {
            left: {
                position: "left",
                elements: [{
                    name: "play",
                    type: "button"
                },
                {
                    name: "divider",
                    type: "divider"
                },
                {
                    name: "prev",
                    type: "button"
                },
                {
                    name: "divider",
                    type: "divider"
                },
                {
                    name: "next",
                    type: "button"
                },
                {
                    name: "divider",
                    type: "divider"
                },
                {
                    name: "elapsed",
                    type: "text"
                }]
            },
            center: {
                position: "center",
                elements: [{
                    name: "time",
                    type: "slider"
                }]
            },
            right: {
                position: "right",
                elements: [{
                    name: "duration",
                    type: "text"
                },
                {
                    name: "blank",
                    type: "button"
                },
                {
                    name: "divider",
                    type: "divider"
                },
                {
                    name: "mute",
                    type: "button"
                },
                {
                    name: "volume",
                    type: "slider"
                },
                {
                    name: "divider",
                    type: "divider"
                },
                {
                    name: "fullscreen",
                    type: "button"
                }]
            }
        }
    };
    _css = a.utils.css;
    _hide = function(c) {
        _css(c, {
            display: "none"
        })
    };
    _show = function(c) {
        _css(c, {
            display: "block"
        })
    };
    a.html5.controlbar = function(j, L) {
        var i = j;
        var A = a.utils.extend({},
        b, i.skin.getComponentSettings("controlbar"), L);
        if (A.position == a.html5.view.positions.NONE || typeof a.html5.view.positions[A.position] == "undefined") {
            return
        }
        if (a.utils.mapLength(i.skin.getComponentLayout("controlbar")) > 0) {
            A.layout = i.skin.getComponentLayout("controlbar")
        }
        var P;
        var I;
        var O;
        var B;
        var t = "none";
        var f;
        var h;
        var Q;
        var e;
        var d;
        var w;
        var s;
        var J = {};
        var n = false;
        var c = {};
        function H() {
            O = 0;
            B = 0;
            I = 0;
            if (!n) {
                var V = {
                    height: i.skin.getSkinElement("controlbar", "background").height,
                    backgroundColor: A.backgroundcolor
                };
                P = document.createElement("div");
                P.id = i.id + "_jwplayer_controlbar";
                _css(P, V)
            }
            v("capLeft", "left", false, P);
            var W = {
                position: "absolute",
                height: i.skin.getSkinElement("controlbar", "background").height,
                left: i.skin.getSkinElement("controlbar", "capLeft").width,
                zIndex: 0
            };
            N("background", P, W, "img");
            if (i.skin.getSkinElement("controlbar", "background")) {
                J.background.src = i.skin.getSkinElement("controlbar", "background").src
            }
            W.zIndex = 1;
            N("elements", P, W);
            v("capRight", "right", false, P)
        }
        this.getDisplayElement = function() {
            return P
        };
        this.resize = function(X, V) {
            a.utils.cancelAnimation(P);
            document.getElementById(i.id).onmousemove = x;
            d = X;
            w = V;
            x();
            var W = u();
            D({
                id: i.id,
                duration: Q,
                position: h
            });
            r({
                id: i.id,
                bufferPercent: e
            });
            return W
        };
        function o() {
            var W = ["timeSlider", "volumeSlider", "timeSliderRail", "volumeSliderRail"];
            for (var X in W) {
                var V = W[X];
                if (typeof J[V] != "undefined") {
                    c[V] = J[V].getBoundingClientRect()
                }
            }
        }
        function x() {
            a.utils.cancelAnimation(P);
            if (g()) {
                a.utils.fadeTo(P, 1, 0, 1, 0)
            } else {
                a.utils.fadeTo(P, 0, 0.1, 1, 2)
            }
        }
        function g() {
            if (i.jwGetState() == a.api.events.state.IDLE || i.jwGetState() == a.api.events.state.PAUSED) {
                if (A.idlehide) {
                    return false
                }
                return true
            }
            if (i.jwGetFullscreen()) {
                return false
            }
            if (A.position == a.html5.view.positions.OVER) {
                return false
            }
            return true
        }
        function N(Z, Y, X, V) {
            var W;
            if (!n) {
                if (!V) {
                    V = "div"
                }
                W = document.createElement(V);
                J[Z] = W;
                W.id = P.id + "_" + Z;
                Y.appendChild(W)
            } else {
                W = document.getElementById(P.id + "_" + Z)
            }
            if (X !== undefined) {
                _css(W, X)
            }
            return W
        }
        function G() {
            U(A.layout.left);
            U(A.layout.right, -1);
            U(A.layout.center)
        }
        function U(Y, V) {
            var Z = Y.position == "right" ? "right": "left";
            var X = a.utils.extend([], Y.elements);
            if (V !== undefined) {
                X.reverse()
            }
            for (var W = 0; W < X.length; W++) {
                z(X[W], Z)
            }
        }
        function E() {
            return I++
        }
        function z(Z, ab) {
            var Y,
            W,
            X,
            V,
            ad;
            switch (Z.name) {
            case "play":
                v("playButton", ab, false);
                v("pauseButton", ab, true);
                K("playButton", "jwPlay");
                K("pauseButton", "jwPause");
                break;
            case "divider":
                v("divider" + E(), ab, true, undefined, undefined, Z.width);
                break;
            case "prev":
                v("prevButton", ab, true);
                K("prevButton", "jwPlaylistPrev");
                break;
            case "next":
                v("nextButton", ab, true);
                K("nextButton", "jwPlaylistNext");
                break;
            case "elapsed":
                v("elapsedText", ab, true);
                break;
            case "time":
                W = i.skin.getSkinElement("controlbar", "timeSliderCapLeft") === undefined ? 0: i.skin.getSkinElement("controlbar", "timeSliderCapLeft").width;
                X = i.skin.getSkinElement("controlbar", "timeSliderCapRight") === undefined ? 0: i.skin.getSkinElement("controlbar", "timeSliderCapRight").width;
                Y = ab == "left" ? W: X;
                V = i.skin.getSkinElement("controlbar", "timeSliderRail").width + W + X;
                ad = {
                    height: i.skin.getSkinElement("controlbar", "background").height,
                    position: "absolute",
                    top: 0,
                    width: V
                };
                ad[ab] = ab == "left" ? O: B;
                var aa = N("timeSlider", J.elements, ad);
                v("timeSliderCapLeft", ab, true, aa, ab == "left" ? 0: Y);
                v("timeSliderRail", ab, false, aa, Y);
                v("timeSliderBuffer", ab, false, aa, Y);
                v("timeSliderProgress", ab, false, aa, Y);
                v("timeSliderThumb", ab, false, aa, Y);
                v("timeSliderCapRight", ab, true, aa, ab == "right" ? 0: Y);
                M("time");
                break;
            case "fullscreen":
                v("fullscreenButton", ab, false);
                v("normalscreenButton", ab, true);
                K("fullscreenButton", "jwSetFullscreen", true);
                K("normalscreenButton", "jwSetFullscreen", false);
                break;
            case "volume":
                W = i.skin.getSkinElement("controlbar", "volumeSliderCapLeft") === undefined ? 0: i.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width;
                X = i.skin.getSkinElement("controlbar", "volumeSliderCapRight") === undefined ? 0: i.skin.getSkinElement("controlbar", "volumeSliderCapRight").width;
                Y = ab == "left" ? W: X;
                V = i.skin.getSkinElement("controlbar", "volumeSliderRail").width + W + X;
                ad = {
                    height: i.skin.getSkinElement("controlbar", "background").height,
                    position: "absolute",
                    top: 0,
                    width: V
                };
                ad[ab] = ab == "left" ? O: B;
                var ac = N("volumeSlider", J.elements, ad);
                v("volumeSliderCapLeft", ab, true, ac, ab == "left" ? 0: Y);
                v("volumeSliderRail", ab, true, ac, Y);
                v("volumeSliderProgress", ab, false, ac, Y);
                v("volumeSliderCapRight", ab, true, ac, ab == "right" ? 0: Y);
                M("volume");
                break;
            case "mute":
                v("muteButton", ab, false);
                v("unmuteButton", ab, true);
                K("muteButton", "jwSetMute", true);
                K("unmuteButton", "jwSetMute", false);
                break;
            case "duration":
                v("durationText", ab, true);
                break
            }
        }
        function v(X, aa, W, ac, Y, V) {
            if ((i.skin.getSkinElement("controlbar", X) !== undefined || X.indexOf("Text") > 0 || X.indexOf("divider") === 0) && !(X.indexOf("divider") === 0 && s.indexOf("divider") === 0)) {
                s = X;
                var Z = {
                    height: i.skin.getSkinElement("controlbar", "background").height,
                    position: "absolute",
                    display: "block",
                    top: 0
                };
                if ((X.indexOf("next") === 0 || X.indexOf("prev") === 0) && i.jwGetPlaylist().length < 2) {
                    W = false;
                    Z.display = "none"
                }
                var ad;
                if (X.indexOf("Text") > 0) {
                    X.innerhtml = "00:00";
                    Z.font = A.fontsize + "px/" + (i.skin.getSkinElement("controlbar", "background").height + 1) + "px " + A.font;
                    Z.color = A.fontcolor;
                    Z.textAlign = "center";
                    Z.fontWeight = A.fontweight;
                    Z.fontStyle = A.fontstyle;
                    Z.cursor = "default";
                    ad = 14 + 3 * A.fontsize
                } else {
                    if (X.indexOf("divider") === 0) {
                        if (V) {
                            if (!isNaN(parseInt(V))) {
                                ad = parseInt(V)
                            }
                        } else {
                            Z.background = "url(" + i.skin.getSkinElement("controlbar", "divider").src + ") repeat-x center left";
                            ad = i.skin.getSkinElement("controlbar", "divider").width
                        }
                    } else {
                        Z.background = "url(" + i.skin.getSkinElement("controlbar", X).src + ") repeat-x center left";
                        ad = i.skin.getSkinElement("controlbar", X).width
                    }
                }
                if (aa == "left") {
                    Z.left = isNaN(Y) ? O: Y;
                    if (W) {
                        O += ad
                    }
                } else {
                    if (aa == "right") {
                        Z.right = isNaN(Y) ? B: Y;
                        if (W) {
                            B += ad
                        }
                    }
                }
                if (a.utils.typeOf(ac) == "undefined") {
                    ac = J.elements
                }
                Z.width = ad;
                if (n) {
                    _css(J[X], Z)
                } else {
                    var ab = N(X, ac, Z);
                    if (i.skin.getSkinElement("controlbar", X + "Over") !== undefined) {
                        ab.onmouseover = function(ae) {
                            ab.style.backgroundImage = ["url(", i.skin.getSkinElement("controlbar", X + "Over").src, ")"].join("")
                        };
                        ab.onmouseout = function(ae) {
                            ab.style.backgroundImage = ["url(", i.skin.getSkinElement("controlbar", X).src, ")"].join("")
                        }
                    }
                }
            }
        }
        function C() {
            i.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, y);
            i.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER, r);
            i.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, p);
            i.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_TIME, D);
            i.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, T);
            i.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_VOLUME, k);
            i.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, F)
        }
        function y() {
            H();
            G();
            u();
            R()
        }
        function R() {
            D({
                id: i.id,
                duration: i.jwGetDuration(),
                position: 0
            });
            r({
                id: i.id,
                bufferProgress: 0
            });
            T({
                id: i.id,
                mute: i.jwGetMute()
            });
            p({
                id: i.id,
                newstate: a.api.events.state.IDLE
            });
            k({
                id: i.id,
                volume: i.jwGetVolume()
            })
        }
        function K(X, Y, W) {
            if (n) {
                return
            }
            if (i.skin.getSkinElement("controlbar", X) !== undefined) {
                var V = J[X];
                if (V !== null) {
                    _css(V, {
                        cursor: "pointer"
                    });
                    if (Y == "fullscreen") {
                        V.onmouseup = function(Z) {
                            Z.stopPropagation();
                            i.jwSetFullscreen(!i.jwGetFullscreen())
                        }
                    } else {
                        V.onmouseup = function(Z) {
                            Z.stopPropagation();
                            if (W !== null) {
                                i[Y](W)
                            } else {
                                i[Y]()
                            }
                        }
                    }
                }
            }
        }
        function M(V) {
            if (n) {
                return
            }
            var W = J[V + "Slider"];
            _css(J.elements, {
                cursor: "pointer"
            });
            _css(W, {
                cursor: "pointer"
            });
            W.onmousedown = function(X) {
                t = V
            };
            W.onmouseup = function(X) {
                X.stopPropagation();
                S(X.pageX)
            };
            W.onmousemove = function(X) {
                if (t == "time") {
                    f = true;
                    var Y = X.pageX - c[V + "Slider"].left - window.pageXOffset;
                    _css(J.timeSliderThumb, {
                        left: Y
                    })
                }
            }
        }
        function S(W) {
            f = false;
            var V;
            if (t == "time") {
                V = W - c.timeSliderRail.left + window.pageXOffset;
                var Y = V / c.timeSliderRail.width * Q;
                if (Y < 0) {
                    Y = 0
                } else {
                    if (Y > Q) {
                        Y = Q - 3
                    }
                }
                i.jwSeek(Y);
                if (i.jwGetState() != a.api.events.state.PLAYING) {
                    i.jwPlay()
                }
            } else {
                if (t == "volume") {
                    V = W - c.volumeSliderRail.left - window.pageXOffset;
                    var X = Math.round(V / c.volumeSliderRail.width * 100);
                    if (X < 0) {
                        X = 0
                    } else {
                        if (X > 100) {
                            X = 100
                        }
                    }
                    if (i.jwGetMute()) {
                        i.jwSetMute(false)
                    }
                    i.jwSetVolume(X)
                }
            }
            t = "none"
        }
        function r(W) {
            if (W.bufferPercent !== null) {
                e = W.bufferPercent
            }
            var X = c.timeSliderRail.width;
            var V = isNaN(Math.round(X * e / 100)) ? 0: Math.round(X * e / 100);
            _css(J.timeSliderBuffer, {
                width: V
            })
        }
        function T(V) {
            if (V.mute) {
                _hide(J.muteButton);
                _show(J.unmuteButton);
                _hide(J.volumeSliderProgress)
            } else {
                _show(J.muteButton);
                _hide(J.unmuteButton);
                _show(J.volumeSliderProgress)
            }
        }
        function p(V) {
            if (V.newstate == a.api.events.state.BUFFERING || V.newstate == a.api.events.state.PLAYING) {
                _show(J.pauseButton);
                _hide(J.playButton)
            } else {
                _hide(J.pauseButton);
                _show(J.playButton)
            }
            x();
            if (V.newstate == a.api.events.state.IDLE) {
                _hide(J.timeSliderBuffer);
                _hide(J.timeSliderProgress);
                _hide(J.timeSliderThumb);
                D({
                    id: i.id,
                    duration: i.jwGetDuration(),
                    position: 0
                })
            } else {
                _show(J.timeSliderBuffer);
                if (V.newstate != a.api.events.state.BUFFERING) {
                    _show(J.timeSliderProgress);
                    _show(J.timeSliderThumb)
                }
            }
        }
        function F(V) {
            r({
                bufferPercent: 0
            });
            D(a.utils.extend(V, {
                position: 0,
                duration: Q
            }))
        }
        function D(Y) {
            if (Y.position !== null) {
                h = Y.position
            }
            if (Y.duration !== null) {
                Q = Y.duration
            }
            var W = (h === Q === 0) ? 0: h / Q;
            var V = isNaN(Math.round(c.timeSliderRail.width * W)) ? 0: Math.round(c.timeSliderRail.width * W);
            var X = V;
            J.timeSliderProgress.style.width = V + "px";
            if (!f) {
                if (J.timeSliderThumb) {
                    J.timeSliderThumb.style.left = X + "px"
                }
            }
            if (J.durationText) {
                J.durationText.innerHTML = m(Q)
            }
            if (J.elapsedText) {
                J.elapsedText.innerHTML = m(h)
            }
        }
        function m(V) {
            str = "00:00";
            if (V > 0) {
                str = Math.floor(V / 60) < 10 ? "0" + Math.floor(V / 60) + ":": Math.floor(V / 60) + ":";
                str += Math.floor(V % 60) < 10 ? "0" + Math.floor(V % 60) : Math.floor(V % 60)
            }
            return str
        }
        function l() {
            var Y,
            W;
            var X = document.getElementById(P.id + "_elements").childNodes;
            for (var V in document.getElementById(P.id + "_elements").childNodes) {
                if (isNaN(parseInt(V, 10))) {
                    continue
                }
                if (X[V].id.indexOf(P.id + "_divider") === 0 && W.id.indexOf(P.id + "_divider") === 0) {
                    X[V].style.display = "none"
                } else {
                    if (X[V].id.indexOf(P.id + "_divider") === 0 && Y.style.display != "none") {
                        X[V].style.display = "block"
                    }
                }
                if (X[V].style.display != "none") {
                    W = X[V]
                }
                Y = X[V]
            }
        }
        function u() {
            l();
            if (i.jwGetFullscreen()) {
                _show(J.normalscreenButton);
                _hide(J.fullscreenButton)
            } else {
                _hide(J.normalscreenButton);
                _show(J.fullscreenButton)
            }
            var W = {
                width: d
            };
            var V = {};
            if (A.position == a.html5.view.positions.OVER || i.jwGetFullscreen()) {
                W.left = A.margin;
                W.width -= 2 * A.margin;
                W.top = w - i.skin.getSkinElement("controlbar", "background").height - A.margin;
                W.height = i.skin.getSkinElement("controlbar", "background").height
            } else {
                W.left = 0
            }
            V.left = i.skin.getSkinElement("controlbar", "capLeft").width;
            V.width = W.width - i.skin.getSkinElement("controlbar", "capLeft").width - i.skin.getSkinElement("controlbar", "capRight").width;
            var X = i.skin.getSkinElement("controlbar", "timeSliderCapLeft") === undefined ? 0: i.skin.getSkinElement("controlbar", "timeSliderCapLeft").width;
            _css(J.timeSliderRail, {
                width: (V.width - O - B),
                left: X
            });
            if (J.timeSliderCapRight !== undefined) {
                _css(J.timeSliderCapRight, {
                    left: X + (V.width - O - B)
                })
            }
            _css(P, W);
            _css(J.elements, V);
            _css(J.background, V);
            o();
            return W
        }
        function k(Z) {
            if (J.volumeSliderRail !== undefined) {
                var X = isNaN(Z.volume / 100) ? 1: Z.volume / 100;
                var Y = parseInt(J.volumeSliderRail.style.width.replace("px", ""), 10);
                var V = isNaN(Math.round(Y * X)) ? 0: Math.round(Y * X);
                var aa = parseInt(J.volumeSliderRail.style.right.replace("px", ""), 10);
                var W = i.skin.getSkinElement("controlbar", "volumeSliderCapLeft") === undefined ? 0: i.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width;
                _css(J.volumeSliderProgress, {
                    width: V,
                    left: W
                });
                if (J.volumeSliderCapLeft !== undefined) {
                    _css(J.volumeSliderCapLeft, {
                        left: 0
                    })
                }
            }
        }
        function q() {
            H();
            G();
            o();
            n = true;
            C();
            R();
            P.style.opacity = A.idlehide ? 0: 1
        }
        q();
        return this
    }
})(jwplayer); (function(b) {
    var a = ["width", "height", "state", "playlist", "item", "position", "buffer", "duration", "volume", "mute", "fullscreen"];
    b.html5.controller = function(t, r, e, q) {
        var w = t;
        var y = e;
        var d = q;
        var k = r;
        var A = true;
        var c = -1;
        var u = (y.config.debug !== undefined) && (y.config.debug.toString().toLowerCase() == "console");
        var i = new b.html5.eventdispatcher(k.id, u);
        b.utils.extend(this, i);
        function m(D) {
            i.sendEvent(D.type, D)
        }
        y.addGlobalListener(m);
        function p() {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0) {
                    if (A || y.state == b.api.events.state.IDLE) {
                        y.addEventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL,
                        function() {
                            y.getMedia().play()
                        });
                        y.addEventListener(b.api.events.JWPLAYER_MEDIA_TIME,
                        function(E) {
                            if (E.position >= y.playlist[y.item].start && c >= 0) {
                                y.playlist[y.item].start = c;
                                c = -1
                            }
                        });
                        if (y.config.repeat) {
                            y.addEventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE,
                            function(E) {
                                setTimeout(n, 25)
                            })
                        }
                        y.getMedia().load(y.playlist[y.item]);
                        A = false
                    } else {
                        if (y.state == b.api.events.state.PAUSED) {
                            y.getMedia().play()
                        }
                    }
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function B() {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0) {
                    switch (y.state) {
                    case b.api.events.state.PLAYING:
                    case b.api.events.state.BUFFERING:
                        y.getMedia().pause();
                        break
                    }
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function x(D) {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0) {
                    if (typeof D != "number") {
                        D = parseFloat(D)
                    }
                    switch (y.state) {
                    case b.api.events.state.IDLE:
                        if (c < 0) {
                            c = y.playlist[y.item].start;
                            y.playlist[y.item].start = D
                        }
                        p();
                        break;
                    case b.api.events.state.PLAYING:
                    case b.api.events.state.PAUSED:
                    case b.api.events.state.BUFFERING:
                        y.getMedia().seek(D);
                        break
                    }
                }
                return true
            } catch(E) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, E)
            }
            return false
        }
        function j() {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0 && y.state != b.api.events.state.IDLE) {
                    y.getMedia().stop()
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function g() {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0) {
                    if (y.config.shuffle) {
                        o(s())
                    } else {
                        if (y.item + 1 == y.playlist.length) {
                            o(0)
                        } else {
                            o(y.item + 1)
                        }
                    }
                }
                if (y.state != b.api.events.state.PLAYING && y.state != b.api.events.state.BUFFERING) {
                    p()
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function f() {
            try {
                if (y.playlist[y.item].levels[0].file.length > 0) {
                    if (y.config.shuffle) {
                        o(s())
                    } else {
                        if (y.item === 0) {
                            o(y.playlist.length - 1)
                        } else {
                            o(y.item - 1)
                        }
                    }
                }
                if (y.state != b.api.events.state.PLAYING && y.state != b.api.events.state.BUFFERING) {
                    p()
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function s() {
            var D = null;
            if (y.playlist.length > 1) {
                while (D === null) {
                    D = Math.floor(Math.random() * y.playlist.length);
                    if (D == y.item) {
                        D = null
                    }
                }
            } else {
                D = 0
            }
            return D
        }
        function o(E) {
            y.resetEventListeners();
            y.addGlobalListener(m);
            try {
                if (y.playlist[E].levels[0].file.length > 0) {
                    var F = y.state;
                    if (F !== b.api.events.state.IDLE) {
                        j()
                    }
                    y.item = E;
                    A = true;
                    y.setActiveMediaProvider(y.playlist[y.item]);
                    i.sendEvent(b.api.events.JWPLAYER_PLAYLIST_ITEM, {
                        index: E
                    });
                    if (F == b.api.events.state.PLAYING || F == b.api.events.state.BUFFERING || y.config.chromeless || e.config.autostart === true) {
                        p()
                    }
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function z(E) {
            try {
                switch (typeof(E)) {
                case "number":
                    y.getMedia().volume(E);
                    break;
                case "string":
                    y.getMedia().volume(parseInt(E, 10));
                    break
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function l(E) {
            try {
                if (typeof E == "undefined") {
                    y.getMedia().mute(!y.mute)
                } else {
                    if (E.toString().toLowerCase() == "true") {
                        y.getMedia().mute(true)
                    } else {
                        y.getMedia().mute(false)
                    }
                }
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function h(E, D) {
            try {
                y.width = E;
                y.height = D;
                d.resize(E, D);
                i.sendEvent(b.api.events.JWPLAYER_RESIZE, {
                    width: y.width,
                    height: y.height
                });
                return true
            } catch(F) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, F)
            }
            return false
        }
        function v(E) {
            try {
                if (typeof E == "undefined") {
                    y.fullscreen = !y.fullscreen;
                    d.fullscreen(!y.fullscreen)
                } else {
                    if (E.toString().toLowerCase() == "true") {
                        y.fullscreen = true;
                        d.fullscreen(true)
                    } else {
                        y.fullscreen = false;
                        d.fullscreen(false)
                    }
                }
                i.sendEvent(b.api.events.JWPLAYER_RESIZE, {
                    width: y.width,
                    height: y.height
                });
                i.sendEvent(b.api.events.JWPLAYER_FULLSCREEN, {
                    fullscreen: E
                });
                return true
            } catch(D) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, D)
            }
            return false
        }
        function C(D) {
            try {
                j();
                y.loadPlaylist(D);
                o(y.item);
                return true
            } catch(E) {
                i.sendEvent(b.api.events.JWPLAYER_ERROR, E)
            }
            return false
        }
        b.html5.controller.repeatoptions = {
            LIST: "LIST",
            ALWAYS: "ALWAYS",
            SINGLE: "SINGLE",
            NONE: "NONE"
        };
        function n() {
            y.resetEventListeners();
            y.addGlobalListener(m);
            switch (y.config.repeat.toUpperCase()) {
            case b.html5.controller.repeatoptions.SINGLE:
                p();
                break;
            case b.html5.controller.repeatoptions.ALWAYS:
                if (y.item == y.playlist.length - 1 && !y.config.shuffle) {
                    o(0);
                    p()
                } else {
                    g()
                }
                break;
            case b.html5.controller.repeatoptions.LIST:
                if (y.item == y.playlist.length - 1 && !y.config.shuffle) {
                    o(0)
                } else {
                    g()
                }
                break
            }
        }
        this.play = p;
        this.pause = B;
        this.seek = x;
        this.stop = j;
        this.next = g;
        this.prev = f;
        this.item = o;
        this.setVolume = z;
        this.setMute = l;
        this.resize = h;
        this.setFullscreen = v;
        this.load = C
    }
})(jwplayer); (function(a) {
    a.html5.defaultSkin = function() {
        this.text = '<?xml version="1.0" ?><skin author="LongTail Video" name="Five" version="1.0"><settings><setting name="backcolor" value="0xFFFFFF"/><setting name="frontcolor" value="0x000000"/><setting name="lightcolor" value="0x000000"/><setting name="screencolor" value="0x000000"/></settings><components><component name="controlbar"><settings><setting name="margin" value="20"/><setting name="fontsize" value="11"/></settings><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFJJREFUeNrslLENwAAIwxLU/09j5AiOgD5hVQzNAVY8JK4qEfHMIKBnd2+BQlBINaiRtL/aV2rdzYBsM6CIONbI1NZENTr3RwdB2PlnJgJ6BRgA4hwu5Qg5iswAAAAASUVORK5CYII="/><element name="capLeft" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="capRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="divider" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="playButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhJREFUeNpiYqABYBo1dNRQ+hr6H4jvA3E8NS39j4SpZvh/LJig4YxEGEqy3kET+w+AOGFQRhTJhrEQkGcczfujhg4CQwECDADpTRWU/B3wHQAAAABJRU5ErkJggg=="/><element name="pauseButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAChJREFUeNpiYBgFo2DwA0YC8v/R1P4nRu+ooaOGUtnQUTAKhgIACDAAFCwQCfAJ4gwAAAAASUVORK5CYII="/><element name="prevButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEtJREFUeNpiYBgFo2Dog/9QDAPyQHweTYwiQ/2B+D0Wi8g2tB+JTdBQRiIMJVkvEy0iglhDF9Aq9uOpHVEwoE+NJDUKRsFgAAABBgDe2hqZcNNL0AAAAABJRU5ErkJggg=="/><element name="nextButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUeNpiYBgFo2Dog/9AfB6I5dHE/lNqKAi/B2J/ahsKw/3EGMpIhKEk66WJoaR6fz61IyqemhEFSlL61ExSo2AUDAYAEGAAiG4hj+5t7M8AAAAASUVORK5CYII="/><element name="timeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpiYBgFo2AU0Bwwzluw+D8tLWARFhKiqQ9YuLg4aWsBGxs7bS1gZ6e5BWyjSX0UjIKhDgACDABlYQOGh5pYywAAAABJRU5ErkJggg=="/><element name="timeSliderBuffer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYBgFo2AU0Bww1jc0/aelBSz8/Pw09QELOzs7bS1gY2OjrQWsrKy09gHraFIfBaNgqAOAAAMAvy0DChXHsZMAAAAASUVORK5CYII="/><element name="timeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAClJREFUeNpiYBgFo2AU0BwwAvF/WlrARGsfjFow8BaMglEwCugAAAIMAOHfAQunR+XzAAAAAElFTkSuQmCC"/><element name="timeSliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAICAYAAAA870V8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpiZICA/yCCiQEJUJcDEGAAY0gBD1/m7Q0AAAAASUVORK5CYII="/><element name="muteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADFJREFUeNpiYBgFIw3MB+L/5Gj8j6yRiRTFyICJXHfTXyMLAXlGati4YDRFDj8AEGAABk8GSqqS4CoAAAAASUVORK5CYII="/><element name="unmuteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYBgFgxz8p7bm+cQa+h8LHy7GhEcjIz4bmAjYykiun/8j0fakGPIfTfPgiSr6aB4FVAcAAQYAWdwR1G1Wd2gAAAAASUVORK5CYII="/><element name="volumeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGpJREFUeNpi/P//PwM9ABMDncCoRYPfIqqDZcuW1UPp/6AUDcNM1DQYKtRAlaAj1mCSLSLXYIIWUctgDItoZfDA5aOoqKhGEANIM9LVR7SymGDQUctikuOIXkFNdhHEOFrDjlpEd4sAAgwAriRMub95fu8AAAAASUVORK5CYII="/><element name="volumeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFtJREFUeNpi/P//PwM9ABMDncCoRYPfIlqAeij9H5SiYZiqBqPTlFqE02BKLSLaYFItIttgQhZRzWB8FjENiuRJ7aAbsMQwYMl7wDIsWUUQ42gNO2oR3S0CCDAAKhKq6MLLn8oAAAAASUVORK5CYII="/><element name="fullscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE5JREFUeNpiYBgFo2DQA0YC8v/xqP1PjDlMRDrEgUgxkgHIlfZoriVGjmzLsLFHAW2D6D8eA/9Tw7L/BAwgJE90PvhPpNgoGAVDEQAEGAAMdhTyXcPKcAAAAABJRU5ErkJggg=="/><element name="normalscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEZJREFUeNpiYBgFo2DIg/9UUkOUAf8JiFFsyX88fJyAkcQgYMQjNkzBoAgiezyRbE+tFGSPxQJ7auYBmma0UTAKBhgABBgAJAEY6zON61sAAAAASUVORK5CYII="/></elements></component><component name="display"><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC"/><element name="playIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg=="/><element name="muteIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHJJREFUeNrs1jEOgCAMBVAg7t5/8qaoIy4uoobyXsLCxA+0NCUAAADGUWvdQoQ41x4ixNBB2hBvBskdD3w5ZCkl3+33VqI0kjBBlh9rp+uTcyOP33TnolfsU85XX3yIRpQph8ZQY3wTZtU5AACASA4BBgDHoVuY1/fvOQAAAABJRU5ErkJggg=="/><element name="errorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWlJREFUeNrsl+1twjAQhsHq/7BBYQLYIBmBDcoGMAIjtBPQTcII2SDtBDBBwrU6pGsUO7YbO470PtKJkz9iH++d4ywWAAAAAABgljRNsyWr2bZzDuJG1rLdZhcMbTjrBCGDyUKsqQLFciJb9bSvuG/WagRVRUVUI6gqy5HVeKWfSgRyJruKIU//TrZTSn2nmlaXThrloi/v9F2STC1W4+Aw5cBzkquRc09bofFNc6YLxEON0VUZS5FPTftO49vMjRsIF3RhOGr7/D/pJw+FKU+q0vDyq8W42jCunDqI3LC5XxNj2wHLU1XjaRnb0Lhykhqhhd8MtSF5J9tbjCv4mXGvKJz/65FF/qJryyaaIvzP2QRxZTX2nTuXjvV/VPFSwyLnW7mpH99yTh1FEVro6JBSd40/pMrRdV8vPtcKl28T2pT8TnFZ4yNosct3Q0io6JfBiz1FlGdqVQH3VHnepAEAAAAAADDzEGAAcTwB10jWgxcAAAAASUVORK5CYII="/><element name="bufferIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAuhJREFUeNrsWr9rU1EUznuNGqvFQh1ULOhiBx0KDtIuioO4pJuik3FxFfUPaAV1FTdx0Q5d2g4FFxehTnEpZHFoBy20tCIWtGq0TZP4HfkeHB5N8m6Sl/sa74XDybvv3vvOd8/Pe4lXrVZT3dD8VJc0B8QBcUAcEAfESktHGeR5XtMfqFQq/f92zPe/NbtGlKTdCY30kuxrpMGO94BlQCXs+rbh3ONgA6BlzP1p20d80gEI5hmA2A92Qua1Q2PtAFISM+bvjMG8U+Q7oA3rQGASwrYCU6WpNdLGYbA+Pq5jjXIiwi8EEa2UDbQSaKOIuV+SlkcCrfjY8XTI9EpKGwP0C2kru2hLtHqa4zoXtZRWyvi4CLwv9Opr6Hkn6A9HKgEANsQ1iqC3Ub/vRUk2JgmRkatK36kVrnt0qObunwUdUUMXMWYpakJsO5Am8tAw2GBIgwWA+G2S2dMpiw0gDioQRQJoKhRb1QiDwlHZUABYbaXWsm5ae6loTE4ZDxN4CZar8foVzOJ2iyZ2kWF3t7YIevffaMT5yJ70kQb2fQ1sE5SHr2wazs2wgMxgbsEKEAgxAvZUJbQLBGTSBMgNrncJbA6AljtS/eKDJ0Ez+DmrQEzXS2h1Ck25kAg0IZcUOaydCy4sYnN2fOA+2AP16gNoHALlQ+fwH7XO4CxLenUpgj4xr6ugY2roPMbMx+Xs18m/E8CVEIhxsNeg83XWOAN6grG3lGbk8uE5fr4B/WH3cJw+co/l9nTYsSGYCJ/lY5/qv0thn6nrIWmjeJcPSnWOeY++AkF8tpJHIMAUs/MaBBpj3znZfQo5psY+ZrG4gv5HickjEOymKjEeRpgyST6IuZcTcWbnjcgdPi5ghxciRKsl1lDSsgwA1i8fssonJgzmTSqfGUkCENndNdAL7PS6QQ7ZYISTo+1qq0LEWjTWcvY4isa4z+yfQB+7ooyHVg5RI7/i1Ijn/vnggDggDogD4oC00P4KMACd/juEHOrS4AAAAABJRU5ErkJggg=="/></elements></component><component name="dock"><elements><element name="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFBJREFUeNrs0cEJACAQA8Eofu0fu/W6EM5ZSAFDRpKTBs00CQQEBAQEBAQEBAQEBAQEBATkK8iqbY+AgICAgICAgICAgICAgICAgIC86QowAG5PAQzEJ0lKAAAAAElFTkSuQmCC"/></elements></component><component name="playlist"><elements><element name="item" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHhJREFUeNrs2NEJwCAMBcBYuv/CFuIE9VN47WWCR7iocXR3pdWdGPqqwIoMjYfQeAiNh9B4JHc6MHQVHnjggQceeOCBBx77TifyeOY0iHi8DqIdEY8dD5cL094eePzINB5CO/LwcOTptNB4CP25L4TIbZzpU7UEGAA5wz1uF5rF9AAAAABJRU5ErkJggg=="/><element name="sliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAA8CAIAAADpFA0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUeNrsy6ENACAMAMHClp2wYxZLAg5Fcu9e3OjuOKqqfTMzbs14CIZhGIZhGIZhGP4VLwEGAK/BBnVFpB0oAAAAAElFTkSuQmCC"/><element name="sliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAA8CAIAAADpFA0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNrsy7ENACAMBLE8++8caFFKKiRffU53112SGs3ttOohGIZhGIZhGIZh+Fe8BRgAiaUGde6NOSEAAAAASUVORK5CYII="/></elements></component></components></skin>';
        this.xml = null;
        if (window.DOMParser) {
            parser = new DOMParser();
            this.xml = parser.parseFromString(this.text, "text/xml")
        } else {
            this.xml = new ActiveXObject("Microsoft.XMLDOM");
            this.xml.async = "false";
            this.xml.loadXML(this.text)
        }
        return this
    }
})(jwplayer); (function(a) {
    _css = a.utils.css;
    _hide = function(b) {
        _css(b, {
            display: "none"
        })
    };
    _show = function(b) {
        _css(b, {
            display: "block"
        })
    };
    a.html5.display = function(o, z) {
        var r = {
            icons: true
        };
        var j = a.utils.extend({},
        r, z);
        var w = o;
        var d = {};
        var f;
        var A;
        var k;
        var x;
        var y;
        var p;
        var i;
        var n = w.skin.getComponentSettings("display").bufferrotation === undefined ? 15: parseInt(w.skin.getComponentSettings("display").bufferrotation, 10);
        var e = w.skin.getComponentSettings("display").bufferinterval === undefined ? 100: parseInt(w.skin.getComponentSettings("display").bufferinterval, 10);
        var c = {
            display: {
                style: {
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    overflow: "hidden"
                },
                click: u
            },
            display_icon: {
                style: {
                    cursor: "pointer",
                    position: "absolute",
                    top: ((w.skin.getSkinElement("display", "background").height - w.skin.getSkinElement("display", "playIcon").height) / 2),
                    left: ((w.skin.getSkinElement("display", "background").width - w.skin.getSkinElement("display", "playIcon").width) / 2),
                    border: 0,
                    margin: 0,
                    padding: 0,
                    zIndex: 3
                }
            },
            display_iconBackground: {
                style: {
                    cursor: "pointer",
                    position: "absolute",
                    top: ((A - w.skin.getSkinElement("display", "background").height) / 2),
                    left: ((f - w.skin.getSkinElement("display", "background").width) / 2),
                    border: 0,
                    backgroundImage: (["url(", w.skin.getSkinElement("display", "background").src, ")"]).join(""),
                    width: w.skin.getSkinElement("display", "background").width,
                    height: w.skin.getSkinElement("display", "background").height,
                    margin: 0,
                    padding: 0,
                    zIndex: 2
                }
            },
            display_image: {
                style: {
                    display: "none",
                    width: f,
                    height: A,
                    position: "absolute",
                    cursor: "pointer",
                    left: 0,
                    top: 0,
                    margin: 0,
                    padding: 0,
                    textDecoration: "none",
                    zIndex: 1
                }
            },
            display_text: {
                style: {
                    zIndex: 4,
                    position: "relative",
                    opacity: 0.8,
                    backgroundColor: parseInt("000000", 16),
                    color: parseInt("ffffff", 16),
                    textAlign: "center",
                    fontFamily: "Arial,sans-serif",
                    padding: "0 5px",
                    fontSize: 14
                }
            }
        };
        w.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, l);
        w.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, l);
        w.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, l);
        w.jwAddEventListener(a.api.events.JWPLAYER_ERROR, t);
        B();
        function B() {
            d.display = s("div", "display");
            d.display_text = s("div", "display_text");
            d.display.appendChild(d.display_text);
            d.display_image = s("img", "display_image");
            d.display_image.onerror = function(C) {
                _hide(d.display_image)
            };
            d.display_image.onload = m;
            d.display_icon = s("div", "display_icon");
            d.display_iconBackground = s("div", "display_iconBackground");
            d.display.appendChild(d.display_image);
            d.display_iconBackground.appendChild(d.display_icon);
            d.display.appendChild(d.display_iconBackground);
            b()
        }
        this.getDisplayElement = function() {
            return d.display
        };
        this.resize = function(D, C) {
            f = D;
            A = C;
            _css(d.display, {
                width: D,
                height: C
            });
            _css(d.display_text, {
                width: (D - 10),
                top: ((A - d.display_text.getBoundingClientRect().height) / 2)
            });
            _css(d.display_iconBackground, {
                top: ((A - w.skin.getSkinElement("display", "background").height) / 2),
                left: ((f - w.skin.getSkinElement("display", "background").width) / 2)
            });
            h();
            l({})
        };
        function m(C) {
            k = d.display_image.naturalWidth;
            x = d.display_image.naturalHeight;
            h()
        }
        function h() {
            a.utils.stretch(w.jwGetStretching(), d.display_image, f, A, k, x)
        }
        function s(C, E) {
            var D = document.createElement(C);
            D.id = w.id + "_jwplayer_" + E;
            _css(D, c[E].style);
            return D
        }
        function b() {
            for (var C in d) {
                if (c[C].click !== undefined) {
                    d[C].onclick = c[C].click
                }
            }
        }
        function u(C) {
            if (typeof C.preventDefault != "undefined") {
                C.preventDefault()
            } else {
                C.returnValue = false
            }
            if (w.jwGetState() != a.api.events.state.PLAYING) {
                w.jwPlay()
            } else {
                w.jwPause()
            }
        }
        function g(C) {
            if (i || !j.icons) {
                q();
                return
            }
            _show(d.display_iconBackground);
            d.display_icon.style.backgroundImage = (["url(", w.skin.getSkinElement("display", C).src, ")"]).join("");
            _css(d.display_icon, {
                display: "block",
                width: w.skin.getSkinElement("display", C).width,
                height: w.skin.getSkinElement("display", C).height,
                top: (w.skin.getSkinElement("display", "background").height - w.skin.getSkinElement("display", C).height) / 2,
                left: (w.skin.getSkinElement("display", "background").width - w.skin.getSkinElement("display", C).width) / 2
            });
            if (w.skin.getSkinElement("display", C + "Over") !== undefined) {
                d.display_icon.onmouseover = function(D) {
                    d.display_icon.style.backgroundImage = ["url(", w.skin.getSkinElement("display", C + "Over").src, ")"].join("")
                };
                d.display_icon.onmouseout = function(D) {
                    d.display_icon.style.backgroundImage = ["url(", w.skin.getSkinElement("display", C).src, ")"].join("")
                }
            } else {
                d.display_icon.onmouseover = null;
                d.display_icon.onmouseout = null
            }
        }
        function q() {
            _hide(d.display_icon);
            _hide(d.display_iconBackground)
        }
        function t(C) {
            i = true;
            q();
            d.display_text.innerHTML = C.error;
            _show(d.display_text);
            d.display_text.style.top = ((A - d.display_text.getBoundingClientRect().height) / 2) + "px"
        }
        function v() {
            var C = d.display_image;
            d.display_image = s("img", "display_image");
            d.display_image.onerror = function(D) {
                _hide(d.display_image)
            };
            d.display_image.onload = m;
            d.display.replaceChild(d.display_image, C)
        }
        function l(C) {
            if ((C.type == a.api.events.JWPLAYER_PLAYER_STATE || C.type == a.api.events.JWPLAYER_PLAYLIST_ITEM) && i) {
                i = false;
                _hide(d.display_text)
            }
            if (p !== undefined) {
                clearInterval(p);
                p = null;
                a.utils.animations.rotate(d.display_icon, 0)
            }
            switch (w.jwGetState()) {
            case a.api.events.state.BUFFERING:
                g("bufferIcon");
                y = 0;
                p = setInterval(function() {
                    y += n;
                    a.utils.animations.rotate(d.display_icon, y % 360)
                },
                e);
                g("bufferIcon");
                break;
            case a.api.events.state.PAUSED:
                _css(d.display_image, {
                    background: "transparent no-repeat center center"
                });
                g("playIcon");
                break;
            case a.api.events.state.IDLE:
                if (w.jwGetPlaylist()[w.jwGetItem()].image) {
                    _css(d.display_image, {
                        display: "block"
                    });
                    d.display_image.src = a.utils.getAbsolutePath(w.jwGetPlaylist()[w.jwGetItem()].image)
                } else {
                    v()
                }
                g("playIcon");
                break;
            default:
                if (w.jwGetMute()) {
                    v();
                    g("muteIcon")
                } else {
                    v();
                    _hide(d.display_iconBackground);
                    _hide(d.display_icon)
                }
                break
            }
        }
        return this
    }
})(jwplayer); (function(a) {
    a.html5.dock = function(g, c) {
        function f() {
            return {
                align: a.html5.view.positions.RIGHT
            }
        }
        var k = a.utils.extend({},
        f(), c);
        if (k.align == "FALSE") {
            return
        }
        var h = {};
        var b = [];
        var d;
        var e;
        var j = document.createElement("div");
        j.id = g.id + "_jwplayer_dock";
        this.getDisplayElement = function() {
            return j
        };
        this.setButton = function(o, l, m, n) {
            if (!l && h[o]) {
                a.utils.arrays.remove(b, o);
                j.removeChild(h[o].div);
                delete h[o]
            } else {
                if (l) {
                    if (!h[o]) {
                        h[o] = {}
                    }
                    h[o].handler = l;
                    h[o].outGraphic = m;
                    h[o].overGraphic = n;
                    if (!h[o].div) {
                        b.push(o);
                        h[o].div = document.createElement("div");
                        h[o].div.style.position = "relative";
                        j.appendChild(h[o].div);
                        h[o].div.appendChild(document.createElement("img"));
                        h[o].div.childNodes[0].style.position = "absolute";
                        h[o].div.childNodes[0].style.left = 0;
                        h[o].div.childNodes[0].style.top = 0;
                        h[o].div.childNodes[0].style.zIndex = 10;
                        h[o].div.childNodes[0].style.cursor = "pointer";
                        h[o].div.appendChild(document.createElement("img"));
                        h[o].div.childNodes[1].style.position = "absolute";
                        h[o].div.childNodes[1].style.left = 0;
                        h[o].div.childNodes[1].style.top = 0;
                        if (g.skin.getSkinElement("dock", "button")) {
                            h[o].div.childNodes[1].src = g.skin.getSkinElement("dock", "button").src
                        }
                        h[o].div.childNodes[1].style.zIndex = 9;
                        h[o].div.childNodes[1].style.cursor = "pointer";
                        h[o].div.onmouseover = function() {
                            if (h[o].overGraphic) {
                                h[o].div.childNodes[0].src = h[o].overGraphic
                            }
                            if (g.skin.getSkinElement("dock", "buttonOver")) {
                                h[o].div.childNodes[1].src = g.skin.getSkinElement("dock", "buttonOver").src
                            }
                        };
                        h[o].div.onmouseout = function() {
                            if (h[o].outGraphic) {
                                h[o].div.childNodes[0].src = h[o].outGraphic
                            }
                            if (g.skin.getSkinElement("dock", "button")) {
                                h[o].div.childNodes[1].src = g.skin.getSkinElement("dock", "button").src
                            }
                        };
                        if (h[o].overGraphic) {
                            h[o].div.childNodes[0].src = h[o].overGraphic
                        }
                        if (h[o].outGraphic) {
                            h[o].div.childNodes[0].src = h[o].outGraphic
                        }
                        if (g.skin.getSkinElement("dock", "button")) {
                            h[o].div.childNodes[1].src = g.skin.getSkinElement("dock", "button").src
                        }
                    }
                    if (l) {
                        h[o].div.onclick = function(p) {
                            p.preventDefault();
                            a(g.id).callback(o);
                            if (h[o].overGraphic) {
                                h[o].div.childNodes[0].src = h[o].overGraphic
                            }
                            if (g.skin.getSkinElement("dock", "button")) {
                                h[o].div.childNodes[1].src = g.skin.getSkinElement("dock", "button").src
                            }
                        }
                    }
                }
            }
            i(d, e)
        };
        function i(n, l) {
            d = n;
            e = l;
            if (b.length > 0) {
                var p = 10;
                var r = n - g.skin.getSkinElement("dock", "button").width - p;
                var o = p;
                var q = -1;
                if (k.align == a.html5.view.positions.LEFT) {
                    q = 1;
                    r = p
                }
                for (var m = 0; m < b.length; m++) {
                    var s = Math.floor(o / l);
                    if ((o + g.skin.getSkinElement("dock", "button").height + p) > ((s + 1) * l)) {
                        o = ((s + 1) * l) + p;
                        s = Math.floor(o / l)
                    }
                    h[b[m]].div.style.top = (o % l) + "px";
                    h[b[m]].div.style.left = (r + (g.skin.getSkinElement("dock", "button").width + p) * s * q) + "px";
                    o += g.skin.getSkinElement("dock", "button").height + p
                }
            }
        }
        this.resize = i;
        return this
    }
})(jwplayer); (function(a) {
    a.html5.eventdispatcher = function(d, b) {
        var c = new a.events.eventdispatcher(b);
        a.utils.extend(this, c);
        this.sendEvent = function(e, f) {
            if (f === undefined) {
                f = {}
            }
            a.utils.extend(f, {
                id: d,
                version: a.version,
                type: e
            });
            c.sendEvent(e, f)
        }
    }
})(jwplayer); (function(a) {
    var b = {
        prefix: "http://l.longtailvideo.com/html5/",
        file: "logo.png",
        link: "http://www.longtailvideo.com/players/jw-flv-player/",
        margin: 8,
        out: 0.5,
        over: 1,
        timeout: 3,
        hide: true,
        position: "bottom-left"
    };
    _css = a.utils.css;
    a.html5.logo = function(l, m) {
        var r = l;
        var n;
        var i;
        var c;
        j();
        function j() {
            p();
            d();
            f()
        }
        function p() {
            if (b.prefix) {
                var t = l.version.split(/\W/).splice(0, 2).join("/");
                if (b.prefix.indexOf(t) < 0) {
                    b.prefix += t + "/"
                }
            }
            if (m.position == a.html5.view.positions.OVER) {
                m.position = b.position
            }
            i = a.utils.extend({},
            b)
        }
        function d() {
            c = document.createElement("img");
            c.id = r.id + "_jwplayer_logo";
            c.style.display = "none";
            c.onload = function(t) {
                _css(c, q());
                r.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, s);
                e()
            };
            if (!i.file) {
                return
            }
            if (i.file.indexOf("http://") === 0) {
                c.src = i.file
            } else {
                c.src = i.prefix + i.file
            }
        }
        if (!i.file) {
            return
        }
        this.resize = function(u, t) {};
        this.getDisplayElement = function() {
            return c
        };
        function f() {
            if (i.link) {
                c.onmouseover = h;
                c.onmouseout = e;
                c.onclick = o
            } else {
                this.mouseEnabled = false
            }
        }
        function o(t) {
            if (typeof t != "undefined") {
                t.stopPropagation()
            }
            r.jwPause();
            r.jwSetFullscreen(false);
            if (i.link) {
                window.open(i.link, "_blank")
            }
            return
        }
        function e(t) {
            if (i.link) {
                c.style.opacity = i.out
            }
            return
        }
        function h(t) {
            if (i.hide) {
                c.style.opacity = i.over
            }
            return
        }
        function q() {
            var v = {
                textDecoration: "none",
                position: "absolute",
                cursor: "pointer"
            };
            v.display = i.hide ? "none": "block";
            var u = i.position.toLowerCase().split("-");
            for (var t in u) {
                v[u[t]] = i.margin
            }
            return v
        }
        function k() {
            if (i.hide) {
                c.style.display = "block";
                c.style.opacity = 0;
                a.utils.fadeTo(c, i.out, 0.1, parseFloat(c.style.opacity));
                n = setTimeout(function() {
                    g()
                },
                i.timeout * 1000)
            }
        }
        function g() {
            if (i.hide) {
                a.utils.fadeTo(c, 0, 0.1, parseFloat(c.style.opacity))
            }
        }
        function s(t) {
            if (t.newstate == a.api.events.state.BUFFERING) {
                clearTimeout(n);
                k()
            }
        }
        return this
    }
})(jwplayer); (function(a) {
    var c = {
        ended: a.api.events.state.IDLE,
        playing: a.api.events.state.PLAYING,
        pause: a.api.events.state.PAUSED,
        buffering: a.api.events.state.BUFFERING
    };
    var b = a.utils.css;
    a.html5.mediavideo = function(f, D) {
        var H = {
            abort: t,
            canplay: m,
            canplaythrough: m,
            durationchange: q,
            emptied: t,
            ended: m,
            error: l,
            loadeddata: q,
            loadedmetadata: q,
            loadstart: m,
            pause: m,
            play: K,
            playing: m,
            progress: A,
            ratechange: t,
            seeked: m,
            seeking: m,
            stalled: m,
            suspend: m,
            timeupdate: K,
            volumechange: t,
            waiting: m,
            canshowcurrentframe: t,
            dataunavailable: t,
            empty: t,
            load: e,
            loadedfirstframe: t
        };
        var I = new a.html5.eventdispatcher();
        a.utils.extend(this, I);
        var h = f;
        var x = D;
        var E;
        var G;
        var d = a.api.events.state.IDLE;
        var B = null;
        var n;
        var g = 0;
        var z = false;
        var r = false;
        var M;
        var L;
        var i = [];
        var N;
        var C = false;
        function v() {
            return d
        }
        function e(O) {}
        function t(O) {}
        function m(O) {
            if (c[O.type]) {
                s(c[O.type])
            }
        }
        function s(O) {
            if (C) {
                return
            }
            if (n) {
                O = a.api.events.state.IDLE
            }
            if (O == a.api.events.state.PAUSED && d == a.api.events.state.IDLE) {
                return
            }
            if (O == a.api.events.state.PLAYING && d == a.api.events.state.IDLE) {
                s(a.api.events.state.BUFFERING);
                I.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, {
                    bufferPercent: h.buffer
                });
                y();
                return
            }
            if (d != O) {
                var P = d;
                h.state = O;
                d = O;
                var Q = false;
                if (O == a.api.events.state.IDLE) {
                    p();
                    if (h.position >= h.duration && (h.position || h.duration)) {
                        Q = true
                    }
                    if (x.style.display != "none" && !h.config.chromeless) {
                        x.style.display = "none"
                    }
                }
                I.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE, {
                    oldstate: P,
                    newstate: O
                });
                if (Q) {
                    I.sendEvent(a.api.events.JWPLAYER_MEDIA_COMPLETE)
                }
            }
            n = false
        }
        function q(O) {
            var P = {
                height: O.target.videoHeight,
                width: O.target.videoWidth,
                duration: Math.round(O.target.duration * 10) / 10
            };
            if (h.duration === 0 || isNaN(h.duration)) {
                h.duration = Math.round(O.target.duration * 10) / 10
            }
            h.playlist[h.item] = a.utils.extend(h.playlist[h.item], P);
            I.sendEvent(a.api.events.JWPLAYER_MEDIA_META, {
                metadata: P
            })
        }
        function K(P) {
            if (n) {
                return
            }
            if (P !== undefined && P.target !== undefined) {
                if (h.duration === 0 || isNaN(h.duration)) {
                    h.duration = Math.round(P.target.duration * 10) / 10
                }
                if (!z && x.readyState > 0) {
                    s(a.api.events.state.PLAYING)
                }
                if (d == a.api.events.state.PLAYING) {
                    if (!z && x.readyState > 0) {
                        z = true;
                        try {
                            x.currentTime = h.playlist[h.item].start
                        } catch(O) {}
                        x.volume = h.volume / 100;
                        x.muted = h.mute
                    }
                    h.position = Math.round(P.target.currentTime * 10) / 10;
                    I.sendEvent(a.api.events.JWPLAYER_MEDIA_TIME, {
                        position: P.target.currentTime,
                        duration: P.target.duration
                    })
                }
            }
            A(P)
        }
        function y() {
            if (E === false && d == a.api.events.state.BUFFERING) {
                I.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL);
                E = true
            }
        }
        function F() {
            var O = (i[i.length - 1] - i[0]) / i.length;
            N = setTimeout(function() {
                if (!G) {
                    A({
                        lengthComputable: true,
                        loaded: 1,
                        total: 1
                    })
                }
            },
            O * 10)
        }
        function A(Q) {
            var P,
            O;
            if (Q !== undefined && Q.lengthComputable && Q.total) {
                o();
                P = Q.loaded / Q.total * 100;
                O = P / 100 * (h.duration - x.currentTime);
                if (50 < P && !G) {
                    clearTimeout(N);
                    F()
                }
            } else {
                if ((x.buffered !== undefined) && (x.buffered.length > 0)) {
                    maxBufferIndex = 0;
                    if (maxBufferIndex >= 0) {
                        P = x.buffered.end(maxBufferIndex) / x.duration * 100;
                        O = x.buffered.end(maxBufferIndex) - x.currentTime
                    }
                }
            }
            y();
            if (!G) {
                if (P == 100 && G === false) {
                    G = true
                }
                if (P !== null && (P > h.buffer)) {
                    h.buffer = Math.round(P);
                    I.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, {
                        bufferPercent: Math.round(P)
                    })
                }
            }
        }
        function w() {
            if (B === null) {
                B = setInterval(function() {
                    K()
                },
                100)
            }
        }
        function p() {
            clearInterval(B);
            B = null
        }
        function l(Q) {
            var P = "There was an error: ";
            if ((Q.target.error && Q.target.tagName.toLowerCase() == "video") || Q.target.parentNode.error && Q.target.parentNode.tagName.toLowerCase() == "video") {
                var O = Q.target.error === undefined ? Q.target.parentNode.error: Q.target.error;
                switch (O.code) {
                case O.MEDIA_ERR_ABORTED:
                    P = "You aborted the video playback: ";
                    break;
                case O.MEDIA_ERR_NETWORK:
                    P = "A network error caused the video download to fail part-way: ";
                    break;
                case O.MEDIA_ERR_DECODE:
                    P = "The video playback was aborted due to a corruption problem or because the video used features your browser did not support: ";
                    break;
                case O.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    P = "The video could not be loaded, either because the server or network failed or because the format is not supported: ";
                    break;
                default:
                    P = "An unknown error occurred: ";
                    break
                }
            } else {
                if (Q.target.tagName.toLowerCase() == "source") {
                    L--;
                    if (L > 0) {
                        return
                    }
                    P = "The video could not be loaded, either because the server or network failed or because the format is not supported: "
                } else {
                    a.utils.log("Erroneous error received. Continuing...");
                    return
                }
            }
            u();
            P += j();
            C = true;
            I.sendEvent(a.api.events.JWPLAYER_ERROR, {
                error: P
            });
            return
        }
        function j() {
            var Q = "";
            for (var P in M.levels) {
                var O = M.levels[P];
                var R = x.ownerDocument.createElement("source");
                Q += a.utils.getAbsolutePath(O.file);
                if (P < (M.levels.length - 1)) {
                    Q += ", "
                }
            }
            return Q
        }
        this.getDisplayElement = function() {
            return x
        };
        this.play = function() {
            if (d != a.api.events.state.PLAYING) {
                if (x.style.display != "block") {
                    x.style.display = "block"
                }
                x.play();
                w();
                if (E) {
                    s(a.api.events.state.PLAYING)
                }
            }
        };
        this.pause = function() {
            x.pause();
            s(a.api.events.state.PAUSED)
        };
        this.seek = function(O) {
            if (! (h.duration === 0 || isNaN(h.duration)) && !(h.position === 0 || isNaN(h.position))) {
                x.currentTime = O;
                x.play()
            }
        };
        function u() {
            x.pause();
            p();
            h.position = 0;
            n = true;
            s(a.api.events.state.IDLE)
        }
        this.stop = u;
        this.volume = function(O) {
            x.volume = O / 100;
            h.volume = O;
            I.sendEvent(a.api.events.JWPLAYER_MEDIA_VOLUME, {
                volume: Math.round(O)
            })
        };
        this.mute = function(O) {
            x.muted = O;
            h.mute = O;
            I.sendEvent(a.api.events.JWPLAYER_MEDIA_MUTE, {
                mute: O
            })
        };
        this.resize = function(P, O) {
            if (false) {
                b(x, {
                    width: P,
                    height: O
                })
            }
            I.sendEvent(a.api.events.JWPLAYER_MEDIA_RESIZE, {
                fullscreen: h.fullscreen,
                width: P,
                hieght: O
            })
        };
        this.fullscreen = function(O) {
            if (O === true) {
                this.resize("100%", "100%")
            } else {
                this.resize(h.config.width, h.config.height)
            }
        };
        this.load = function(O) {
            J(O);
            I.sendEvent(a.api.events.JWPLAYER_MEDIA_LOADED);
            E = false;
            G = false;
            z = false;
            if (!h.config.chromeless && !r) {
                i = [];
                o();
                s(a.api.events.state.BUFFERING);
                setTimeout(function() {
                    K()
                },
                25)
            }
        };
        function o() {
            var O = new Date().getTime();
            i.push(O)
        }
        this.hasChrome = function() {
            return r
        };
        function J(V) {
            h.duration = V.duration;
            r = false;
            M = V;
            var Q = document.createElement("video");
            Q.preload = "none";
            C = false;
            L = 0;
            for (var P = 0; P < V.levels.length; P++) {
                var O = V.levels[P];
                if (a.utils.isYouTube(O.file)) {
                    delete Q;
                    k(O.file);
                    return
                }
                var R;
                if (O.type === undefined) {
                    var U = a.utils.extension(O.file);
                    if (a.utils.extensionmap[U] !== undefined && a.utils.extensionmap[U].html5 !== undefined) {
                        R = a.utils.extensionmap[U].html5
                    }
                } else {
                    R = O.type
                }
                if (!R || Q.canPlayType(R)) {
                    var T = x.ownerDocument.createElement("source");
                    T.src = a.utils.getAbsolutePath(O.file);
                    if (R && !a.utils.isLegacyAndroid()) {
                        T.type = R
                    }
                    L++;
                    Q.appendChild(T)
                }
            }
            if (L === 0) {
                C = true;
                I.sendEvent(a.api.events.JWPLAYER_ERROR, {
                    error: "The video could not be loaded because the format is not supported by your browser: " + j()
                })
            }
            if (h.config.chromeless) {
                Q.poster = a.utils.getAbsolutePath(V.image);
                Q.controls = "controls"
            }
            Q.style.top = x.style.top;
            Q.style.left = x.style.left;
            Q.style.width = x.style.width;
            Q.style.height = x.style.height;
            Q.style.zIndex = x.style.zIndex;
            Q.onload = e;
            Q.volume = 0;
            x.parentNode.replaceChild(Q, x);
            Q.id = x.id;
            x = Q;
            for (var S in H) {
                x.addEventListener(S,
                function(W) {
                    if (W.target.parentNode !== null) {
                        H[W.type](W)
                    }
                },
                true)
            }
        }
        function k(S) {
            var P = document.createElement("object");
            S = ["http://www.youtube.com/v/", S.replace(/^[^v]+v.(.{11}).*/, "$1"), "&amp;hl=en_US&amp;fs=1&autoplay=1"].join("");
            var V = {
                movie: S,
                allowFullScreen: "true",
                allowscriptaccess: "always"
            };
            for (var O in V) {
                var T = document.createElement("param");
                T.name = O;
                T.value = V[O];
                P.appendChild(T)
            }
            var U = document.createElement("embed");
            var Q = {
                src: S,
                type: "application/x-shockwave-flash",
                allowscriptaccess: "always",
                allowfullscreen: "true",
                width: document.getElementById(f.id).style.width,
                height: document.getElementById(f.id).style.height
            };
            for (var R in Q) {
                U[R] = Q[R]
            }
            P.appendChild(U);
            P.style.position = x.style.position;
            P.style.top = x.style.top;
            P.style.left = x.style.left;
            P.style.width = document.getElementById(f.id).style.width;
            P.style.height = document.getElementById(f.id).style.height;
            P.style.zIndex = 2147483000;
            x.parentNode.replaceChild(P, x);
            P.id = x.id;
            x = P;
            r = true
        }
        this.embed = J;
        return this
    }
})(jwplayer); (function(jwplayer) {
    var _configurableStateVariables = ["width", "height", "start", "duration", "volume", "mute", "fullscreen", "item", "plugins", "stretching"];
    jwplayer.html5.model = function(api, container, options) {
        var _api = api;
        var _container = container;
        var _model = {
            id: _container.id,
            playlist: [],
            state: jwplayer.api.events.state.IDLE,
            position: 0,
            buffer: 0,
            config: {
                width: 480,
                height: 320,
                item: -1,
                skin: undefined,
                file: undefined,
                image: undefined,
                start: 0,
                duration: 0,
                bufferlength: 5,
                volume: 90,
                mute: false,
                fullscreen: false,
                repeat: "none",
                stretching: jwplayer.utils.stretching.UNIFORM,
                autostart: false,
                debug: undefined,
                screencolor: undefined
            }
        };
        var _media;
        var _eventDispatcher = new jwplayer.html5.eventdispatcher();
        var _components = ["display", "logo", "controlbar", "dock"];
        jwplayer.utils.extend(_model, _eventDispatcher);
        for (var option in options) {
            if (typeof options[option] == "string") {
                var type = /color$/.test(option) ? "color": null;
                options[option] = jwplayer.utils.typechecker(options[option], type)
            }
            var config = _model.config;
            var path = option.split(".");
            for (var edge in path) {
                if (edge == path.length - 1) {
                    config[path[edge]] = options[option]
                } else {
                    if (config[path[edge]] === undefined) {
                        config[path[edge]] = {}
                    }
                    config = config[path[edge]]
                }
            }
        }
        for (var index in _configurableStateVariables) {
            var configurableStateVariable = _configurableStateVariables[index];
            _model[configurableStateVariable] = _model.config[configurableStateVariable]
        }
        var pluginorder = _components.concat([]);
        if (_model.plugins !== undefined) {
            if (typeof _model.plugins == "string") {
                var userplugins = _model.plugins.split(",");
                for (var userplugin in userplugins) {
                    if (typeof userplugins[userplugin] == "string") {
                        pluginorder.push(userplugins[userplugin].replace(/^\s+|\s+$/g, ""))
                    }
                }
            }
        }
        if (typeof _model.config.chromeless == "undefined" && jwplayer.utils.isIOS()) {
            _model.config.chromeless = true
        }
        if (_model.config.chromeless) {
            pluginorder = ["logo"]
        }
        _model.plugins = {
            order: pluginorder,
            config: {},
            object: {}
        };
        if (typeof _model.config.components != "undefined") {
            for (var component in _model.config.components) {
                _model.plugins.config[component] = _model.config.components[component]
            }
        }
        for (var pluginIndex in _model.plugins.order) {
            var pluginName = _model.plugins.order[pluginIndex];
            var pluginConfig = _model.config[pluginName] === undefined ? {}: _model.config[pluginName];
            _model.plugins.config[pluginName] = _model.plugins.config[pluginName] === undefined ? pluginConfig: jwplayer.utils.extend(_model.plugins.config[pluginName], pluginConfig);
            if (typeof _model.plugins.config[pluginName].position == "undefined") {
                _model.plugins.config[pluginName].position = jwplayer.html5.view.positions.OVER
            } else {
                _model.plugins.config[pluginName].position = _model.plugins.config[pluginName].position.toString().toUpperCase()
            }
        }
        if (typeof _model.plugins.config.dock != "undefined") {
            if (typeof _model.plugins.config.dock != "object") {
                var position = _model.plugins.config.dock.toString().toUpperCase();
                _model.plugins.config.dock = {
                    position: position
                }
            }
            if (typeof _model.plugins.config.dock.position != "undefined") {
                _model.plugins.config.dock.align = _model.plugins.config.dock.position;
                _model.plugins.config.dock.position = jwplayer.html5.view.positions.OVER
            }
        }
        _model.loadPlaylist = function(arg, ready) {
            var input;
            if (typeof arg == "string") {
                try {
                    input = eval(arg)
                } catch(err) {
                    input = arg
                }
            } else {
                input = arg
            }
            var config;
            switch (jwplayer.utils.typeOf(input)) {
            case "object":
                config = input;
                break;
            case "array":
                config = {
                    playlist: input
                };
                break;
            default:
                config = {
                    file: input
                };
                break
            }
            _model.playlist = new jwplayer.html5.playlist(config);
            if (_model.config.shuffle) {
                _model.item = _getShuffleItem()
            } else {
                if (_model.config.item >= _model.playlist.length) {
                    _model.config.item = _model.playlist.length - 1
                } else {
                    if (_model.config.item < 0) {
                        _model.config.item = 0
                    }
                }
                _model.item = _model.config.item
            }
            if (!ready) {
                _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED, {
                    playlist: _model.playlist
                })
            }
            _model.setActiveMediaProvider(_model.playlist[_model.item])
        };
        function _getShuffleItem() {
            var result = null;
            if (_model.playlist.length > 1) {
                while (result === null) {
                    result = Math.floor(Math.random() * _model.playlist.length);
                    if (result == _model.item) {
                        result = null
                    }
                }
            } else {
                result = 0
            }
            return result
        }
        function forward(evt) {
            if (evt.type == jwplayer.api.events.JWPLAYER_MEDIA_LOADED) {
                _container = _media.getDisplayElement()
            }
            _eventDispatcher.sendEvent(evt.type, evt)
        }
        _model.setActiveMediaProvider = function(playlistItem) {
            if (_media !== undefined) {
                _media.resetEventListeners()
            }
            _media = new jwplayer.html5.mediavideo(_model, _container);
            _media.addGlobalListener(forward);
            if (_model.config.chromeless) {
                _media.load(playlistItem)
            }
            return true
        };
        _model.getMedia = function() {
            return _media
        };
        _model.setupPlugins = function() {
            for (var plugin in _model.plugins.order) {
                try {
                    var pluginName = _model.plugins.order[plugin];
                    if (jwplayer.html5[pluginName] !== undefined) {
                        _model.plugins.object[pluginName] = new jwplayer.html5[pluginName](_api, _model.plugins.config[pluginName])
                    } else {
                        _model.plugins.order.splice(plugin, plugin + 1)
                    }
                } catch(err) {
                    jwplayer.utils.log("Could not setup " + pluginName)
                }
            }
        };
        return _model
    }
})(jwplayer); (function(a) {
    a.html5.playlist = function(b) {
        var d = [];
        if (b.playlist && b.playlist instanceof Array && b.playlist.length > 0) {
            for (var c in b.playlist) {
                if (!isNaN(parseInt(c))) {
                    d.push(new a.html5.playlistitem(b.playlist[c]))
                }
            }
        } else {
            d.push(new a.html5.playlistitem(b))
        }
        return d
    }
})(jwplayer); (function(a) {
    a.html5.playlistitem = function(c) {
        var b = {
            author: "",
            date: "",
            description: "",
            image: "",
            link: "",
            mediaid: "",
            tags: "",
            title: "",
            provider: "",
            file: "",
            streamer: "",
            duration: -1,
            start: 0,
            currentLevel: -1,
            levels: []
        };
        for (var d in b) {
            if (c[d] !== undefined) {
                b[d] = c[d]
            }
        }
        if (b.levels.length === 0) {
            b.levels[0] = new a.html5.playlistitemlevel(b)
        }
        return b
    }
})(jwplayer); (function(a) {
    a.html5.playlistitemlevel = function(b) {
        var d = {
            file: "",
            streamer: "",
            bitrate: 0,
            width: 0
        };
        for (var c in d) {
            if (b[c] !== undefined) {
                d[c] = b[c]
            }
        }
        return d
    }
})(jwplayer); (function(a) {
    a.html5.skin = function() {
        var b = {};
        var c = false;
        this.load = function(d, e) {
            new a.html5.skinloader(d,
            function(f) {
                c = true;
                b = f;
                e()
            },
            function() {
                new a.html5.skinloader("",
                function(f) {
                    c = true;
                    b = f;
                    e()
                })
            })
        };
        this.getSkinElement = function(d, e) {
            if (c) {
                try {
                    return b[d].elements[e]
                } catch(f) {
                    a.utils.log("No such skin component / element: ", [d, e])
                }
            }
            return null
        };
        this.getComponentSettings = function(d) {
            if (c) {
                return b[d].settings
            }
            return null
        };
        this.getComponentLayout = function(d) {
            if (c) {
                return b[d].layout
            }
            return null
        }
    }
})(jwplayer); (function(a) {
    a.html5.skinloader = function(f, n, i) {
        var m = {};
        var c = n;
        var j = i;
        var e = true;
        var h;
        var l = f;
        var q = false;
        function k() {
            if (typeof l != "string" || l === "") {
                d(a.html5.defaultSkin().xml)
            } else {
                a.utils.ajax(a.utils.getAbsolutePath(l),
                function(r) {
                    try {
                        if (r.responseXML !== null) {
                            d(r.responseXML);
                            return
                        }
                    } catch(s) {}
                    d(a.html5.defaultSkin().xml)
                },
                function(r) {
                    d(a.html5.defaultSkin().xml)
                })
            }
        }
        function d(w) {
            var C = w.getElementsByTagName("component");
            if (C.length === 0) {
                return
            }
            for (var F = 0; F < C.length; F++) {
                var A = C[F].getAttribute("name");
                var z = {
                    settings: {},
                    elements: {},
                    layout: {}
                };
                m[A] = z;
                var E = C[F].getElementsByTagName("elements")[0].getElementsByTagName("element");
                for (var D = 0; D < E.length; D++) {
                    b(E[D], A)
                }
                var x = C[F].getElementsByTagName("settings")[0];
                if (x !== undefined && x.childNodes.length > 0) {
                    var I = x.getElementsByTagName("setting");
                    for (var N = 0; N < I.length; N++) {
                        var O = I[N].getAttribute("name");
                        var G = I[N].getAttribute("value");
                        var v = /color$/.test(O) ? "color": null;
                        m[A].settings[O] = a.utils.typechecker(G, v)
                    }
                }
                var J = C[F].getElementsByTagName("layout")[0];
                if (J !== undefined && J.childNodes.length > 0) {
                    var K = J.getElementsByTagName("group");
                    for (var u = 0; u < K.length; u++) {
                        var y = K[u];
                        m[A].layout[y.getAttribute("position")] = {
                            elements: []
                        };
                        for (var M = 0; M < y.attributes.length; M++) {
                            var B = y.attributes[M];
                            m[A].layout[y.getAttribute("position")][B.name] = B.value
                        }
                        var L = y.getElementsByTagName("*");
                        for (var t = 0; t < L.length; t++) {
                            var r = L[t];
                            m[A].layout[y.getAttribute("position")].elements.push({
                                type: r.tagName
                            });
                            for (var s = 0; s < r.attributes.length; s++) {
                                var H = r.attributes[s];
                                m[A].layout[y.getAttribute("position")].elements[t][H.name] = H.value
                            }
                            if (m[A].layout[y.getAttribute("position")].elements[t].name === undefined) {
                                m[A].layout[y.getAttribute("position")].elements[t].name = r.tagName
                            }
                        }
                    }
                }
                e = false;
                p()
            }
        }
        function p() {
            clearInterval(h);
            if (!q) {
                h = setInterval(function() {
                    o()
                },
                100)
            }
        }
        function b(w, v) {
            var u = new Image();
            var r = w.getAttribute("name");
            var t = w.getAttribute("src");
            var y;
            if (t.indexOf("data:image/png;base64,") === 0) {
                y = t
            } else {
                var s = a.utils.getAbsolutePath(l);
                var x = s.substr(0, s.lastIndexOf("/"));
                y = [x, v, t].join("/")
            }
            m[v].elements[r] = {
                height: 0,
                width: 0,
                src: "",
                ready: false
            };
            u.onload = function(z) {
                g(u, r, v)
            };
            u.onerror = function(z) {
                q = true;
                p();
                j()
            };
            u.src = y
        }
        function o() {
            for (var r in m) {
                if (r != "properties") {
                    for (var s in m[r].elements) {
                        if (!m[r].elements[s].ready) {
                            return
                        }
                    }
                }
            }
            if (e === false) {
                clearInterval(h);
                c(m)
            }
        }
        function g(r, t, s) {
            m[s].elements[t].height = r.height;
            m[s].elements[t].width = r.width;
            m[s].elements[t].src = r.src;
            m[s].elements[t].ready = true;
            p()
        }
        k()
    }
})(jwplayer); (function(a) {
    a.html5.api = function(b, k) {
        var j = {};
        var e = document.createElement("div");
        b.parentNode.replaceChild(e, b);
        e.id = b.id;
        j.version = a.version;
        j.id = e.id;
        var i = new a.html5.model(j, e, k);
        var g = new a.html5.view(j, e, i);
        var h = new a.html5.controller(j, e, i, g);
        j.skin = new a.html5.skin();
        j.jwPlay = function(l) {
            if (typeof l == "undefined") {
                d()
            } else {
                if (l.toString().toLowerCase() == "true") {
                    h.play()
                } else {
                    h.pause()
                }
            }
        };
        j.jwPause = function(l) {
            if (typeof l == "undefined") {
                d()
            } else {
                if (l.toString().toLowerCase() == "true") {
                    h.pause()
                } else {
                    h.play()
                }
            }
        };
        function d() {
            if (i.state == a.api.events.state.PLAYING || i.state == a.api.events.state.BUFFERING) {
                h.pause()
            } else {
                h.play()
            }
        }
        j.jwStop = h.stop;
        j.jwSeek = h.seek;
        j.jwPlaylistItem = h.item;
        j.jwPlaylistNext = h.next;
        j.jwPlaylistPrev = h.prev;
        j.jwResize = h.resize;
        j.jwLoad = h.load;
        function f(l) {
            return function() {
                return i[l]
            }
        }
        j.jwGetItem = f("item");
        j.jwGetPosition = f("position");
        j.jwGetDuration = f("duration");
        j.jwGetBuffer = f("buffer");
        j.jwGetWidth = f("width");
        j.jwGetHeight = f("height");
        j.jwGetFullscreen = f("fullscreen");
        j.jwSetFullscreen = h.setFullscreen;
        j.jwGetVolume = f("volume");
        j.jwSetVolume = h.setVolume;
        j.jwGetMute = f("mute");
        j.jwSetMute = h.setMute;
        j.jwGetStretching = f("stretching");
        j.jwGetState = f("state");
        j.jwGetVersion = function() {
            return j.version
        };
        j.jwGetPlaylist = function() {
            return i.playlist
        };
        j.jwAddEventListener = h.addEventListener;
        j.jwRemoveEventListener = h.removeEventListener;
        j.jwSendEvent = h.sendEvent;
        j.jwDockSetButton = function(o, l, m, n) {
            if (i.plugins.object.dock && i.plugins.object.dock.setButton) {
                i.plugins.object.dock.setButton(o, l, m, n)
            }
        };
        j.jwGetLevel = function() {};
        j.jwGetBandwidth = function() {};
        j.jwGetLockState = function() {};
        j.jwLock = function() {};
        j.jwUnlock = function() {};
        function c(n, m, l) {
            return function() {
                n.loadPlaylist(n.config, true);
                n.setupPlugins();
                m.setup(n.getMedia().getDisplayElement());
                var o = {
                    id: j.id,
                    version: j.version
                };
                l.sendEvent(a.api.events.JWPLAYER_READY, o);
                if (playerReady !== undefined) {
                    playerReady(o)
                }
                if (window[n.config.playerReady] !== undefined) {
                    window[n.config.playerReady](o)
                }
                n.sendEvent(a.api.events.JWPLAYER_PLAYLIST_LOADED, {
                    playlist: n.playlist
                });
                l.item(n.item)
            }
        }
        if (i.config.chromeless) {
            setTimeout(c(i, g, h), 25)
        } else {
            j.skin.load(i.config.skin, c(i, g, h))
        }
        return j
    }
})(jwplayer);