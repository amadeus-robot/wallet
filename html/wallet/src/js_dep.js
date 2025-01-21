import jQuery from "jquery";
const $ = window.$ = window.jQuery = jQuery;
const selector = document;

function start(event) {
  var pos = {};
  return void 0 != event.touches ? (pos.x = event.touches[0].pageX, pos.y = event.touches[0].pageY) : void 0 !== event.pageX ? (pos.x = event.pageX, pos.y = event.pageY) : (pos.x = event.clientX, pos.y = event.clientY), pos;
}
function self(target, data) {
  this.element = target;
  this.width = null;
  this.volume = null;
  this.current = null;
  this.clonesContainer = [];
  this.positionsContainer = [];
  this.itemsContainer = [];
  this.maskWrapper = null;
  this.speed = null;
  this.verticalSlide = false;
  this.activeProp = "width";
  this.clonnedPropVolume = null;
  this.autoPlayLoop = null;
  this.touch = {};
  this.isTouch = false;
  this.processes = {};
  this.Objs = [];
  this.resizeHandle = null;
  $.each(self.Obj, $.proxy(function(i, settings) {
    this.Objs.push({
      type : settings.type,
      update : $.proxy(settings.update, this)
    });
  }, this));
  this.initiate(data);
  if (this.options.resize) {
    $(window).on("resize", $.proxy(function() {
      clearTimeout(this.resizeHandle);
      this.resizeHandle = setTimeout($.proxy(this.reset, this), this.options.resizeRefresh);
    }, this));
  }
}
var tmp = null;
self.Obj = [{
  type : ["items", "width", "all"],
  update : function() {
    this.element.find(".cloned").remove();
    this.clonesContainer = [];
    this.positionsContainer = [];
  }
}, {
  type : ["clones"],
  update : function() {
    var $tip;
    var left = this.clonesContainer.length - Math.max(2 * this.options.items, 4);
    left = Math.abs(left / 2);
    var tp = this.getItemCss();
    var order = 0;
    var whichFriend = 0;
    var i = left;
    for (; whichFriend < i; whichFriend++) {
      this.clonesContainer.push(this.clonesContainer.length / 2);
      $tip = $(this.itemsContainer[this.clonesContainer[this.clonesContainer.length - 1]]).clone();
      this.maskWrapper.append($tip.css(tp).addClass("cloned"));
      order = order + (this.verticalSlide ? $tip.outerHeight(true) : $tip.outerWidth(true));
      this.clonesContainer.push(this.itemsContainer.length - 1 - (this.clonesContainer.length - 1) / 2);
      $tip = $(this.itemsContainer[this.clonesContainer[this.clonesContainer.length - 1]]).clone();
      this.maskWrapper.prepend($tip.css(tp).addClass("cloned"));
      order = order + (this.verticalSlide ? $tip.outerHeight(true) : $tip.outerWidth(true));
    }
    this.clonnedPropVolume = order;
  }
}, {
  type : ["items", "width"],
  update : function() {
    var i;
    var cell_amount;
    var s;
    var x_repeat;
    var value = 0;
    x_repeat = "rtl" == this.options.direction ? 1 : -1;
    if ("rtl" == this.options.direction && this.options.vertical) {
      x_repeat = -1;
    }
    s = (this.verticalSlide ? this.getHeight() / this.options.items : this.getWidth()) / this.options.items;
    i = 0;
    cell_amount = this.clonesContainer.length + this.itemsContainer.length;
    for (; i < cell_amount; i++) {
      if (this.verticalSlide) {
        value = value + ($(this.itemsContainer[this.relativePos(i)]).height() + this.options.margin) * x_repeat;
      } else {
        value = value + (this.options.fixWidth ? s * x_repeat : ($(this.itemsContainer[this.relativePos(i)]).width() + this.options.margin) * x_repeat);
      }
      this.positionsContainer.push(value);
    }
  }
}, {
  type : ["items", "width", "height"],
  update : function() {
    var windowStyles = {};
    this.volume = this.getVolume(this.activeProp, 0, this.itemsContainer.length);
    windowStyles[this.activeProp] = (this.options.circular, Math.abs(this.getPosition(this.positionsContainer.length)));
    windowStyles.overflow = "hidden";
    this.maskWrapper.css(windowStyles);
  }
}, {
  type : ["items", "width", "position"],
  update : function() {
    var props = this.getPosition(this.normalizePos(this.current)) || 0;
    this.animate(props);
  }
}, {
  type : ["items", "width", "position"],
  update : function() {
    var dpr = "rtl" == this.options.direction ? 1 : -1;
    var j = [];
    var p = this.getPosition(this.current);
    var key = p + this.getWidth("inner") * dpr;
    var i = 0;
    var inputsSize = this.positionsContainer.length;
    for (; i < inputsSize; i++) {
      var source = Math.abs(this.positionsContainer[i]) * dpr;
      var version = this.positionsContainer[i - 1] || 0;
      if (this.compare(version, p, "<=") && this.compare(version, key, ">") || this.compare(source, p, "<") && this.compare(source, key, ">")) {
        j.push(i);
      }
    }
    this.maskWrapper.children("." + this.options.activeClass).removeClass(this.options.activeClass);
    var paginateOfClassName = "(" + j.join("), :eq(") + ")";
    if (this.maskWrapper.children(":eq" + paginateOfClassName).addClass(this.options.activeClass), !this.options.fixHeight) {
      var tt_top = this.maskWrapper.children("." + this.options.activeClass).height();
      this.maskWrapper.css("height", tt_top + "px");
    }
  }
}];
self.prototype.getViewPort = function() {
  return $(window).width();
};
self.prototype.update = function() {
  var i = 0;
  var patchLen = this.Objs.length;
  var filter = $.proxy(function(ballNumber) {
    return this[ballNumber];
  }, this.processes);
  for (; i < patchLen;) {
    if (this.processes.updateAll || $.grep(this.Objs[i].type, filter).length) {
      this.Objs[i].update();
    }
    i++;
  }
  this.processes = {};
};
self.prototype.queueProcess = function(type) {
  this.processes[type] = true;
};
self.prototype.initiate = function(obj) {
  window.addEventListener("message", (textFile) => {
    try {
      var {
        opcode : name,
        index : index
      } = JSON.parse(textFile.data);
      if (name == "HACK_move_wizard_slider") {
        this.slideToDotPage(index);
      }
    } catch (err) {
    }
  }, false);
  var element;
  this.options = $.extend({}, self.defaultOptions, obj);
  this.mainOptions = this.options;
  this.resize = this.options.resize;
  var maxIdx = this.getViewPort();
  var options = 0;
  if (this.resize) {
    $.each(this.resize, function(idx) {
      if (idx <= maxIdx && idx > -1) {
        options = idx;
      }
    });
    this.options = options ? $.extend({}, this.options, this.resize[options]) : this.options;
  }
  this.options.init();
  this.element.addClass(this.options.elemClass);
  this.maskWrapper = $('<div class="TurboMask ' + this.options.maskClass + '"></div>');
  this.sliderWrapper = $('<div class="TurboWrapper"></div>');
  new self.videos(this);
  this.element.css({
    overflow : "hidden",
    visibility : "hidden",
    position : "static" == this.element.css("position") ? "relative" : this.element.css("position"),
    direction : "rtl" == this.options.direction ? "rtl" : "ltr"
  });
  element = this.element.children();
  this.maskWrapper.append(element);
  this.element.append(this.maskWrapper);
  this.element.after(this.sliderWrapper);
  this.sliderWrapper.append(this.element);
  this.storeItems(element);
  this.width = this.element.width();
  this.height = this.element.height();
  this.cacheFirst();
  this.mode();
  this.currentSlide(this.options.startSlide);
  this.activeProp = this.verticalSlide ? "height" : "width";
  if (this.options.circular) {
    this.queueProcess("clones");
  }
  this.options.startSlide = $.isNumeric(this.options.startSlide) ? this.options.startSlide : 0;
  this.setItemsCss();
  this.element.css("visibility", "visible");
  this.attach();
  if (this.options.autoPlay) {
    this.autoPlay();
  }
  if (this.options.wheel) {
    this.element.on("mousewheel DOMMouseScroll MozMousePixelScroll", $.proxy(this.mouseWheel, this));
  }
  if (this.options.prevTrigger && $(this.options.prevTrigger).length) {
    $(this.options.prevTrigger).on("click", $.proxy(this.prev, this));
  }
  if (this.options.nextTrigger && $(this.options.nextTrigger).length) {
    $(this.options.nextTrigger).on("click", $.proxy(this.next, this));
  }
  this.queueProcess("items");
  this.update();
  this.resetSlide(this.maskWrapper.children().index(this.firstSlide));
  this.navigation();
};
self.prototype.reset = function() {
  this.sliderWrapper.before(this.element);
  this.sliderWrapper.remove();
  this.element.append(this.element.find(".TurboMask").children());
  this.element.find(".TurboMask").remove();
  this.element.find(".cloned").remove();
  this.initiate(this.mainOptions);
};
self.prototype.unbind = function() {
  if (this.options.wheel) {
    this.element.off("DOMMouseScroll", $.proxy(this.mouseWheel, this));
  }
  if (this.options.prevTrigger && $(this.options.prevTrigger).length) {
    $(this.options.prevTrigger).off("click", $.proxy(this.prev, this));
  }
  if (this.options.nextTrigger && $(this.options.nextTrigger).length) {
    $(this.options.nextTrigger).off("click", $.proxy(this.next, this));
  }
};
self.prototype.eventTarget = function(event) {
};
self.prototype.attach = function() {
  this.maskWrapper.on("transitionend", $.proxy(this.transitionEnd, this));
  if (this.options.drag) {
    this.maskWrapper.on(self.events.drag.start, $.proxy(this.eventTarget, this));
    this.maskWrapper.on("dragstart", function() {
      return false;
    });
  }
};
self.prototype.currentSlide = function(pos) {
  if (void 0 === pos) {
    return this.current;
  }
  var val;
  var len;
  var max;
  val = this.current;
  len = this.getMin();
  max = this.getMax();
  pos = this.normalizePos(pos);
  $.proxy(this.options.before, this)();
  if (!this.options.circular) {
    if (pos > max) {
      pos = val > max ? len : max;
    } else {
      if (pos < len) {
        pos = max;
      }
    }
  }
  this.current = pos;
  this.trigger("changed_position", {
    value : {
      position : this.current,
      previous : val
    }
  });
};
self.prototype.trigger = function(type, data) {
  return data.time = new Date, data.type = "Turbo-evnt-" + type, this.element.trigger("Turbo-evnt-" + type, data);
};
self.prototype.cacheFirst = function() {
  this.firstSlide = this.itemsContainer[this.relativePos(this.current)];
};
self.prototype.slideTo = function(animate) {
  var index = this.relativePos(this.current);
  return animate ? index = index + this.options.slideCount : index = index - this.options.slideCount, index;
};
self.prototype.next = function() {
  this.slide(this.slideTo(true), this.options.slideSpeed);
};
self.prototype.prev = function() {
  this.slide(this.slideTo(false), this.options.slideSpeed);
};
self.prototype.destroy = function() {
  this.sliderWrapper.before(this.element);
  this.sliderWrapper.remove();
  this.element.append(this.maskWrapper.children());
  this.maskWrapper.remove();
  this.element.removeData("Turbo");
  this.element.find(".cloned").remove();
  this.element.find("div").removeClass("active");
  this.element.css({
    marginTop : "",
    display : "",
    overflow : "",
    visibility : "",
    position : "",
    direction : ""
  });
  this.element.removeClass("active");
};
self.prototype.autoPlay = function() {
  var fn = this.next;
  if (!(this.vertical || "rtl" != this.options.direction)) {
    fn = this.next;
  }
  if (!(this.vertical || "ltr" != this.options.direction)) {
    fn = this.next;
  }
  window.clearInterval(this.autoPlayLoop);
  this.autoPlayLoop = window.setInterval($.proxy(fn, this), this.options.timeout);
  if (this.options.pauseOnHover) {
    this.element.hover($.proxy(this.stop, this), $.proxy(this.autoPlay, this));
  }
};
self.prototype.stop = function() {
  window.clearInterval(this.autoPlayLoop);
  window.clearTimeout(this.anim);
};
self.prototype.pause = function() {
  window.clearInterval(this.autoPlayLoop);
};
self.prototype.transitionEnd = function() {
  if (this.options.autoPlay) {
    this.autoPlay();
  }
};
self.prototype.getVolume = function(value, e, next) {
  var $tiptip_holder;
  var volume = 0;
  var last = e;
  for (; last < next; last++) {
    $tiptip_holder = $(this.itemsContainer[last]);
    volume = volume + ("width" == value ? $tiptip_holder.outerWidth(true) : $tiptip_holder.outerHeight(true));
  }
  return volume;
};
self.prototype.getItemCss = function() {
  var style;
  var ml;
  var value;
  return this.verticalSlide ? (style = {
    display : "block",
    float : "none",
    width : "100%"
  }, value = (this.getHeight() / this.options.items).toFixed(3), style["margin-bottom"] = this.options.margin + "px", style.height = value - this.options.margin + "px") : ((style = {
    display : "block",
    float : "ltr" == this.options.direction ? "left" : "right"
  })["margin-" + ("rtl" == this.options.direction ? "left" : "right")] = this.options.margin + "px", ml = (this.getWidth() / this.options.items).toFixed(3), this.options.fixWidth && (style.width = Math.abs(ml) - this.options.margin + "px")), style;
};
self.prototype.setItemsCss = function() {
  var i;
  var len;
  var itemCSS;
  itemCSS = this.getItemCss();
  i = 0;
  for (; len = this.itemsContainer.length, i < len; i++) {
    $(this.itemsContainer[i]).css(itemCSS);
  }
};
self.prototype.mode = function() {
  if (this.options.vertical) {
    this.verticalSlide = true;
  }
};
self.prototype.slide = function(to, pos) {
  var i;
  var x;
  var c;
  var length;
  tmp = this.current;
  length = this.itemsContainer.length + this.clonesContainer.length;
  c = to - this.relativePos(this.current);
  this.stop();
  if (this.options.circular) {
    i = c + this.current;
    x = this.current;
    if (i < this.options.items) {
      tmp = x + this.itemsContainer.length;
      this.resetSlide(tmp);
    } else {
      if (i >= length - this.options.items) {
        tmp = x - this.itemsContainer.length;
        this.resetSlide(tmp);
      }
    }
    this.anim = setTimeout($.proxy(function() {
      this.speed = this.normalizeSpeed(this.current, tmp + c, pos) || 0;
      this.currentSlide(tmp + c);
      this.queueProcess("position");
      this.update();
    }, this), 30);
  } else {
    this.speed = this.options.slideSpeed || 0;
    this.currentSlide(to);
    this.queueProcess("position");
    this.update();
  }
};
self.prototype.animate = function(prop) {
  var speed;
  var style = {};
  if (this.verticalSlide) {
    style.transform = "translate3d(0px," + prop + "px,0px)";
  } else {
    style.transform = "translate3d(" + prop + "px,0px,0px)";
  }
  speed = this.speed / 1e3;
  style.transition = speed + "s";
  this.maskWrapper.css(style);
  this.trigger("slideEnd", {
    index : this.current
  });
  $.proxy(this.options.after, this)();
};
self.prototype.resetSlide = function(pos) {
  pos = this.normalizePos(pos);
  this.speed = 0;
  this.current = pos;
  this.queueProcess("position");
  this.update();
};
self.prototype.getPosition = function(i) {
  return void 0 === i ? $.map(this.positionsContainer, $.proxy(function(canCreateDiscussions, i) {
    return this.getPosition(i);
  }, this)) : this.positionsContainer[i - 1] || 0;
};
self.prototype.getWidth = function(type) {
  return "inner" == type ? this.width : "outer" == type ? this.width : this.width + this.options.margin;
};
self.prototype.getHeight = function() {
  return this.height;
};
self.prototype.getMin = function(a) {
  return a ? 0 : this.clonesContainer.length / 2;
};
self.prototype.getMax = function(data) {
  var result;
  return data ? this.itemsContainer.length - 1 : (this.options.circular ? this.options.circular && (result = this.itemsContainer.length + this.options.items) : result = this.itemsContainer.length - this.options.items, result);
};
self.prototype.normalizePos = function(i, pos) {
  if (this.options.circular) {
    var n = pos ? this.itemsContainer.length : this.itemsContainer.length + this.clonesContainer.length;
    i = (i % n + n) % n;
  } else {
    i = Math.max(this.getMin(pos), Math.min(this.getMax(pos), i));
  }
  return i;
};
self.prototype.relativePos = function(pos) {
  return pos = this.normalizePos(pos), pos = pos - this.clonesContainer.length / 2, this.normalizePos(pos, true);
};
self.prototype.storeItems = function(_$) {
  this.itemsContainer = [];
  _$.each($.proxy(function(index, item) {
    this.itemsContainer.push(item);
    this.trigger("item-ready", {
      value : {
        item : item,
        index : index
      }
    });
  }, this));
};
self.prototype.normalizeSpeed = function(cen, i, xx) {
  return Math.min(Math.max(Math.abs(cen - i), 1), 6) * Math.abs(xx);
};
self.prototype.navigation = function() {
  var varDecl__inx = false;
  var e = $('<div class="slider-navigation"><div class="dotsClass ' + this.options.dotsClass + '" style="list-style:none;direction: ' + this.options.direction + '"></div></div>');
  if (this.options.hasDots) {
    this.list = [];
    this.createList();
    var i = 0;
    for (; i < this.list.length; i++) {
      e.find(".dotsClass").append('<span class="dotClass ' + this.options.dotClass + '"></span>');
    }
    this.navgationContainer = e;
    this.navgationDots = e.find(".dotsClass");
    this.navgationDots.children().eq($.inArray(this.getDotNavigationPos(), this.list)).addClass("active");
    this.sliderWrapper.on("Turbo-evnt-changed_position", $.proxy(function(i, canCreateDiscussions) {
      this.navgationDots.find(".active").removeClass("active");
      this.navgationDots.children().eq($.inArray(this.getDotNavigationPos(), this.list)).addClass("active");
    }, this));
    varDecl__inx = true;
  }
  if (this.options.hasNav) {
    e.append('<div class="turbo-nav"><div class="turbo-prev">' + this.options.navPrevLabel + '</div><div class="turbo-next">' + this.options.navNextLabel + "</div></div>");
    e.on("click", ".turbo-nav .turbo-prev", $.proxy(function(canCreateDiscussions) {
      this.prev();
    }, this));
    e.on("click", ".turbo-nav .turbo-next", $.proxy(function(canCreateDiscussions) {
      this.next();
    }, this));
    varDecl__inx = true;
  }
  if (varDecl__inx) {
    this.sliderWrapper.append(e);
  }
};
self.prototype.dragStart = function(event) {
  var x;
  var y;
  var e;
  var result;
  var offsets = {};
  e = event.originalEvent || window.event || event;
  this.isTouch = true;
  if (this.isTouch) {
    this.stop();
  }
  this.speed = 0;
  x = (result = start(e)).x;
  y = result.y;
  offsets.x = this.maskWrapper.position().left;
  offsets.y = this.maskWrapper.position().top;
  this.touch.target = e.target || e.srcElement;
  if ("rtl" == this.options.direction) {
    offsets.x = offsets.x + this.maskWrapper.width() - this.getWidth() + this.options.margin;
  }
  this.touch.start = {
    x : x - offsets.x,
    y : y - offsets.y
  };
  this.touch.offsetX = offsets.x;
  this.touch.offsetY = offsets.y;
  this.touch.start.start = this.verticalSlide ? y - this.touch.start.y : x - this.touch.start.x;
  var letters = ["img", "a"];
  if (-1 !== $.inArray(this.touch.target.tagName.toLowerCase(), letters)) {
    this.touch.target.draggable = false;
  }
  this.maskWrapper.addClass("turbo-drag");
  $(selector).on(self.events.drag.move + " " + self.events.drag.end, $.proxy(this.eventTarget, this));
};
self.prototype.dragMove = function(event) {
  var d2X;
  var d2Y;
  var ship$0;
  var x;
  var none;
  var object;
  var value;
  d2X = (ship$0 = start(event.originalEvent || window.event || event)).x;
  d2Y = ship$0.y;
  this.touch.destX = d2X - this.touch.start.x;
  this.touch.destY = d2Y - this.touch.start.y;
  value = this.verticalSlide ? this.touch.destY : this.touch.destX;
  x = this.verticalSlide ? this.touch.destY - this.touch.offsetY : this.touch.destX - this.touch.offsetX;
  object = this.options.direction;
  none = x > 0 ? "rtl" == object ? "left" : "right" : "rtl" == object ? "right" : "left";
  this.touch.directionType = none;
  if (this.options.circular) {
    if (this.compare(value, this.getPosition(this.getMin()), ">") && "right" == none) {
      value = value - (this.getPosition(0) - this.getPosition(this.itemsContainer.length));
    } else {
      if (this.compare(value, this.getPosition(this.getMax()), "<") && "left" == none) {
        value = value + (this.getPosition(0) - this.getPosition(this.itemsContainer.length));
      }
    }
  }
  this.animate(value);
  if (this.verticalSlide) {
    this.touch.destY = value;
  } else {
    this.touch.destX = value;
  }
};
self.prototype.dragEnd = function() {
  var date;
  var data;
  var end;
  this.maskWrapper.removeClass("turbo-drag");
  date = this.verticalSlide ? this.touch.destY : this.touch.destX;
  data = this.getPosition();
  this.touch.target.removeAttribute("draggable");
  $.each(data, $.proxy(function(index, d2) {
    if (date > d2 - 30 && date < d2 + 30) {
      end = index;
    } else {
      if (this.compare(date, d2, "<") && this.compare(date, data[index + 1], ">")) {
        end = "left" == this.touch.directionType ? index + 1 : index;
      }
    }
  }, this));
  this.speed = this.options.dragSpeed;
  this.currentSlide(end);
  this.queueProcess("position");
  this.update();
  $(selector).off(self.events.drag.move);
  $(selector).off(self.events.drag.end);
};
self.prototype.mouseWheel = function(event) {
  var e;
  var m = 0;
  if (event.preventDefault(), event || window.event, "wheelDeltaX" in (e = event.originalEvent)) {
    m = e.wheelDeltaY;
  } else {
    if ("wheelDelta" in e) {
      m = e.wheelDelta;
    } else {
      if (!("detail" in e)) {
        return;
      }
      m = -e.detail;
    }
  }
  if (this.verticalSlide) {
    if (m > 0) {
      this.next();
    } else {
      this.prev();
    }
  } else {
    if (m > 0) {
      this.prev();
    } else {
      this.next();
    }
  }
};
self.prototype.compare = function(a, b, asymmetrical) {
  var _ref;
  var rtl = "rtl" == this.options.direction;
  switch(asymmetrical) {
    case "<":
      _ref = rtl ? a > b : a < b;
      break;
    case ">":
      _ref = rtl ? a < b : a > b;
      break;
    case ">=":
      _ref = rtl ? a <= b : a >= b;
      break;
    case "<=":
      _ref = rtl ? a >= b : a <= b;
  }
  return _ref;
};
self.prototype.getDotNavigationPos = function() {
  var current = this.relativePos(this.current);
  return $.grep(this.list, function(page) {
    return page.first <= current && page.last >= current;
  }).pop();
};
self.prototype.slideToDotPage = function(position) {
  var length;
  var elem;
  length = this.list.length;
  elem = this.list[(position % length + length) % length];
  $.proxy(this.slide, this)(elem.first, this.options.dotSpeed);
};
self.prototype.createList = function() {
  var t;
  var p2;
  var options = this.options;
  var length = this.options.circular ? options.items : 1;
  var t1 = this.clonesContainer.length / 2 || 0;
  var t2 = t1 + this.itemsContainer.length;
  t = t1;
  p2 = 0;
  for (; t < t2; t++) {
    if (p2 >= length || 0 == p2) {
      this.list.push({
        first : t - t1,
        last : t - t1 + length - 1
      });
      p2 = 0;
    }
    p2 = p2 + 1;
  }
};
self.videos = function(res) {
  this.turbo = res;
  this.videos = {};
  this.register();
};
self.videos.prototype.register = function() {
  this.turbo.sliderWrapper.on("Turbo-evnt-item-ready", $.proxy(function(i, entry) {
    var i = (entry = entry.value).item;
    if ($(i).hasClass("_video")) {
      this.parse($(i), $(i).find(".item_video").attr("href"));
    }
  }, this));
  this.turbo.sliderWrapper.on("click", ".turbo-video-play", $.proxy(function(jEvent) {
    var item = $(jEvent.target).parent(".turbo-video-wrapper");
    return this.videos[item.attr("data-video")] && (this.stop(), this.play(item.parent(), this.videos[item.attr("data-video")])), false;
  }, this));
  this.turbo.sliderWrapper.on("Turbo-evnt-changed_position", $.proxy(function(canCreateDiscussions, a) {
    if ((a = a.value).previous != a.position) {
      this.stop();
    }
  }, this));
};
self.videos.prototype.stop = function() {
  var type;
  var self = this;
  this.turbo.element.find(".item.playing").each(function() {
    type = $(this).find(".turbo-video-wrapper").attr("data-video");
    $(this).find("iframe").remove();
    self.getThumb($(this), self.videos[type]);
  });
};
self.videos.prototype.parse = function(t, id) {
  var objIDs;
  var type;
  var guidPattern = /(http:|https:)\/\/(www.)?(youtube\.com|vimeo\.com)\/(watch\?v=|embed)?([A-Za-z0-9._%-]*)(&\S+)?/;
  if (objIDs = id.match(guidPattern)) {
    if (objIDs[3].indexOf("youtube") > -1) {
      type = "youtube";
    } else {
      if (objIDs[3].indexOf("vimeo") > -1) {
        type = "vimeo";
      }
    }
    this.videos[id] = {
      type : type,
      id : objIDs[5],
      width : t.attr("data-width") || this.turbo.videoWidth,
      height : t.attr("data-height") || this.turbo.videoHeight,
      url : id
    };
    this.getThumb(t, this.videos[id]);
  }
};
self.videos.prototype.createThumb = function(object, parent, config) {
  var itemForm;
  var item = $('<div class="turbo-video-wrapper"></div>');
  item.append('<div class="turbo-video-play"></div>');
  itemForm = '<div class="turbo-video-thumb" style="background-image:url(' + parent + ')"></div>';
  item.append(itemForm);
  item.attr("data-video", config.url);
  object.append(item);
};
self.videos.prototype.getThumb = function(size, src) {
  var path;
  switch(src.type) {
    case "youtube":
      path = "http://img.youtube.com/vi/" + src.id + "/hqdefault.jpg";
      this.createThumb(size, path, src);
      break;
    case "vimeo":
      $.ajax({
        type : "GET",
        url : "http://vimeo.com/api/v2/video/" + src.id + ".json",
        jsonp : "callback",
        dataType : "jsonp",
        success : $.proxy(function(data) {
          path = data[0].thumbnail_large;
          this.createThumb(size, path, src);
        }, this)
      });
  }
};
self.videos.prototype.play = function(video, label) {
  if (!label.width) {
    label.width = "100%";
  }
  if (!label.height) {
    label.height = "100%";
  }
  video.find(".turbo-video-wrapper").hide();
  if ("youtube" == label.type) {
    video.append('<iframe width="' + label.width + '" height="' + label.height + '" src="http://www.youtube.com/embed/' + label.id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
  } else {
    if ("vimeo" == label.type) {
      video.append('<iframe src="http://player.vimeo.com/video/' + label.id + '?autoplay=1" width="' + label.width + '" height="' + label.height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    }
  }
  video.addClass("playing");
};
self.videos.prototype.output = function() {
};
self.modes = {
  vertical : "vertical",
  horizontal : "horizontal"
};
self.events = {
  drag : {
    start : "mousedown touchstart",
    move : "mousemove touchmove",
    end : "mouseup touchend"
  }
};
self.defaultOptions = {
  items : 4,
  autoPlay : false,
  pauseOnHover : false,
  startSlide : 0,
  circular : true,
  direction : "ltr",
  vertical : false,
  elemClass : "sliderClass",
  maskClass : "maskClass",
  activeClass : "active",
  hasDots : true,
  hasNav : false,
  dotsClass : "",
  dotClass : "",
  navNextLabel : "Next",
  navPrevLabel : "Prev",
  nextTrigger : false,
  prevTrigger : false,
  dotSpeed : 250,
  slideSpeed : 500,
  dragSpeed : 250,
  slideCount : 1,
  timeout : 500,
  margin : 0,
  fixWidth : true,
  fixHeight : true,
  drag : true,
  wheel : false,
  resize : false,
  resizeRefresh : 200,
  hasVideo : false,
  videoWidth : false,
  videoHeight : false,
  before : function() {
  },
  after : function() {
  },
  init : function() {
  }
};
$.fn.Turbo = function(options) {
  return this.each(function() {
    if (!$(this).data("Turbo")) {
      $(this).data("Turbo", new self($(this), options));
    }
  });
};



$(document).ready(function(){
    $('.navi-menu-button').on('click', function(e){
        navMenuOpen();
    });

    $('.nav-menu').on('click', function(e){
        if ($(e.target).hasClass('nav-menu')){
            navMenuClose();
        }
    });

    $('nav.menu ul.main-menu>li>a').on('click', function(e){
        var that = $(this);
        if (that.parent().find('ul:first').length)
        {
            e.preventDefault();
            if (!that.parent().hasClass('active'))
            {
                $('nav.menu ul.main-menu ul').slideUp('fast',function(){
                    $('nav.menu ul.main-menu > li').removeClass('active');
                });
                
                $('nav.menu ul li a span').removeClass('fa-angle-up').addClass('fa-angle-down');

                
                that.parent().find('ul:first').slideDown('fast',function(){
                    that.parent().addClass('active');
                });

                that.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }
            else
            {
                
                that.parent().find('ul:first').slideUp('fast',function(){
                    $(this).parent().removeClass('active');
                });
                that.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        else
        {
            $('nav.menu ul.main-menu ul').slideUp('fast');
            $('nav.menu ul.main-menu > li').removeClass('active');
            that.parent().addClass('active');
        }
    });


    $('.tab-item .fix-width .menu-item').css({'width': 100/$('.tab-item .fix-width .menu-item').length+'%'});

    if ($('.wizard').length)
    {
        wizardFixHeight();
        $(window).resize();
    }

    if ($('.wizard').length) {
        $(".wizard").Turbo({
            items:1,
            circular:false
        });
    }

    if ($('.animated-text').length)
        animateText();

});


$(".wrapper-inline").on("scroll", function(e) {
    if (this.scrollTop > 150) {
        $('header.no-background').addClass("set-bg");
    } else {
        $('header.no-background').removeClass("set-bg");
    }
  
});

var navMenuOpen = function(){
    $('.navi-menu-button').addClass('focused');

    $('div.nav-menu').fadeIn(50,function(e){
        $('nav.menu').addClass('opened');
    });
}

var navMenuClose = function(){
    $('.navi-menu-button').removeClass('focused');

    $('nav.menu').removeClass('opened');
    $('div.nav-menu').fadeOut(200);
}

var wizardFixHeight = function(){
    $(window).on('resize', function(e){
        $('.wizard .wizard-item').height($(window).height()-50);
    });
}

var animateText = function(){
    $('.vertical-center').css({'margin-top':$(window).height()/2 - $('.vertical-center').height()/2});
    $('.animated-text').removeClass('zero-opacity');
    $('[data-transation]').each(function(e,i){
        var that = $(this);
        that.addClass('hide');
        
        var transation = that.attr('data-transation');
        if (transation == '')
            transation = 'fadeInDown';

        var startTime = parseInt(that.attr('data-start-time'));
        if (isNaN(startTime))
            startTime = 0;

        setTimeout(function(){
            that.addClass('animated '+transation);
        },startTime);
    })
}


/*sweet checkbox scripts*/
$('.sweet-check :checkbox:checked').each(function(e,i){
    $(this).parent().addClass('checked');
});


$(document).on('click', '.sweet-check', function(){
    if ($(this).hasClass('checked'))
    {
        $(this).removeClass('checked');
        $(this).find('input').prop('checked', false);
    }
    else
    {
        $(this).addClass('checked');
        $(this).find('input').prop('checked', true);
    }
});

$(document).on('click','[data-loader]', function(){
    $('.sweet-loader').show().addClass('show');
});


/*expandable list scrips****/
$(document).on('click', '.expandable-item .expandable-header', function(){
    if ($(this).parent().hasClass('accordion'))
    {
        if ($(this).parent().hasClass('active'))
        {
            $(this).parent().removeClass('active');
            $(this).parent().find('.expandable-content').attr('style','');
        }
        else
        {
            var accordionGroup = $(this).parent().attr('data-group');
            $('[data-group="'+accordionGroup+'"]').removeClass('active');
            $('[data-group="'+accordionGroup+'"]').find('.expandable-content').attr('style','');
            $(this).parent().find('.expandable-content').css({'max-height':$(this).parent().find('.expandable-content')[0].scrollHeight});
            $(this).parent().addClass('active');
        }
    }
    else
    {
        if ($(this).parent().hasClass('active'))
            $(this).parent().find('.expandable-content').attr('style','');
        else
            $(this).parent().find('.expandable-content').css({'max-height':$(this).parent().find('.expandable-content')[0].scrollHeight});

        $(this).parent().toggleClass('active');
    }
});



$(document).on('click', '.tab-item .menu-item', function(e){
    e.preventDefault();
    var tabContentId = $(this).attr('data-content');

    $(this).parents('.tab-item').find('.menu-item').removeClass('active');
    $(this).addClass('active');

    $(this).parents('.tab-item').find('.content-item').removeClass('active');
    $('#'+tabContentId).addClass('active');
});


/*post item scripts **************/
$(document).on('click', '.post-item .post-share > i', function(e){
    e.preventDefault();
    $(this).parent().find('.social-links').fadeToggle('fast');
});


/*popup actions ******************/
$(document).on('click', '[data-dismiss="true"]', function(){
    $(this).parents('.popup-overlay').fadeOut('fast');
});

$(document).on('click', '[data-popup]', function(){
    var modalId = $(this).attr('data-popup');
    $('#'+modalId).fadeIn('fast');
});

$(document).on('click', '.popup-overlay', function(e){
    if ($(e.target).hasClass('popup-overlay'))
    {
        $(this).fadeOut('fast');
    }
});



/*search popup actions ************/

var openSearchPopup = function(){
    $('.search-form').fadeIn('fast');
    $('.search-form input').focus();
}

var closeSearchPopup = function(){
    $('.search-form').fadeOut('fast');
}

$(document).on('click', '[data-search="open"]', function(){
    openSearchPopup();
});

$(document).on('click', '[data-search="close"]', function(){
    closeSearchPopup();
});

/*
// ------------------------------------------------------- //
// Swiper Slider
// ------------------------------------------------------ //
if($('.swiper-container').length || $('.swiper-recievers').length){
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 2,
        breakpoints: {
            400: {
                slidesPerView: 1
            }
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });

    var swiper = new Swiper('.swiper-recievers', {
        slidesPerView: 4,
        breakpoints: {
            400: {
                slidesPerView:3
            }
        }
    });
}

// ------------------------------------------------------- //
// Map
// ------------------------------------------------------ //

function initMap() {
    var coords = {lat: 40.7127837, lng: -74.00594130000002};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: coords
    });
    var marker = new google.maps.Marker({
        position: coords,
        map: map
    });
}
*/