! function (t, i) {
  "use strict";
  var s, e = i.event;
  e.special.smartresize = {
    setup: function () {
      i(this).bind("resize", e.special.smartresize.handler)
    },
    teardown: function () {
      i(this).unbind("resize", e.special.smartresize.handler)
    },
    handler: function (t, i) {
      var n = this,
        o = arguments;
      t.type = "smartresize", s && clearTimeout(s), s = setTimeout(function () {
        e.dispatch.apply(n, o)
      }, "execAsap" === i ? 0 : 100)
    }
  }, i.fn.smartresize = function (t) {
    return t ? this.bind("smartresize", t) : this.trigger("smartresize", ["execAsap"])
  }, i.Mason = function (t, s) {
    this.element = i(s), this._create(t), this._init()
  }, i.Mason.settings = {
    isResizable: !0,
    isAnimated: !1,
    animationOptions: {
      queue: !1,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: !1,
    isFitWidth: !1,
    containerStyle: {
      position: "relative"
    }
  }, i.Mason.prototype = {
    _filterFindBricks: function (t) {
      var i = this.options.itemSelector;
      return i ? t.filter(i).add(t.find(i)) : t
    },
    _getBricks: function (t) {
      var i = this._filterFindBricks(t).css({
        position: "absolute"
      }).addClass("masonry-brick");
      return i
    },
    _create: function (s) {
      this.options = i.extend(!0, {}, i.Mason.settings, s), this.styleQueue = [];
      var e = this.element[0].style;
      this.originalStyle = {
        height: e.height || ""
      };
      var n = this.options.containerStyle;
      for (var o in n) this.originalStyle[o] = e[o] || "";
      this.element.css(n), this.horizontalDirection = this.options.isRTL ? "right" : "left";
      var h = this.element.css("padding-" + this.horizontalDirection),
        a = this.element.css("padding-top");
      this.offset = {
        x: h ? parseInt(h, 10) : 0,
        y: a ? parseInt(a, 10) : 0
      }, this.isFluid = this.options.columnWidth && "function" == typeof this.options.columnWidth;
      var r = this;
      setTimeout(function () {
        r.element.addClass("masonry")
      }, 0), this.options.isResizable && i(t).bind("smartresize.masonry", function () {
        r.resize()
      }), this.reloadItems()
    },
    _init: function (t) {
      this._getColumns(), this._reLayout(t)
    },
    option: function (t) {
      i.isPlainObject(t) && (this.options = i.extend(!0, this.options, t))
    },
    layout: function (t, i) {
      for (var s = 0, e = t.length; e > s; s++) this._placeBrick(t[s]);
      var n = {};
      if (n.height = Math.max.apply(Math, this.colYs), this.options.isFitWidth) {
        var o = 0;
        for (s = this.cols; --s && 0 === this.colYs[s];) o++;
        n.width = (this.cols - o) * this.columnWidth - this.options.gutterWidth
      }
      this.styleQueue.push({
        $el: this.element,
        style: n
      });
      var h, a = this.isLaidOut && this.options.isAnimated ? "animate" : "css",
        r = this.options.animationOptions;
      for (s = 0, e = this.styleQueue.length; e > s; s++) h = this.styleQueue[s], h.$el[a](h.style, r);
      this.styleQueue = [], i && i.call(t), this.isLaidOut = !0
    },
    _getColumns: function () {
      var t = this.options.isFitWidth ? this.element.parent() : this.element,
        i = t.width();
      this.columnWidth = this.isFluid ? this.options.columnWidth(i) : this.options.columnWidth || this.$bricks.outerWidth(!0) || i, this.columnWidth += this.options.gutterWidth, this.cols = Math.floor((i + this.options.gutterWidth) / this.columnWidth), this.cols = Math.max(this.cols, 1)
    },
    _placeBrick: function (t) {
      var s, e, n, o, h, a = i(t);
      if (s = Math.ceil(a.outerWidth(!0) / this.columnWidth), s = Math.min(s, this.cols), 1 === s) n = this.colYs;
      else
        for (e = this.cols + 1 - s, n = [], h = 0; e > h; h++) o = this.colYs.slice(h, h + s), n[h] = Math.max.apply(Math, o);
      for (var r = Math.min.apply(Math, n), l = 0, c = 0, u = n.length; u > c; c++)
        if (n[c] === r) {
          l = c;
          break
        }
      var d = {
        top: r + this.offset.y
      };
      d[this.horizontalDirection] = this.columnWidth * l + this.offset.x, this.styleQueue.push({
        $el: a,
        style: d
      });
      var m = r + a.outerHeight(!0),
        p = this.cols + 1 - u;
      for (c = 0; p > c; c++) this.colYs[l + c] = m
    },
    resize: function () {
      var t = this.cols;
      this._getColumns(), (this.isFluid || this.cols !== t) && this._reLayout()
    },
    _reLayout: function (t) {
      var i = this.cols;
      for (this.colYs = []; i--;) this.colYs.push(0);
      this.layout(this.$bricks, t)
    },
    reloadItems: function () {
      this.$bricks = this._getBricks(this.element.children())
    },
    reload: function (t) {
      this.reloadItems(), this._init(t)
    },
    appended: function (t, i, s) {
      if (i) {
        this._filterFindBricks(t).css({
          top: this.element.height()
        });
        var e = this;
        setTimeout(function () {
          e._appended(t, s)
        }, 1)
      } else this._appended(t, s)
    },
    _appended: function (t, i) {
      var s = this._getBricks(t);
      this.$bricks = this.$bricks.add(s), this.layout(s, i)
    },
    remove: function (t) {
      this.$bricks = this.$bricks.not(t), t.remove()
    },
    destroy: function () {
      this.$bricks.removeClass("masonry-brick").each(function () {
        this.style.position = "", this.style.top = "", this.style.left = ""
      });
      var s = this.element[0].style;
      for (var e in this.originalStyle) s[e] = this.originalStyle[e];
      this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"), i(t).unbind(".masonry")
    }
  }, i.fn.imagesLoaded = function (t) {
    function s() {
      t.call(n, o)
    }

    function e(t) {
      var n = t.target;
      n.src !== a && -1 === i.inArray(n, r) && (r.push(n), --h <= 0 && (setTimeout(s), o.unbind(".imagesLoaded", e)))
    }
    var n = this,
      o = n.find("img").add(n.filter("img")),
      h = o.length,
      a = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      r = [];
    return h || s(), o.bind("load.imagesLoaded error.imagesLoaded", e).each(function () {
      var t = this.src;
      this.src = a, this.src = t
    }), n
  };
  var n = function (i) {
    t.console && t.console.error(i)
  };
  i.fn.masonry = function (t) {
    if ("string" == typeof t) {
      var s = Array.prototype.slice.call(arguments, 1);
      this.each(function () {
        var e = i.data(this, "masonry");
        return e ? i.isFunction(e[t]) && "_" !== t.charAt(0) ? void e[t].apply(e, s) : void n("no such method '" + t + "' for masonry instance") : void n("cannot call methods on masonry prior to initialization; attempted to call method '" + t + "'")
      })
    } else this.each(function () {
      var s = i.data(this, "masonry");
      s ? (s.option(t || {}), s._init()) : i.data(this, "masonry", new i.Mason(t, this))
    });
    return this
  }
}(window, jQuery);

function tumblrNotesInserted() {
  $(".more_notes_link").length ? Yoost.LOADING_NOTES = !1 : Yoost.DONE_LOADING_NOTES = !0
}! function (t, i) {
  var s = {
      init: function () {
        this.globals(), this.devices(), this.like_button(), this.in_iframe(), this.like_button(), this.link_color(), this.description_color(), t(".header-image").length && this.load_header(), Function("/*@cc_on return document.documentMode===10@*/")() && Yoost.$body.addClass("ie10")
      },
      globals: function () {
        Yoost.$win = t(window), Yoost.$doc = t(document), Yoost.$body = t("body"), Yoost.$win_body = t("html, body")
      },
      in_iframe: function () {
        window.self !== window.top && Yoost.$body.addClass("iframe")
      },
      is_touch_device: function () {
        return !!("ontouchstart" in window) || !!window.navigator.msMaxTouchPoints
      },
      load_header: function () {
        var i = t(".header-image");
        if (Yoost.$body.hasClass("iframe") || Yoost.$body.hasClass("touch")) i.css({
          opacity: 1
        }).addClass("loaded");
        else {
          var s = i.data("bg-image"),
            e = new Image;
          t(e).bind("load", function () {
            i.addClass("loaded")
          }), e.src = s
        }
      },
      like_button: function () {
        t("#posts").on("mouseenter touchstart", ".like_button", function (i) {
          var s = t(i.currentTarget);
          s.hasClass("liked") || s.addClass("interacted")
        })
      },
      link_color: function () {
        var t = Yoost.Utils.hex_to_hsv(Yoost.ACCENT_COLOR),
          i = Yoost.Utils.hex_to_hsv(Yoost.BACKGROUND_COLOR);
        t.s < .2 && t.v > .8 && (Yoost.$body.addClass("light-accent"), i.s < .2 && i.v > .8 && Yoost.$body.addClass("light-on-light")), t.v < .2 && i.v < .2 && Yoost.$body.addClass("dark-on-dark")
      },
      description_color: function () {
        var i = t(".title-group .description");
        if (i.length) {
          var s = Yoost.Utils.hex_to_rgb(Yoost.TITLE_COLOR);
          i.css({
            color: "rgba(" + s.r + "," + s.g + "," + s.b + ", 0.7)"
          })
        }
      },
      devices: function () {
        var i, s, e = navigator.userAgent;
        this.is_touch_device() && (Yoost.$body.addClass("touch"), Yoost.$body.hasClass("permalink") || setTimeout(function () {
          window.scrollTo(0, 1)
        }, 1)), e.match(/(iPhone|iPod|iPad)/) ? this.ios() : (i = e.match(/Android\s([0-9\.]*)/)) && (s = i[1], Yoost.$body.addClass("android"), parseFloat(s) < 4.4 && Yoost.$body.addClass("android-lt-4-4")), t("#posts").on("click", "a.open-in-app", t.proxy(function (i) {
          i.preventDefault();
          var s = t(i.currentTarget).data("post");
          this.open_in_app(s)
        }, this))
      },
      ios: function () {
        Yoost.$body.addClass("ios"), this.is_ios = !0
      },
      open_in_app: function (i) {
        if (i && "number" == typeof i) {
          var s = "//www.tumblr.com/open/app?referrer=blog_popover&app_args=" + encodeURIComponent("blog?blogName=") + t("body").data("urlencoded-name") + encodeURIComponent("&postID=" + i);
          return this.is_ios ? void this.open_in_app_or_store(s) : void(document.location = s)
        }
      },
      open_in_app_or_store: function (t) {
        var i = "itms-apps://itunes.com/apps/tumblr/tumblr",
          s = document.getElementById("app_protocol_check") || document.createElement("iFrame");
        s.setAttribute("id", "app_protocol_check"), s.style.display = "none", document.body.appendChild(s), s.src = t, setTimeout(function () {
          document.location.href = i
        }, 1e3)
      },
      rgb_to_hex: function (t, i, s) {
        return "#" + ((1 << 24) + (t << 16) + (i << 8) + s).toString(16).slice(1)
      },
      hex_to_rgb: function (t) {
        t = new String(t).replace(/[^0-9a-f]/gi, ""), t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
        var i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return i ? {
          r: parseInt(i[1], 16),
          g: parseInt(i[2], 16),
          b: parseInt(i[3], 16)
        } : null
      },
      rgb_to_hsv: function (t, i, s) {
        var e = Math.min(Math.min(t, i), s),
          o = Math.max(Math.max(t, i), s),
          n = o - e,
          a = {
            h: 6,
            s: o ? (o - e) / o : 0,
            v: o / 255
          };
        return n ? a.h += o === t ? (i - s) / n : o === i ? 2 + (s - t) / n : 4 + (t - i) / n : a.h = 0, a.h = 60 * a.h % 360, a
      },
      hsv_to_rgb: function (t, i, s) {
        var e, o, n;
        if (i) {
          e = o = n = 0;
          var a = (t + 360) % 360 / 60,
            r = s * i,
            h = s - r,
            c = r * (1 - Math.abs(a % 2 - 1));
          1 > a ? (e = r, o = c) : 2 > a ? (e = c, o = r) : 3 > a ? (o = r, n = c) : 4 > a ? (o = c, n = r) : 5 > a ? (n = r, e = c) : (n = c, e = r), e += h, o += h, n += h
        } else e = o = n = s;
        return {
          r: Math.round(255 * e),
          g: Math.round(255 * o),
          b: Math.round(255 * n)
        }
      },
      hex_to_hsv: function (s) {
        s = new String(s).replace(/[^0-9a-f]/gi, ""), s.length < 6 && (s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]);
        var e = i.Utils.hex_to_rgb(s),
          o = t.map(e, function (t) {
            return t
          }),
          n = i.Utils.rgb_to_hsv.apply(i.Utils, o);
        return n
      },
      hsv_to_hex: function (s, e, o) {
        var n = i.Utils.hsv_to_rgb(s, e, o),
          a = t.map(n, function (t) {
            return t
          }),
          r = i.Utils.rgb_to_hex.apply(i.Utils, a);
        return r
      },
      hex_brightness: function (t, i) {
        t = String(t).replace(/[^0-9a-f]/gi, ""), t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), i = i || 0;
        var s, e, o, n = parseInt(t, 16),
          a = 0 > i ? 0 : 255,
          r = 0 > i ? -i : i,
          h = n >> 16,
          c = n >> 8 & 255,
          l = 255 & n;
        return s = Math.round((a - h) * r) + h, e = Math.round((a - c) * r) + c, o = Math.round((a - l) * r) + l, "#" + (16777216 + 65536 * s + 256 * e + o).toString(16).slice(1)
      }
    },
    e = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (t) {
        window.setTimeout(t, 50)
      }
    }(),
    o = {
      init: function () {
        this.tick = !1, this.event_loop()
      },
      event_loop: function () {
        Yoost.$win.on("scroll.Eventor:next-frame", t.proxy(function () {
          this.tick || (e(t.proxy(this.next_frame, this)), this.tick = !0)
        }, this))
      },
      next_frame: function () {
        Yoost.$win.trigger("Eventor:scroll"), this.tick = !1
      }
    },
    n = function (i, s) {
      return this instanceof n ? (this.el = "string" == typeof i ? t(i).get(0) : i, this.$el = t(i), this.options = s, this.metadata = this.$el.data("plugin-options"), this.config = t.extend({}, n.defaults, this.options, this.metadata), this.trigger = this.config.trigger || !1, this.$trigger = t(this.config.trigger) || this.$el, this.bind_events(), this) : new n(i, s)
    };
  n.prototype = {
    __mouse_enter: function (i) {
      this.show(t(i.currentTarget))
    },
    __mouse_leave: function (i) {
      this.hide(t(i.currentTarget))
    },
    bind_events: function () {
      this.$el.on("mouseenter", this.trigger, t.proxy(this.__mouse_enter, this)), this.$el.on("mouseleave", this.trigger, t.proxy(this.__mouse_leave, this))
    },
    show: function (i) {
      clearTimeout(this.leave_delay), t(this.trigger).removeClass("active"), i.addClass("active")
    },
    hide: function (i) {
      Yoost.Popmenu.hide_all(), this.leave_delay = setTimeout(t.proxy(function () {
        i.removeClass("active"), clearTimeout(this.leave_delay)
      }, this), this.config.forgiveness_delay)
    }
  }, n.defaults = {
    forgiveness_delay: 0
  }, t.fn.drawer = function (t) {
    return this.each(function () {
      new n(this, t)
    })
  };
  var a = function (i, s) {
    this.$el = t(i), this.options = t.extend({
      animate_opacity: !1,
      animate_position: !0,
      inertia: .3,
      opacity_inertia: .4
    }, s || {}), this.inertia = this.options.inertia, Yoost.$win.on("Eventor:scroll", t.proxy(this.__window_scroll, this))
  };
  a.prototype = {
    __window_scroll: function () {
      this.parallax()
    },
    reset_offset: function () {
      this.$el.css({
        transform: "translate3d(0, 0, 0)"
      })
    },
    parallax: function () {
      var t = Yoost.$win.scrollTop(),
        i = Math.round(t * this.inertia);
      if (!(i > 400)) {
        if (this.options.animate_opacity) {
          var s = t * this.options.opacity_inertia,
            e = (100 - s) / 100;
          0 > e && (e = 0), this.$el.css({
            opacity: e
          })
        }
        this.options.animate_position && this.$el.css({
          transform: "translate3d(0," + i + "px, 0)"
        })
      }
    }
  };
  var r = function (i, s, e) {
    return this instanceof r ? (this.el = "string" == typeof i ? t(i).get(0) : i, this.$el = t(i), this.config = t.extend({}, r.defaults, s), this.callback = e || function () {}, this.successes = 0, this.errors = 0, this.items = [], this.get_items(), this) : new r(i, s, e)
  };
  r.prototype = {
    get_items: function () {
      this.items = this.el.querySelectorAll(this.config.selector), this.items.length || this.callback();
      for (var i = 0, s = this.items.length; s > i; i++) this.re_load(t(this.items[i]))
    },
    re_load: function (i) {
      i.on("load", t.proxy(function () {
        this.successes += 1, this.done() && this.callback.apply(this)
      }, this)), i.on("error", function () {
        this.errors += 1
      }), i.attr({
        src: i.attr("src")
      })
    },
    done: function () {
      return this.items.length === this.successes + this.errors
    }
  }, r.defaults = {
    selector: "iframe"
  }, t.fn.iframesLoaded = function (t, i) {
    return this.each(function () {
      new r(this, t, i)
    })
  };
  var h = function (i, s) {
    return this instanceof h ? (this.el = "string" == typeof i ? t(i).get(0) : i, this.$el = t(i), this.options = s, this.metadata = this.$el.data("plugin-options"), this.config = t.extend({}, h.defaults, this.options, this.metadata), this.trigger = this.config.trigger, this.$trigger = this.$el.find(this.trigger), this.$search_input = t("#search input"), this.events = {
      trigger_click: t.proxy(this.__trigger_click, this),
      document_click: t.proxy(this.__document_click, this),
      glass_click: t.proxy(this.__class_click, this),
      offset_scroll: t.proxy(this._check_offset, this)
    }, this.bind_events(), h.register(this), this) : new h(i, s)
  };
  h.prototype = {
    __document_click: function (i) {
      var s = t(i.target);
      this.$popover && this.$popover.hasClass("active") && !this.$el.has(s.parents(this.config.container)).length && this.hide()
    },
    __trigger_click: function (i) {
      i.preventDefault(), this.$trigger = t(i.currentTarget), this.$container = this.$trigger.parents(this.config.container), this.$glass = this.$container.siblings(this.config.glass), this.$popover = this.$trigger.siblings(this.config.popopver), this.$popover.hasClass("active") ? this.hide() : this.show()
    },
    _check_offset: function () {
      Math.abs(this.scroll_offset - Yoost.$win.scrollTop()) > this.config.scroll_distance && (this.$search_input.is(":focus") || this.hide())
    },
    bind_events: function () {
      this.$el.on("touchstart click", this.trigger, this.events.trigger_click), Yoost.$doc.on("click", this.events.document_click)
    },
    unbind_events: function () {
      this.$el.off("click", this.trigger, this.events.trigger_click), Yoost.$doc.off("click", this.events.document_click)
    },
    destroy: function () {},
    show: function () {
      this.$glass && this.$glass.addClass("active"), this.$popover.parents("article").addClass("visible"), this.$popover.addClass("show"), this.$trigger.addClass("show"), setTimeout(t.proxy(function () {
        this.$trigger.addClass("active"), this.$container.addClass("active"), this.$popover.addClass("active"), this.scroll_offset = Yoost.$win.scrollTop(), Yoost.$win.on("Eventor:scroll", this.events.offset_scroll)
      }, this), 10)
    },
    hide: function (i) {
      this.$search_input.blur();
      var s = this.$el.find(this.config.popover),
        e = this.$el.find(this.config.trigger);
      Yoost.$win.off("Eventor:scroll", this.events.offset_scroll), this.$glass && this.$glass.removeClass("active"), this.$container && this.$container.removeClass("active"), e.removeClass("active"), s.removeClass("active"), s.each(function () {
        t(this).parents("article").removeClass("visible")
      }), setTimeout(t.proxy(function () {
        e.removeClass("show"), s.removeClass("show")
      }, this), i ? 0 : 250)
    }
  }, h.instances = [], h.defaults = {
    container: ".pop",
    trigger: ".selector",
    popover: ".pop-menu",
    use_glass: !1,
    glass: ".glass",
    scroll_distance: 50
  }, h.register = function (t) {
    this.instances.push(t)
  }, h.hide_all = function () {
    for (var t = 0; t < this.instances.length; t++) this.instances[t].hide(!0)
  }, t.fn.popmenu = function (t) {
    return this.each(function () {
      new h(this, t)
    })
  };
  var c = {
      __window_scroll: function () {
        Yoost.DONE_LOADING_NOTES && this.unbind_events(), this._near_bottom() && !Yoost.LOADING_NOTES && this.load_notes()
      },
      _near_bottom: function () {
        return Yoost.$doc.height() - Yoost.$win.scrollTop() < 3 * Yoost.$win.height()
      },
      init: function () {
        Yoost.LOADING_NOTES = !1, this.events = {
          scroll: t.proxy(this.__window_scroll, this)
        }, this.bind_events()
      },
      bind_events: function () {
        Yoost.$win.on("Eventor:scroll", this.events.scroll)
      },
      unbind_events: function () {
        Yoost.$win.off("Eventor:scroll", this.events.scroll)
      },
      load_notes: function () {
        Yoost.LOADING_NOTES = !0, t(".more_notes_link").trigger("click")
      }
    },
    l = function (i, s) {
      return this instanceof l ? (this.el = "string" == typeof i ? t(i).get(0) : i, this.$el = t(i), this.config = t.extend({}, l.defaults, s), this.config.$pagination || this.config.$pagination.length ? (this.current_page = this.config.$pagination.data("current-page"), this.next_page_number = this.current_page + 1, this.total_pages = this.config.$pagination.data("total-pages"), this.base_url = this.config.$pagination.attr("href"), this.base_url && (this.base_url = this.base_url.substring(0, this.base_url.lastIndexOf("/")) + "/"), this.loading_data = !1, this.is_scrolling = !1, this.body_timeout = -1, this.cache_selectors(), this.bind_events(), this.config.endless_scrolling && this.config.$pagination.length ? (this.config.$pagination.addClass("invisible"), this.init = !0) : this.init = !1, (Yoost.$body.hasClass("touch") || this.$html.hasClass("lt-ie9")) && (Yoost.GRID_LAYOUT = !1, this.is_grid_layout = !1, Yoost.$body.removeClass("grid")), this.update_body(), this.updateMedia(), Yoost.GRID_LAYOUT || this.update_spotify(), Yoost.$body.hasClass("narrow") && this.upscale_images(), this.set_body_type(), l.register(this), this) : void 0) : new l(i, s)
    };
  l.prototype = {
    __document_keydown: function (i) {
      var s = i.charCode ? i.charCode : i.keyCode,
        e = i ? i.target : window.event.srcElement;
      t(e).is("input:focus") || this.is_grid_layout || (74 === s ? this.next_post() : 75 === s ? this.previous_post() : 190 === s && Yoost.$win_body.animate({
        scrollTop: 0
      }))
    },
    __window_resize: function () {
      this.set_body_type(), this.is_grid_layout || this.update_spotify(), this.updateMedia()
    },
    __window_scroll: function () {
      Yoost.$body.hasClass("touch") && this.update_body(), this.is_scrolling || (Yoost.$body.addClass("is-scrolling"), this.is_scrolling = !0), clearTimeout(this.body_timeout), this.body_timeout = setTimeout(t.proxy(function () {
        Yoost.$body.removeClass("is-scrolling"), this.is_scrolling = !1
      }, this), 200), this.init && this._near_bottom() && !this.loading_data && this.next_page()
    },
    _debounce: function (i, s) {
      var e = null;
      return function () {
        var o = arguments;
        clearTimeout(e), e = setTimeout(t.proxy(function () {
          i.apply(this, o)
        }, this), s)
      }
    },
    _throttle: function (t, i, s) {
      i || (i = 250);
      var e, o;
      return function () {
        var n = s || this,
          a = +new Date,
          r = arguments;
        e && e + i > a ? (clearTimeout(o), o = setTimeout(function () {
          e = a, t.apply(n, r)
        }, i)) : (e = a, t.apply(n, r))
      }
    },
    _get_window_bounds: function () {
      this.window_height = Yoost.$win.height()
    },
    _get_post_bounds: function (i) {
      return t.data(i[0], "offsets")
    },
    _set_post_bounds: function (i) {
      var s = i.offset().top,
        e = i.outerHeight(),
        o = s + e;
      return t.data(i[0], "offsets", {
        top: s,
        height: e,
        bottom: o
      })
    },
    _in_view: function (t) {
      var i, s = Yoost.$win.scrollTop();
      this.window_height = this.window_height || Yoost.$win.height();
      var e = s + this.window_height;
      return i = this._get_post_bounds(t), i || (i = this._set_post_bounds(t)), i.bottom + this.window_height < s || i.top > e + this.window_height ? !1 : !0
    },
    _snooze: function (t) {
      t.addClass("snooze")
    },
    _wake: function (t) {
      t.removeClass("snooze")
    },
    _near_bottom: function () {
      var t = this.is_grid_layout ? 1.25 : 3;
      return Yoost.$doc.height() - this.$el.scrollTop() < this.$el.height() * t
    },
    _near_top: function () {
      return !!(Yoost.$win.scrollTop() < 50)
    },
    _slender: function () {
      return Yoost.$win.width() < 720 ? !0 : !1
    },
    _get_next_page: function () {
      this.show_loader();
      var i = t.ajax({
        url: this.base_url + this.next_page_number,
        dataType: "html"
      });
      i.done(t.proxy(this._append_new_posts, this)), i.fail(t.proxy(this._failed, this))
    },
    _failed: function () {
      this.hide_loader(!0)
    },
    _append_new_posts: function (i) {
      var s = t(i).find("#posts > div"),
        e = s.children(),
        o = [];
      e.each(t.proxy(function (i, s) {
        o.push(t(s).find(".like_button").data("post-id"))
      }, this)), this.config.$target.append(s), this.updateMedia(s), Yoost.GRID_LAYOUT && this.is_grid_layout ? e.imagesLoaded(t.proxy(function () {
        s.iframesLoaded({
          selector: ".post-content iframe"
        }, t.proxy(function () {
          this.config.$target.masonry("appended", e, !0), this.loading_data = !1, this.animate_posts(e), this.hide_loader()
        }, this))
      }, this)) : (this.loading_data = !1, this.update_spotify(s), Yoost.$body.hasClass("narrow") && this.upscale_images(s), e.fadeTo(300, 1), this.hide_loader()), Tumblr.LikeButton.get_status_by_post_ids(o), window.ga && ga("send", "pageview", {
        page: "/page/" + this.next_page_number,
        title: "Index Page -- Ajax Load"
      }), this.current_page = this.next_page_number, this.next_page_number++
    },
    cache_selectors: function () {
      this.$html = t("html"), this.$header = t("#header"), this.$posts = t("#posts")
    },
    animate: function () {
      if (this.go_to_position && !this.animating) {
        this.animating = !0;
        t("html,body").stop().animate({
          scrollTop: this.go_to_position - 10
        }, 250, t.proxy(function () {
          this.animating = !1
        }, this))
      }
    },
    set_masonry: function () {
      var i = t("#posts"),
        s = i.find("article");
      i.imagesLoaded(t.proxy(function () {
        i.iframesLoaded({
          selector: ".post-content iframe"
        }, t.proxy(function () {
          i.masonry({
            itemSelector: "article",
            isFitWidth: !0
          }), this.animate_posts(s)
        }, this))
      }, this)), this.is_grid_layout = !0
    },
    animate_posts: function (i) {
      i.first().fadeTo(250, 1), i.length > 0 ? this.animate_timer = setTimeout(t.proxy(function () {
        this.animate_posts(i.slice(1))
      }, this), 25) : clearTimeout(this.animate_timer)
    },
    next_post: function () {
      this.update_post_info();
      for (var t in this.post_positions) {
        var i = this.post_positions[t];
        i > this.current_position + 12 && (i < this.go_to_position || !this.go_to_position) && (this.go_to_position = i)
      }
      this.animate()
    },
    previous_post: function () {
      this.update_post_info();
      for (var t in this.post_positions) {
        var i = this.post_positions[t];
        i < this.current_position - 12 && i > this.go_to_position && (this.go_to_position = i)
      }
      this.animate()
    },
    set_body_type: function () {
      this._slender() ? (Yoost.$body.addClass("slender").removeClass("grid"), Yoost.GRID_LAYOUT && this.is_grid_layout && (this.config.$target.css({
        width: "auto"
      }), this.config.$target.masonry("destroy"), this.is_grid_layout = !1)) : (Yoost.$body.removeClass("slender"), Yoost.GRID_LAYOUT && Yoost.$body.hasClass("index-page") && (Yoost.$body.addClass("grid"), this.set_masonry()))
    },
    update_body: function () {
      this._near_top() ? (Yoost.$body.addClass("top"), Yoost.$body.removeClass("below-header")) : (Yoost.$body.removeClass("top"), Yoost.$body.addClass("below-header"))
    },
    update_post_info: function () {
      this.update_post_positions(), this.current_position = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop, this.go_to_position = 0
    },
    update_post_positions: function () {
      var i = {};
      t("#posts article").each(function () {
        var s = t(this).data("post-id");
        i[s] = t(this).offset().top
      }), this.post_positions = i
    },
    bind_events: function () {
      this.$el.on("Eventor:scroll", t.proxy(this.__window_scroll, this)), this.$el.on("resize orientationchange", t.proxy(this._debounce(this.__window_resize, this.config.resizeDelay), this)), Yoost.$doc.on("keydown", t.proxy(this.__document_keydown, this))
    },
    update_spotify: function (i) {
      var s = t(".audio_container").width(),
        e = s + 80,
        o = i && i.length ? t(".spotify_audio_player", i) : t(".spotify_audio_player");
      o.each(s > 500 ? function () {
        t(this).css({
          width: s,
          height: e
        }), t(this).attr("src", t(this).attr("src"))
      } : function () {
        t(this).css({
          width: s,
          height: 80
        }), t(this).attr("src", t(this).attr("src"))
      })
    },
    upscale_images: function (i) {
      var s = i && i.length ? t(".photo figure:not(.high-res)", i) : t(".photo figure:not(.high-res)");
      s.each(function () {
        t(this).data("photo-width") > 420 && t(this).addClass("high-res")
      })
    },
    updateMedia: function (i) {
      var s = ".twitter-tweet, .tumblr-embed, .tumblr_audio_player, .spotify_audio_player",
        e = "iframe:not(" + s + "), object, embed",
        o = i && i.length ? t(e, i) : t(e, "#page");
      o.each(function () {
        var i = t(this);
        if (i.data("aspect-ratio")) i.css({
          height: i.width() * i.data("aspect-ratio") + "px"
        });
        else {
          var s = i.attr("height") || i.height(),
            e = i.attr("width") || i.width(),
            o = s / e;
          i.data("aspect-ratio", o), i.is(".photoset") ? i.width(i.parent().width()) : i.css({
            width: "100%"
          }), i.css({
            height: i.width() * o + "px"
          })
        }
      })
    },
    next_page: function () {
      return this.total_pages < this.next_page_number ? void this.hide_loader(!0) : (this.loading_data = !0, this.show_loader(), void this._get_next_page())
    },
    hide_loader: function (t) {
      t && this.config.$pagination.hide(), this.config.$loader.removeClass("animate")
    },
    show_loader: function () {
      this.config.$loader.addClass("animate")
    }
  }, l.instances = [], l.defaults = {
    bufferPx: 1e3,
    $pagination: t("#pagination"),
    $loader: t(".loader"),
    resizeDelay: 100,
    scrollDelay: 100,
    $target: t("#posts")
  }, l.register = function (t) {
    this.instances.push(t)
  }, t.fn.pager = function (t) {
    return this.each(function () {
      new l(this, t)
    })
  }, i.Utils = s, i.Eventor = o, i.Popmenu = h, i.Parallaxer = a, i.Drawer = n, i.Pager = l, i.NotesPager = c
}(jQuery, Yoost), $(document).ready(function () {
  Yoost.Utils.init(), Yoost.Eventor.init();
  var t = $("body");
  t.hasClass("contain-header-image") ? new Yoost.Parallaxer("body:not(.ie10, .touch) .parallax", {
    animate_opacity: !0,
    animate_position: !1
  }) : new Yoost.Parallaxer("body:not(.ie10, .touch) .parallax"), new Yoost.Pager(window, {
    $pagination: $("#pagination a"),
    $loader: $("#pagination .loader"),
    endless_scrolling: Yoost.ENDLESS_SCROLLING
  }), $("body:not(.touch) #posts").drawer({
    trigger: "article:not(.exposed)"
  }), $("#page").popmenu(), t.hasClass("permalink") && $(".more_notes_link").length && Yoost.ENDLESS_NOTES_SCROLLING && Yoost.NotesPager.init()
});
