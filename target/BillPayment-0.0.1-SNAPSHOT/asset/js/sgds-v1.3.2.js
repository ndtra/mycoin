!function(e) {
    var t = {};
    function i(s) {
        if (t[s])
            return t[s].exports;
        var n = t[s] = {
            i: s,
            l: !1,
            exports: {}
        };
        return e[s].call(n.exports, n, n.exports, i),
        n.l = !0,
        n.exports
    }
    i.m = e,
    i.c = t,
    i.d = function(e, t, s) {
        i.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: s
        })
    }
    ,
    i.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    i.t = function(e, t) {
        if (1 & t && (e = i(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var s = Object.create(null);
        if (i.r(s),
        Object.defineProperty(s, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var n in e)
                i.d(s, n, function(t) {
                    return e[t]
                }
                .bind(null, n));
        return s
    }
    ,
    i.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return i.d(t, "a", t),
        t
    }
    ,
    i.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    i.p = "",
    i(i.s = 37)
}({
    14: function(e, t, i) {},
    15: function(e, t, i) {
        e.exports = i.p + "fonts/sgds-icons.svg"
    },
    16: function(e, t, i) {
        e.exports = i.p + "fonts/sgds-icons.ttf"
    },
    17: function(e, t, i) {
        e.exports = i.p + "fonts/sgds-icons.woff"
    },
    37: function(e, t, i) {
        "use strict";
        function s(e, t) {
            for (var i = 0; i < t.length; i++) {
                var s = t[i];
                s.enumerable = s.enumerable || !1,
                s.configurable = !0,
                "value"in s && (s.writable = !0),
                Object.defineProperty(e, s.key, s)
            }
        }
        i.r(t);
        /**
 * Sticky Sidebar JavaScript Plugin.
 * @version 3.3.1
 * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
 * @license The MIT License (MIT)
 */
        var n, o, a = (n = ".stickySidebar",
        o = {
            topSpacing: 0,
            bottomSpacing: 0,
            containerSelector: !1,
            innerWrapperSelector: ".inner-wrapper-sticky",
            stickyClass: "is-affixed",
            resizeSensor: !0,
            minWidth: !1
        },
        function() {
            function e(t) {
                var i = this
                  , s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.options = e.extend(o, s),
                this.sidebar = "string" == typeof t ? document.querySelector(t) : t,
                void 0 === this.sidebar)
                    throw new Error("There is no specific sidebar element.");
                this.sidebarInner = !1,
                this.container = this.sidebar.parentElement,
                this.affixedType = "STATIC",
                this.direction = "down",
                this.support = {
                    transform: !1,
                    transform3d: !1
                },
                this._initialized = !1,
                this._reStyle = !1,
                this._breakpoint = !1,
                this._resizeListeners = [],
                this.dimensions = {
                    translateY: 0,
                    topSpacing: 0,
                    lastTopSpacing: 0,
                    bottomSpacing: 0,
                    lastBottomSpacing: 0,
                    sidebarHeight: 0,
                    sidebarWidth: 0,
                    containerTop: 0,
                    containerHeight: 0,
                    viewportHeight: 0,
                    viewportTop: 0,
                    lastViewportTop: 0
                },
                ["handleEvent"].forEach(function(e) {
                    i[e] = i[e].bind(i)
                }),
                this.initialize()
            }
            var t, i, a;
            return t = e,
            a = [{
                key: "supportTransform",
                value: function(e) {
                    var t = !1
                      , i = e ? "perspective" : "transform"
                      , s = i.charAt(0).toUpperCase() + i.slice(1)
                      , n = document.createElement("support").style;
                    return (i + " " + ["Webkit", "Moz", "O", "ms"].join(s + " ") + s).split(" ").forEach(function(e, i) {
                        if (void 0 !== n[e])
                            return t = e,
                            !1
                    }),
                    t
                }
            }, {
                key: "eventTrigger",
                value: function(e, t, i) {
                    try {
                        var s = new CustomEvent(t,{
                            detail: i
                        })
                    } catch (e) {
                        (s = document.createEvent("CustomEvent")).initCustomEvent(t, !0, !0, i)
                    }
                    e.dispatchEvent(s)
                }
            }, {
                key: "extend",
                value: function(e, t) {
                    var i = {};
                    for (var s in e)
                        void 0 !== t[s] ? i[s] = t[s] : i[s] = e[s];
                    return i
                }
            }, {
                key: "offsetRelative",
                value: function(e) {
                    var t = {
                        left: 0,
                        top: 0
                    };
                    do {
                        var i = e.offsetTop
                          , s = e.offsetLeft;
                        isNaN(i) || (t.top += i),
                        isNaN(s) || (t.left += s),
                        e = "BODY" === e.tagName ? e.parentElement : e.offsetParent
                    } while (e);return t
                }
            }, {
                key: "addClass",
                value: function(t, i) {
                    e.hasClass(t, i) || (t.classList ? t.classList.add(i) : t.className += " " + i)
                }
            }, {
                key: "removeClass",
                value: function(t, i) {
                    e.hasClass(t, i) && (t.classList ? t.classList.remove(i) : t.className = t.className.replace(new RegExp("(^|\\b)" + i.split(" ").join("|") + "(\\b|$)","gi"), " "))
                }
            }, {
                key: "hasClass",
                value: function(e, t) {
                    return e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)","gi").test(e.className)
                }
            }],
            (i = [{
                key: "initialize",
                value: function() {
                    var e = this;
                    if (this._setSupportFeatures(),
                    this.options.innerWrapperSelector && (this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector),
                    null === this.sidebarInner && (this.sidebarInner = !1)),
                    !this.sidebarInner) {
                        var t = document.createElement("div");
                        for (t.setAttribute("class", "inner-wrapper-sticky"),
                        this.sidebar.appendChild(t); this.sidebar.firstChild != t; )
                            t.appendChild(this.sidebar.firstChild);
                        this.sidebarInner = this.sidebar.querySelector(".inner-wrapper-sticky")
                    }
                    if (this.options.containerSelector) {
                        var i = document.querySelectorAll(this.options.containerSelector);
                        if ((i = Array.prototype.slice.call(i)).forEach(function(t, i) {
                            t.contains(e.sidebar) && (e.container = t)
                        }),
                        !i.length)
                            throw new Error("The container does not contains on the sidebar.")
                    }
                    "function" != typeof this.options.topSpacing && (this.options.topSpacing = parseInt(this.options.topSpacing) || 0),
                    "function" != typeof this.options.bottomSpacing && (this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0),
                    this._widthBreakpoint(),
                    this.calcDimensions(),
                    this.stickyPosition(),
                    this.bindEvents(),
                    this._initialized = !0
                }
            }, {
                key: "bindEvents",
                value: function() {
                    window.addEventListener("resize", this, {
                        passive: !0,
                        capture: !1
                    }),
                    window.addEventListener("scroll", this, {
                        passive: !0,
                        capture: !1
                    }),
                    this.sidebar.addEventListener("update" + n, this),
                    this.options.resizeSensor && "undefined" != typeof ResizeSensor && (new ResizeSensor(this.sidebarInner,this.handleEvent),
                    new ResizeSensor(this.container,this.handleEvent))
                }
            }, {
                key: "handleEvent",
                value: function(e) {
                    this.updateSticky(e)
                }
            }, {
                key: "calcDimensions",
                value: function() {
                    if (!this._breakpoint) {
                        var t = this.dimensions;
                        t.containerTop = e.offsetRelative(this.container).top,
                        t.containerHeight = this.container.clientHeight,
                        t.containerBottom = t.containerTop + t.containerHeight,
                        t.sidebarHeight = this.sidebarInner.offsetHeight,
                        t.sidebarWidth = this.sidebar.offsetWidth,
                        t.viewportHeight = window.innerHeight,
                        this._calcDimensionsWithScroll()
                    }
                }
            }, {
                key: "_calcDimensionsWithScroll",
                value: function() {
                    var t = this.dimensions;
                    t.sidebarLeft = e.offsetRelative(this.sidebar).left,
                    t.viewportTop = document.documentElement.scrollTop || document.body.scrollTop,
                    t.viewportBottom = t.viewportTop + t.viewportHeight,
                    t.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                    t.topSpacing = this.options.topSpacing,
                    t.bottomSpacing = this.options.bottomSpacing,
                    "function" == typeof t.topSpacing && (t.topSpacing = parseInt(t.topSpacing(this.sidebar)) || 0),
                    "function" == typeof t.bottomSpacing && (t.bottomSpacing = parseInt(t.bottomSpacing(this.sidebar)) || 0),
                    "VIEWPORT-TOP" === this.affixedType ? t.topSpacing < t.lastTopSpacing && (t.translateY += t.lastTopSpacing - t.topSpacing,
                    this._reStyle = !0) : "VIEWPORT-BOTTOM" === this.affixedType && t.bottomSpacing < t.lastBottomSpacing && (t.translateY += t.lastBottomSpacing - t.bottomSpacing,
                    this._reStyle = !0),
                    t.lastTopSpacing = t.topSpacing,
                    t.lastBottomSpacing = t.bottomSpacing
                }
            }, {
                key: "isSidebarFitsViewport",
                value: function() {
                    return this.dimensions.sidebarHeight < this.dimensions.viewportHeight
                }
            }, {
                key: "observeScrollDir",
                value: function() {
                    var e = this.dimensions;
                    if (e.lastViewportTop !== e.viewportTop) {
                        var t = "down" === this.direction ? Math.min : Math.max;
                        e.viewportTop === t(e.viewportTop, e.lastViewportTop) && (this.direction = "down" === this.direction ? "up" : "down")
                    }
                }
            }, {
                key: "getAffixType",
                value: function() {
                    var e = this.dimensions
                      , t = !1;
                    this._calcDimensionsWithScroll();
                    var i = e.sidebarHeight + e.containerTop
                      , s = e.viewportTop + e.topSpacing
                      , n = e.viewportBottom - e.bottomSpacing;
                    return "up" === this.direction ? s <= e.containerTop ? (e.translateY = 0,
                    t = "STATIC") : s <= e.translateY + e.containerTop ? (e.translateY = s - e.containerTop,
                    t = "VIEWPORT-TOP") : !this.isSidebarFitsViewport() && e.containerTop <= s && (t = "VIEWPORT-UNBOTTOM") : this.isSidebarFitsViewport() ? e.sidebarHeight + s >= e.containerBottom ? (e.translateY = e.containerBottom - i,
                    t = "CONTAINER-BOTTOM") : s >= e.containerTop && (e.translateY = s - e.containerTop,
                    t = "VIEWPORT-TOP") : e.containerBottom <= n ? (e.translateY = e.containerBottom - i,
                    t = "CONTAINER-BOTTOM") : i + e.translateY <= n ? (e.translateY = n - i,
                    t = "VIEWPORT-BOTTOM") : e.containerTop + e.translateY <= s && (t = "VIEWPORT-UNBOTTOM"),
                    e.translateY = Math.max(0, e.translateY),
                    e.translateY = Math.min(e.containerHeight, e.translateY),
                    e.lastViewportTop = e.viewportTop,
                    t
                }
            }, {
                key: "_getStyle",
                value: function(t) {
                    if (void 0 !== t) {
                        var i = {
                            inner: {},
                            outer: {}
                        }
                          , s = this.dimensions;
                        switch (t) {
                        case "VIEWPORT-TOP":
                            i.inner = {
                                position: "fixed",
                                top: s.topSpacing,
                                left: s.sidebarLeft - s.viewportLeft,
                                width: s.sidebarWidth
                            };
                            break;
                        case "VIEWPORT-BOTTOM":
                            i.inner = {
                                position: "fixed",
                                top: "auto",
                                left: s.sidebarLeft,
                                bottom: s.bottomSpacing,
                                width: s.sidebarWidth
                            };
                            break;
                        case "CONTAINER-BOTTOM":
                        case "VIEWPORT-UNBOTTOM":
                            var n = this._getTranslate(0, s.translateY + "px");
                            i.inner = n ? {
                                transform: n
                            } : {
                                position: "absolute",
                                top: s.translateY,
                                width: s.sidebarWidth
                            }
                        }
                        switch (t) {
                        case "VIEWPORT-TOP":
                        case "VIEWPORT-BOTTOM":
                        case "VIEWPORT-UNBOTTOM":
                        case "CONTAINER-BOTTOM":
                            i.outer = {
                                height: s.sidebarHeight,
                                position: "relative"
                            }
                        }
                        return i.outer = e.extend({
                            height: "",
                            position: ""
                        }, i.outer),
                        i.inner = e.extend({
                            position: "relative",
                            top: "",
                            left: "",
                            bottom: "",
                            width: "",
                            transform: this._getTranslate()
                        }, i.inner),
                        i
                    }
                }
            }, {
                key: "stickyPosition",
                value: function(t) {
                    if (!this._breakpoint) {
                        t = this._reStyle || t || !1,
                        this.options.topSpacing,
                        this.options.bottomSpacing;
                        var i = this.getAffixType()
                          , s = this._getStyle(i);
                        if ((this.affixedType != i || t) && i) {
                            var o = "affix." + i.toLowerCase().replace("viewport-", "") + n;
                            for (var a in e.eventTrigger(this.sidebar, o),
                            "STATIC" === i ? e.removeClass(this.sidebar, this.options.stickyClass) : e.addClass(this.sidebar, this.options.stickyClass),
                            s.outer)
                                s.outer[a],
                                this.sidebar.style[a] = s.outer[a];
                            for (var r in s.inner) {
                                var c = "number" == typeof s.inner[r] ? "px" : "";
                                this.sidebarInner.style[r] = s.inner[r] + c
                            }
                            var d = "affixed." + i.toLowerCase().replace("viewport-", "") + n;
                            e.eventTrigger(this.sidebar, d)
                        } else
                            this._initialized && (this.sidebarInner.style.left = s.inner.left);
                        this.affixedType = i
                    }
                }
            }, {
                key: "_widthBreakpoint",
                value: function() {
                    window.innerWidth <= this.options.minWidth ? (this._breakpoint = !0,
                    this.affixedType = "STATIC",
                    this.sidebar.removeAttribute("style"),
                    e.removeClass(this.sidebar, this.options.stickyClass),
                    this.sidebarInner.removeAttribute("style")) : this._breakpoint = !1
                }
            }, {
                key: "updateSticky",
                value: function() {
                    var e, t = this, i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    this._running || (this._running = !0,
                    e = i.type,
                    requestAnimationFrame(function() {
                        switch (e) {
                        case "scroll":
                            t._calcDimensionsWithScroll(),
                            t.observeScrollDir(),
                            t.stickyPosition();
                            break;
                        case "resize":
                        default:
                            t._widthBreakpoint(),
                            t.calcDimensions(),
                            t.stickyPosition(!0)
                        }
                        t._running = !1
                    }))
                }
            }, {
                key: "_setSupportFeatures",
                value: function() {
                    var t = this.support;
                    t.transform = e.supportTransform(),
                    t.transform3d = e.supportTransform(!0)
                }
            }, {
                key: "_getTranslate",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
                      , i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                    return this.support.transform3d ? "translate3d(" + e + ", " + t + ", " + i + ")" : !!this.support.translate && "translate(" + e + ", " + t + ")"
                }
            }, {
                key: "destroy",
                value: function() {
                    window.removeEventListener("resize", this, {
                        caption: !1
                    }),
                    window.removeEventListener("scroll", this, {
                        caption: !1
                    }),
                    this.sidebar.classList.remove(this.options.stickyClass),
                    this.sidebar.style.minHeight = "",
                    this.sidebar.removeEventListener("update" + n, this);
                    var e = {
                        inner: {},
                        outer: {}
                    };
                    for (var t in e.inner = {
                        position: "",
                        top: "",
                        left: "",
                        bottom: "",
                        width: "",
                        transform: ""
                    },
                    e.outer = {
                        height: "",
                        position: ""
                    },
                    e.outer)
                        this.sidebar.style[t] = e.outer[t];
                    for (var i in e.inner)
                        this.sidebarInner.style[i] = e.inner[i];
                    this.options.resizeSensor && "undefined" != typeof ResizeSensor && (ResizeSensor.detach(this.sidebarInner, this.handleEvent),
                    ResizeSensor.detach(this.container, this.handleEvent))
                }
            }]) && s(t.prototype, i),
            a && s(t, a),
            e
        }()), r = a;
        window.StickySidebar = a;
        var c = window.jQuery;
        if (!c)
            throw new Error("SGDS couldn't initialize; please make sure jQuery is loaded!");
        i(14),
        i(15),
        i(16),
        i(17);
        c(document).ready(function() {
            for (var e = c(".search-toggle"), t = function(t) {
                var i = e[t]
                  , s = i.dataset.target
                  , n = c("#".concat(s))
                  , o = c(i).children("span")
                  , a = c(n).find("input");
                c(i).click(function() {
                    o.toggleClass("sgds-icon-search").toggleClass("sgds-icon-cross"),
                    n.toggleClass("hide"),
                    a.focus().val("")
                })
            }, i = 0; i < e.length; i++)
                t(i);
            var s = c(".sgds-accordion").not(".sgds-accordion-set > .sgds-accordion");
            if (s) {
                var n = function(e) {
                    var t = s[e]
                      , i = c(t).children(".sgds-accordion-header")
                      , n = c(t).children(".sgds-accordion-body");
                    c(i).click(function(e) {
                        var t = c(e.target);
                        c(t).hasClass("is-active") ? (c(t).removeClass("is-active").attr("aria-expanded", !1).children("i").removeClass("sgds-icon-chevron-up").addClass("sgds-icon-chevron-down"),
                        c(n).slideUp(300)) : (c(t).addClass("is-active").attr("aria-expanded", !0).children("i").removeClass("sgds-icon-chevron-down").addClass("sgds-icon-chevron-up"),
                        c(n).slideDown(300))
                    })
                };
                for (i = 0; i < s.length; i++)
                    n(i)
            }
            if (c(".sgds-accordion-set > .sgds-accordion").length) {
                var o = c(".sgds-accordion-set .sgds-accordion-header")
                  , a = function(e) {
                    var t = o.eq(e);
                    t.click(function() {
                        if (t.hasClass("is-active"))
                            t.removeClass("is-active").attr("aria-expanded", !1),
                            t.siblings(".sgds-accordion-body").slideUp(300),
                            t.children("i").removeClass("sgds-icon-chevron-up").addClass("sgds-icon-chevron-down");
                        else {
                            var e = t.parent().siblings(".sgds-accordion").children(".sgds-accordion-header");
                            e && (e.children("i").removeClass("sgds-icon-chevron-up").addClass("sgds-icon-chevron-down"),
                            e.removeClass("is-active"),
                            e.siblings(".sgds-accordion-body").slideUp(300).removeClass("is-open")),
                            t.addClass("is-active").attr("aria-expanded", !0),
                            t.children("i").removeClass("sgds-icon-chevron-down").addClass("sgds-icon-chevron-up"),
                            t.siblings(".sgds-accordion-body").slideDown(300).addClass("is-open")
                        }
                    })
                };
                for (i = 0; i < o.length; i++)
                    a(i)
            }
            var d = c(".sgds-tabs");
            if (d && d.length > 0)
                for (i = 0; i < d.length; i++) {
                    d.eq(i).find("a[data-tab]").each(function(e, t) {
                        var i = c(t)
                          , s = i.parent()
                          , n = document.querySelector(t.dataset.tab);
                        s.hasClass("is-active") || c(n).hide(),
                        i.click(function() {
                            if (!s.hasClass("is-active")) {
                                s.addClass("is-active"),
                                c(n).show();
                                var e = s.siblings();
                                e.length > 0 && e.each(function(e, t) {
                                    var i = c(t);
                                    i.removeClass("is-active");
                                    var s = i.find("a[data-tab]");
                                    c(s.attr("data-tab")).hide()
                                })
                            }
                        })
                    })
                }
            var l = c(".navbar-burger");
            l.length > 0 && l.each(function(e, t) {
                c(t).click(function() {
                    var e = t.dataset.target
                      , i = document.getElementById(e);
                    t.classList.toggle("is-active"),
                    i.classList.toggle("is-active")
                })
            });
            var p = c(".sgds-dropdown:not(.is-hoverable)");
            p.length > 0 && (p.each(function(e, t) {
                var i = t.querySelector(".sgds-dropdown-trigger");
                i.addEventListener("click", function(e) {
                    e.stopPropagation(),
                    t.classList.toggle("is-active");
                    var s = i.querySelector(".sgds-icon");
                    t.classList.contains("is-active") ? (s.classList.remove("sgds-icon-chevron-down"),
                    s.classList.add("sgds-icon-chevron-up")) : (s.classList.remove("sgds-icon-chevron-up"),
                    s.classList.add("sgds-icon-chevron-down"))
                })
            }),
            document.addEventListener("click", function(e) {
                p.each(function(t, i) {
                    i.contains(e.target) || i.classList.remove("is-active");
                    var s = i.querySelector(".sgds-button .sgds-icon");
                    s && (s.classList.remove("sgds-icon-chevron-up"),
                    s.classList.add("sgds-icon-chevron-down"))
                })
            }),
            document.addEventListener("keydown", function(e) {
                27 === (e || window.event).keyCode && p.each(function(e, t) {
                    t.classList.remove("is-active");
                    var i = t.querySelector(".sgds-button .sgds-icon");
                    i && (i.classList.remove("sgds-icon-chevron-up"),
                    i.classList.add("sgds-icon-chevron-down"))
                })
            }));
            var h = document.querySelector(".sidenav-container");
            if (h) {
                var v = h.querySelector(".sidenav");
                if (v)
                    v.querySelector(".sidebar__inner.sgds-menu") && new r(".sidenav",{
                        containerSelector: ".sidenav-container",
                        innerWrapperSelector: ".sidebar__inner",
                        topSpacing: parseInt(v.dataset.topspacing),
                        bottomSpacing: parseInt(v.dataset.bottomspacing)
                    })
            }
            document.querySelector("li.second-level-nav") && function() {
                for (var e = document.querySelectorAll("li.second-level-nav"), t = function(t) {
                    var i = e[t]
                      , s = i.nextElementSibling;
                    s && s.classList.contains("second-level-nav-div") && i.addEventListener("click", function(e) {
                        var t = i.querySelector("i");
                        s.classList.contains("is-hidden") ? (s.classList.remove("is-hidden"),
                        t && (t.classList.remove("sgds-icon-chevron-down"),
                        t.classList.add("sgds-icon-chevron-up"))) : (s.classList.add("is-hidden"),
                        t && (t.classList.remove("sgds-icon-chevron-up"),
                        t.classList.add("sgds-icon-chevron-down")))
                    })
                }, i = 0; i < e.length; i++)
                    t(i);
                for (var s = document.querySelectorAll("a.second-level-nav-header-mobile"), n = 0; n < s.length; n++)
                    s[n].addEventListener("click", function() {
                        var e = n;
                        return function() {
                            var t = s[e].getElementsByTagName("I")[0]
                              , i = document.getElementsByClassName("second-level-nav-div-mobile")[e];
                            i.classList.contains("is-hidden") ? (t.classList.remove("sgds-icon-chevron-down"),
                            t.classList.add("sgds-icon-chevron-up"),
                            i.classList.remove("is-hidden")) : (i.classList.add("is-hidden"),
                            t.classList.remove("sgds-icon-chevron-up"),
                            t.classList.add("sgds-icon-chevron-down"))
                        }
                    }())
            }();
            var u = c(".language_selector");
            u.length && u.each(function(e, t) {
                var i = c("#" + t.dataset.target);
                c(t).click(function() {
                    i.toggle()
                }),
                document.addEventListener("click", function(e) {
                    t.contains(e.target) || i.hide()
                })
            })
        })
    }
});
//# sourceMappingURL=sgds.js.map
