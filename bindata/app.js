/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var BufferSet_1 = __webpack_require__(26);
var CompositionHelper_1 = __webpack_require__(29);
var EventEmitter_1 = __webpack_require__(2);
var Viewport_1 = __webpack_require__(30);
var Clipboard_1 = __webpack_require__(31);
var EscapeSequences_1 = __webpack_require__(3);
var InputHandler_1 = __webpack_require__(32);
var Parser_1 = __webpack_require__(33);
var Renderer_1 = __webpack_require__(34);
var Linkifier_1 = __webpack_require__(36);
var SelectionManager_1 = __webpack_require__(37);
var CharMeasure_1 = __webpack_require__(40);
var Browser = __webpack_require__(9);
var Mouse_1 = __webpack_require__(8);
var BufferLine_1 = __webpack_require__(10);
var document = typeof window != 'undefined' ? window.document : null;
var WRITE_BUFFER_PAUSE_THRESHOLD = 5;
var WRITE_BATCH_SIZE = 300;
var CURSOR_BLINK_INTERVAL = 600;
function Terminal(options) {
    var self = this;
    if (!(this instanceof Terminal)) {
        return new Terminal(arguments[0], arguments[1], arguments[2]);
    }
    self.browser = Browser;
    self.cancel = Terminal.cancel;
    EventEmitter_1.EventEmitter.call(this);
    if (typeof options === 'number') {
        options = {
            cols: arguments[0],
            rows: arguments[1],
            handler: arguments[2]
        };
    }
    options = options || {};
    Object.keys(Terminal.defaults).forEach(function (key) {
        if (options[key] == null) {
            options[key] = Terminal.options[key];
            if (Terminal[key] !== Terminal.defaults[key]) {
                options[key] = Terminal[key];
            }
        }
        self[key] = options[key];
    });
    if (options.colors.length === 8) {
        options.colors = options.colors.concat(Terminal._colors.slice(8));
    } else if (options.colors.length === 16) {
        options.colors = options.colors.concat(Terminal._colors.slice(16));
    } else if (options.colors.length === 10) {
        options.colors = options.colors.slice(0, -2).concat(Terminal._colors.slice(8, -2), options.colors.slice(-2));
    } else if (options.colors.length === 18) {
        options.colors = options.colors.concat(Terminal._colors.slice(16, -2), options.colors.slice(-2));
    }
    this.colors = options.colors;
    this.options = options;
    this.parent = options.body || options.parent || (document ? document.getElementsByTagName('body')[0] : null);
    this.cols = options.cols || options.geometry[0];
    this.rows = options.rows || options.geometry[1];
    this.geometry = [this.cols, this.rows];
    if (options.handler) {
        this.on('data', options.handler);
    }
    this.cursorState = 0;
    this.cursorHidden = false;
    this.convertEol;
    this.queue = '';
    this.customKeyEventHandler = null;
    this.cursorBlinkInterval = null;
    this.applicationKeypad = false;
    this.applicationCursor = false;
    this.originMode = false;
    this.insertMode = false;
    this.wraparoundMode = true;
    this.charset = null;
    this.gcharset = null;
    this.glevel = 0;
    this.charsets = [null];
    this.decLocator;
    this.x10Mouse;
    this.vt200Mouse;
    this.vt300Mouse;
    this.normalMouse;
    this.mouseEvents;
    this.sendFocus;
    this.utfMouse;
    this.sgrMouse;
    this.urxvtMouse;
    this.element;
    this.children;
    this.refreshStart;
    this.refreshEnd;
    this.savedX;
    this.savedY;
    this.savedCols;
    this.readable = true;
    this.writable = true;
    this.defAttr = 0 << 18 | 257 << 9 | 256 << 0;
    this.curAttr = this.defAttr;
    this.params = [];
    this.currentParam = 0;
    this.prefix = '';
    this.postfix = '';
    this.inputHandler = new InputHandler_1.InputHandler(this);
    this.parser = new Parser_1.Parser(this.inputHandler, this);
    this.renderer = this.renderer || null;
    this.selectionManager = this.selectionManager || null;
    this.linkifier = this.linkifier || new Linkifier_1.Linkifier();
    this.writeBuffer = [];
    this.writeInProgress = false;
    this.xoffSentToCatchUp = false;
    this.writeStopped = false;
    this.surrogate_high = '';
    this.buffers = new BufferSet_1.BufferSet(this);
    this.buffer = this.buffers.active;
    this.buffers.on('activate', function (buffer) {
        this._terminal.buffer = buffer;
    });
    if (this.selectionManager) {
        this.selectionManager.setBuffer(this.buffer.lines);
    }
    this.setupStops();
    this.userScrolling = false;
}
inherits(Terminal, EventEmitter_1.EventEmitter);
Terminal.prototype.eraseAttr = function () {
    return this.defAttr & ~0x1ff | this.curAttr & 0x1ff;
};
Terminal.tangoColors = ['#2e3436', '#cc0000', '#4e9a06', '#c4a000', '#3465a4', '#75507b', '#06989a', '#d3d7cf', '#555753', '#ef2929', '#8ae234', '#fce94f', '#729fcf', '#ad7fa8', '#34e2e2', '#eeeeec'];
Terminal.colors = function () {
    var colors = Terminal.tangoColors.slice(),
        r = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff],
        i;
    i = 0;
    for (; i < 216; i++) {
        out(r[i / 36 % 6 | 0], r[i / 6 % 6 | 0], r[i % 6]);
    }
    i = 0;
    for (; i < 24; i++) {
        r = 8 + i * 10;
        out(r, r, r);
    }
    function out(r, g, b) {
        colors.push('#' + hex(r) + hex(g) + hex(b));
    }
    function hex(c) {
        c = c.toString(16);
        return c.length < 2 ? '0' + c : c;
    }
    return colors;
}();
Terminal._colors = Terminal.colors.slice();
Terminal.vcolors = function () {
    var out = [],
        colors = Terminal.colors,
        i = 0,
        color;
    for (; i < 256; i++) {
        color = parseInt(colors[i].substring(1), 16);
        out.push([color >> 16 & 0xff, color >> 8 & 0xff, color & 0xff]);
    }
    return out;
}();
Terminal.defaults = {
    colors: Terminal.colors,
    theme: 'default',
    convertEol: false,
    termName: 'xterm',
    geometry: [80, 24],
    cursorBlink: false,
    cursorStyle: 'block',
    visualBell: false,
    popOnBell: false,
    scrollback: 1000,
    screenKeys: false,
    debug: false,
    cancelEvents: false,
    disableStdin: false,
    useFlowControl: false,
    tabStopWidth: 8
};
Terminal.options = {};
Terminal.focus = null;
each(keys(Terminal.defaults), function (key) {
    Terminal[key] = Terminal.defaults[key];
    Terminal.options[key] = Terminal.defaults[key];
});
Terminal.prototype.focus = function () {
    return this.textarea.focus();
};
Terminal.prototype.getOption = function (key) {
    if (!(key in Terminal.defaults)) {
        throw new Error('No option with key "' + key + '"');
    }
    if (typeof this.options[key] !== 'undefined') {
        return this.options[key];
    }
    return this[key];
};
Terminal.prototype.setOption = function (key, value) {
    if (!(key in Terminal.defaults)) {
        throw new Error('No option with key "' + key + '"');
    }
    switch (key) {
        case 'scrollback':
            if (value < this.rows) {
                var msg = 'Setting the scrollback value less than the number of rows ';
                msg += "(" + this.rows + ") is not allowed.";
                console.warn(msg);
                return false;
            }
            if (this.options[key] !== value) {
                if (this.buffer.lines.length > value) {
                    var amountToTrim = this.buffer.lines.length - value;
                    var needsRefresh = this.buffer.ydisp - amountToTrim < 0;
                    this.buffer.lines.trimStart(amountToTrim);
                    this.buffer.ybase = Math.max(this.buffer.ybase - amountToTrim, 0);
                    this.buffer.ydisp = Math.max(this.buffer.ydisp - amountToTrim, 0);
                    if (needsRefresh) {
                        this.refresh(0, this.rows - 1);
                    }
                }
                this.buffer.lines.maxLength = value;
                this.viewport.syncScrollArea();
            }
            break;
    }
    this[key] = value;
    this.options[key] = value;
    switch (key) {
        case 'cursorBlink':
            this.setCursorBlinking(value);
            break;
        case 'cursorStyle':
            this.element.classList.toggle("xterm-cursor-style-block", value === 'block');
            this.element.classList.toggle("xterm-cursor-style-underline", value === 'underline');
            this.element.classList.toggle("xterm-cursor-style-bar", value === 'bar');
            break;
        case 'tabStopWidth':
            this.setupStops();
            break;
    }
};
Terminal.prototype.restartCursorBlinking = function () {
    this.setCursorBlinking(this.options.cursorBlink);
};
Terminal.prototype.setCursorBlinking = function (enabled) {
    this.element.classList.toggle('xterm-cursor-blink', enabled);
    this.clearCursorBlinkingInterval();
    if (enabled) {
        var self = this;
        this.cursorBlinkInterval = setInterval(function () {
            self.element.classList.toggle('xterm-cursor-blink-on');
        }, CURSOR_BLINK_INTERVAL);
    }
};
Terminal.prototype.clearCursorBlinkingInterval = function () {
    this.element.classList.remove('xterm-cursor-blink-on');
    if (this.cursorBlinkInterval) {
        clearInterval(this.cursorBlinkInterval);
        this.cursorBlinkInterval = null;
    }
};
Terminal.bindFocus = function (term) {
    on(term.textarea, 'focus', function (ev) {
        if (term.sendFocus) {
            term.send(EscapeSequences_1.C0.ESC + '[I');
        }
        term.element.classList.add('focus');
        term.showCursor();
        term.restartCursorBlinking.apply(term);
        Terminal.focus = term;
        term.emit('focus', { terminal: term });
    });
};
Terminal.prototype.blur = function () {
    return this.textarea.blur();
};
Terminal.bindBlur = function (term) {
    on(term.textarea, 'blur', function (ev) {
        term.refresh(term.buffer.y, term.buffer.y);
        if (term.sendFocus) {
            term.send(EscapeSequences_1.C0.ESC + '[O');
        }
        term.element.classList.remove('focus');
        term.clearCursorBlinkingInterval.apply(term);
        Terminal.focus = null;
        term.emit('blur', { terminal: term });
    });
};
Terminal.prototype.initGlobal = function () {
    var _this = this;
    var term = this;
    Terminal.bindKeys(this);
    Terminal.bindFocus(this);
    Terminal.bindBlur(this);
    on(this.element, 'copy', function (event) {
        if (!term.hasSelection()) {
            return;
        }
        Clipboard_1.copyHandler(event, term, _this.selectionManager);
    });
    var pasteHandlerWrapper = function pasteHandlerWrapper(event) {
        return Clipboard_1.pasteHandler(event, term);
    };
    on(this.textarea, 'paste', pasteHandlerWrapper);
    on(this.element, 'paste', pasteHandlerWrapper);
    if (term.browser.isFirefox) {
        on(this.element, 'mousedown', function (event) {
            if (event.button == 2) {
                Clipboard_1.rightClickHandler(event, _this.textarea, _this.selectionManager);
            }
        });
    } else {
        on(this.element, 'contextmenu', function (event) {
            Clipboard_1.rightClickHandler(event, _this.textarea, _this.selectionManager);
        });
    }
    if (term.browser.isLinux) {
        on(this.element, 'auxclick', function (event) {
            if (event.button === 1) {
                Clipboard_1.moveTextAreaUnderMouseCursor(event, _this.textarea, _this.selectionManager);
            }
        });
    }
};
Terminal.bindKeys = function (term) {
    on(term.element, 'keydown', function (ev) {
        if (document.activeElement != this) {
            return;
        }
        term.keyDown(ev);
    }, true);
    on(term.element, 'keypress', function (ev) {
        if (document.activeElement != this) {
            return;
        }
        term.keyPress(ev);
    }, true);
    on(term.element, 'keyup', function (ev) {
        if (!wasMondifierKeyOnlyEvent(ev)) {
            term.focus(term);
        }
    }, true);
    on(term.textarea, 'keydown', function (ev) {
        term.keyDown(ev);
    }, true);
    on(term.textarea, 'keypress', function (ev) {
        term.keyPress(ev);
        this.value = '';
    }, true);
    on(term.textarea, 'compositionstart', term.compositionHelper.compositionstart.bind(term.compositionHelper));
    on(term.textarea, 'compositionupdate', term.compositionHelper.compositionupdate.bind(term.compositionHelper));
    on(term.textarea, 'compositionend', term.compositionHelper.compositionend.bind(term.compositionHelper));
    term.on('refresh', term.compositionHelper.updateCompositionElements.bind(term.compositionHelper));
    term.on('refresh', function (data) {
        term.queueLinkification(data.start, data.end);
    });
};
Terminal.prototype.insertRow = function (row) {
    if ((typeof row === "undefined" ? "undefined" : _typeof(row)) != 'object') {
        row = document.createElement('div');
    }
    this.rowContainer.appendChild(row);
    this.children.push(row);
    return row;
};
Terminal.prototype.open = function (parent, focus) {
    var _this = this;
    var self = this,
        i = 0,
        div;
    this.parent = parent || this.parent;
    if (!this.parent) {
        throw new Error('Terminal requires a parent element.');
    }
    this.context = this.parent.ownerDocument.defaultView;
    this.document = this.parent.ownerDocument;
    this.body = this.document.getElementsByTagName('body')[0];
    this.element = this.document.createElement('div');
    this.element.classList.add('terminal');
    this.element.classList.add('xterm');
    this.element.classList.add('xterm-theme-' + this.theme);
    this.element.classList.add("xterm-cursor-style-" + this.options.cursorStyle);
    this.setCursorBlinking(this.options.cursorBlink);
    this.element.setAttribute('tabindex', 0);
    this.viewportElement = document.createElement('div');
    this.viewportElement.classList.add('xterm-viewport');
    this.element.appendChild(this.viewportElement);
    this.viewportScrollArea = document.createElement('div');
    this.viewportScrollArea.classList.add('xterm-scroll-area');
    this.viewportElement.appendChild(this.viewportScrollArea);
    this.selectionContainer = document.createElement('div');
    this.selectionContainer.classList.add('xterm-selection');
    this.element.appendChild(this.selectionContainer);
    this.rowContainer = document.createElement('div');
    this.rowContainer.classList.add('xterm-rows');
    this.element.appendChild(this.rowContainer);
    this.children = [];
    this.linkifier.attachToDom(document, this.children);
    this.helperContainer = document.createElement('div');
    this.helperContainer.classList.add('xterm-helpers');
    this.element.appendChild(this.helperContainer);
    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('xterm-helper-textarea');
    this.textarea.setAttribute('autocorrect', 'off');
    this.textarea.setAttribute('autocapitalize', 'off');
    this.textarea.setAttribute('spellcheck', 'false');
    this.textarea.tabIndex = 0;
    this.textarea.addEventListener('focus', function () {
        self.emit('focus', { terminal: self });
    });
    this.textarea.addEventListener('blur', function () {
        self.emit('blur', { terminal: self });
    });
    this.helperContainer.appendChild(this.textarea);
    this.compositionView = document.createElement('div');
    this.compositionView.classList.add('composition-view');
    this.compositionHelper = new CompositionHelper_1.CompositionHelper(this.textarea, this.compositionView, this);
    this.helperContainer.appendChild(this.compositionView);
    this.charSizeStyleElement = document.createElement('style');
    this.helperContainer.appendChild(this.charSizeStyleElement);
    for (; i < this.rows; i++) {
        this.insertRow();
    }
    this.parent.appendChild(this.element);
    this.charMeasure = new CharMeasure_1.CharMeasure(document, this.helperContainer);
    this.charMeasure.on('charsizechanged', function () {
        self.updateCharSizeStyles();
    });
    this.charMeasure.measure();
    this.viewport = new Viewport_1.Viewport(this, this.viewportElement, this.viewportScrollArea, this.charMeasure);
    this.renderer = new Renderer_1.Renderer(this);
    this.selectionManager = new SelectionManager_1.SelectionManager(this, this.buffer.lines, this.rowContainer, this.charMeasure);
    this.selectionManager.on('refresh', function (data) {
        _this.renderer.refreshSelection(data.start, data.end);
    });
    this.selectionManager.on('newselection', function (text) {
        _this.textarea.value = text;
        _this.textarea.focus();
        _this.textarea.select();
    });
    this.on('scroll', function () {
        return _this.selectionManager.refresh();
    });
    this.viewportElement.addEventListener('scroll', function () {
        return _this.selectionManager.refresh();
    });
    this.refresh(0, this.rows - 1);
    this.initGlobal();
    if (typeof focus == 'undefined') {
        var message = 'You did not pass the `focus` argument in `Terminal.prototype.open()`.\n';
        message += 'The `focus` argument now defaults to `true` but starting with xterm.js 3.0 ';
        message += 'it will default to `false`.';
        console.warn(message);
        focus = true;
    }
    if (focus) {
        this.focus();
    }
    this.bindMouse();
    this.emit('open');
};
Terminal.loadAddon = function (addon, callback) {
    if (( false ? "undefined" : _typeof(exports)) === 'object' && ( false ? "undefined" : _typeof(module)) === 'object') {
        return __webpack_require__(11)("./" + addon + '/' + addon);
    } else if (true) {
        return new Promise(function(resolve) { resolve(); }).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(11)("./" + addon + '/' + addon)]; (callback.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this)).catch(__webpack_require__.oe);
    } else {
        console.error('Cannot load a module without a CommonJS or RequireJS environment.');
        return false;
    }
};
Terminal.prototype.updateCharSizeStyles = function () {
    this.charSizeStyleElement.textContent = ".xterm-wide-char{width:" + this.charMeasure.width * 2 + "px;}" + (".xterm-normal-char{width:" + this.charMeasure.width + "px;}") + (".xterm-rows > div{height:" + this.charMeasure.height + "px;}");
};
Terminal.prototype.bindMouse = function () {
    var el = this.element,
        self = this,
        pressed = 32;
    function sendButton(ev) {
        var button, pos;
        button = getButton(ev);
        pos = Mouse_1.getRawByteCoords(ev, self.rowContainer, self.charMeasure, self.cols, self.rows);
        if (!pos) return;
        sendEvent(button, pos);
        switch (ev.overrideType || ev.type) {
            case 'mousedown':
                pressed = button;
                break;
            case 'mouseup':
                pressed = 32;
                break;
            case 'wheel':
                break;
        }
    }
    function sendMove(ev) {
        var button = pressed,
            pos;
        pos = Mouse_1.getRawByteCoords(ev, self.rowContainer, self.charMeasure, self.cols, self.rows);
        if (!pos) return;
        button += 32;
        sendEvent(button, pos);
    }
    function encode(data, ch) {
        if (!self.utfMouse) {
            if (ch === 255) return data.push(0);
            if (ch > 127) ch = 127;
            data.push(ch);
        } else {
            if (ch === 2047) return data.push(0);
            if (ch < 127) {
                data.push(ch);
            } else {
                if (ch > 2047) ch = 2047;
                data.push(0xC0 | ch >> 6);
                data.push(0x80 | ch & 0x3F);
            }
        }
    }
    function sendEvent(button, pos) {
        if (self.vt300Mouse) {
            button &= 3;
            pos.x -= 32;
            pos.y -= 32;
            var data = EscapeSequences_1.C0.ESC + '[24';
            if (button === 0) data += '1';else if (button === 1) data += '3';else if (button === 2) data += '5';else if (button === 3) return;else data += '0';
            data += '~[' + pos.x + ',' + pos.y + ']\r';
            self.send(data);
            return;
        }
        if (self.decLocator) {
            button &= 3;
            pos.x -= 32;
            pos.y -= 32;
            if (button === 0) button = 2;else if (button === 1) button = 4;else if (button === 2) button = 6;else if (button === 3) button = 3;
            self.send(EscapeSequences_1.C0.ESC + '[' + button + ';' + (button === 3 ? 4 : 0) + ';' + pos.y + ';' + pos.x + ';' + (pos.page || 0) + '&w');
            return;
        }
        if (self.urxvtMouse) {
            pos.x -= 32;
            pos.y -= 32;
            pos.x++;
            pos.y++;
            self.send(EscapeSequences_1.C0.ESC + '[' + button + ';' + pos.x + ';' + pos.y + 'M');
            return;
        }
        if (self.sgrMouse) {
            pos.x -= 32;
            pos.y -= 32;
            self.send(EscapeSequences_1.C0.ESC + '[<' + (((button & 3) === 3 ? button & ~3 : button) - 32) + ';' + pos.x + ';' + pos.y + ((button & 3) === 3 ? 'm' : 'M'));
            return;
        }
        var data = [];
        encode(data, button);
        encode(data, pos.x);
        encode(data, pos.y);
        self.send(EscapeSequences_1.C0.ESC + '[M' + String.fromCharCode.apply(String, data));
    }
    function getButton(ev) {
        var button, shift, meta, ctrl, mod;
        switch (ev.overrideType || ev.type) {
            case 'mousedown':
                button = ev.button != null ? +ev.button : ev.which != null ? ev.which - 1 : null;
                if (self.browser.isMSIE) {
                    button = button === 1 ? 0 : button === 4 ? 1 : button;
                }
                break;
            case 'mouseup':
                button = 3;
                break;
            case 'DOMMouseScroll':
                button = ev.detail < 0 ? 64 : 65;
                break;
            case 'wheel':
                button = ev.wheelDeltaY > 0 ? 64 : 65;
                break;
        }
        shift = ev.shiftKey ? 4 : 0;
        meta = ev.metaKey ? 8 : 0;
        ctrl = ev.ctrlKey ? 16 : 0;
        mod = shift | meta | ctrl;
        if (self.vt200Mouse) {
            mod &= ctrl;
        } else if (!self.normalMouse) {
            mod = 0;
        }
        button = 32 + (mod << 2) + button;
        return button;
    }
    on(el, 'mousedown', function (ev) {
        ev.preventDefault();
        self.focus();
        if (!self.mouseEvents) return;
        sendButton(ev);
        if (self.vt200Mouse) {
            ev.overrideType = 'mouseup';
            sendButton(ev);
            return self.cancel(ev);
        }
        if (self.normalMouse) on(self.document, 'mousemove', sendMove);
        if (!self.x10Mouse) {
            on(self.document, 'mouseup', function up(ev) {
                sendButton(ev);
                if (self.normalMouse) off(self.document, 'mousemove', sendMove);
                off(self.document, 'mouseup', up);
                return self.cancel(ev);
            });
        }
        return self.cancel(ev);
    });
    on(el, 'wheel', function (ev) {
        if (!self.mouseEvents) return;
        if (self.x10Mouse || self.vt300Mouse || self.decLocator) return;
        sendButton(ev);
        return self.cancel(ev);
    });
    on(el, 'wheel', function (ev) {
        if (self.mouseEvents) return;
        self.viewport.onWheel(ev);
        return self.cancel(ev);
    });
    on(el, 'touchstart', function (ev) {
        if (self.mouseEvents) return;
        self.viewport.onTouchStart(ev);
        return self.cancel(ev);
    });
    on(el, 'touchmove', function (ev) {
        if (self.mouseEvents) return;
        self.viewport.onTouchMove(ev);
        return self.cancel(ev);
    });
};
Terminal.prototype.destroy = function () {
    this.readable = false;
    this.writable = false;
    this._events = {};
    this.handler = function () {};
    this.write = function () {};
    if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
    }
};
Terminal.prototype.refresh = function (start, end) {
    if (this.renderer) {
        this.renderer.queueRefresh(start, end);
    }
};
Terminal.prototype.queueLinkification = function (start, end) {
    if (this.linkifier) {
        for (var i = start; i <= end; i++) {
            this.linkifier.linkifyRow(i);
        }
    }
};
Terminal.prototype.showCursor = function () {
    if (!this.cursorState) {
        this.cursorState = 1;
        this.refresh(this.buffer.y, this.buffer.y);
    }
};
Terminal.prototype.scroll = function (isWrapped) {
    var row;
    if (this.buffer.lines.length === this.buffer.lines.maxLength) {
        this.buffer.lines.trimStart(1);
        this.buffer.ybase--;
        if (this.buffer.ydisp !== 0) {
            this.buffer.ydisp--;
        }
    }
    this.buffer.ybase++;
    if (!this.userScrolling) {
        this.buffer.ydisp = this.buffer.ybase;
    }
    row = this.buffer.ybase + this.rows - 1;
    row -= this.rows - 1 - this.buffer.scrollBottom;
    if (row === this.buffer.lines.length) {
        this.buffer.lines.push(this.blankLine(undefined, isWrapped));
    } else {
        this.buffer.lines.splice(row, 0, this.blankLine(undefined, isWrapped));
    }
    if (this.buffer.scrollTop !== 0) {
        if (this.buffer.ybase !== 0) {
            this.buffer.ybase--;
            if (!this.userScrolling) {
                this.buffer.ydisp = this.buffer.ybase;
            }
        }
        this.buffer.lines.splice(this.buffer.ybase + this.buffer.scrollTop, 1);
    }
    this.updateRange(this.buffer.scrollTop);
    this.updateRange(this.buffer.scrollBottom);
    this.emit('scroll', this.buffer.ydisp);
};
Terminal.prototype.scrollDisp = function (disp, suppressScrollEvent) {
    if (disp < 0) {
        if (this.buffer.ydisp === 0) {
            return;
        }
        this.userScrolling = true;
    } else if (disp + this.buffer.ydisp >= this.buffer.ybase) {
        this.userScrolling = false;
    }
    var oldYdisp = this.buffer.ydisp;
    this.buffer.ydisp = Math.max(Math.min(this.buffer.ydisp + disp, this.buffer.ybase), 0);
    if (oldYdisp === this.buffer.ydisp) {
        return;
    }
    if (!suppressScrollEvent) {
        this.emit('scroll', this.buffer.ydisp);
    }
    this.refresh(0, this.rows - 1);
};
Terminal.prototype.scrollPages = function (pageCount) {
    this.scrollDisp(pageCount * (this.rows - 1));
};
Terminal.prototype.scrollToTop = function () {
    this.scrollDisp(-this.buffer.ydisp);
};
Terminal.prototype.scrollToBottom = function () {
    this.scrollDisp(this.buffer.ybase - this.buffer.ydisp);
};
Terminal.prototype.write = function (data) {
    this.writeBuffer.push(data);
    if (this.options.useFlowControl && !this.xoffSentToCatchUp && this.writeBuffer.length >= WRITE_BUFFER_PAUSE_THRESHOLD) {
        this.send(EscapeSequences_1.C0.DC3);
        this.xoffSentToCatchUp = true;
    }
    if (!this.writeInProgress && this.writeBuffer.length > 0) {
        this.writeInProgress = true;
        var self = this;
        setTimeout(function () {
            self.innerWrite();
        });
    }
};
Terminal.prototype.innerWrite = function () {
    var writeBatch = this.writeBuffer.splice(0, WRITE_BATCH_SIZE);
    while (writeBatch.length > 0) {
        var data = writeBatch.shift();
        var l = data.length,
            i = 0,
            j,
            cs,
            ch,
            code,
            low,
            ch_width,
            row;
        if (this.xoffSentToCatchUp && writeBatch.length === 0 && this.writeBuffer.length === 0) {
            this.send(EscapeSequences_1.C0.DC1);
            this.xoffSentToCatchUp = false;
        }
        this.refreshStart = this.buffer.y;
        this.refreshEnd = this.buffer.y;
        var state = this.parser.parse(data);
        this.parser.setState(state);
        this.updateRange(this.buffer.y);
        this.refresh(this.refreshStart, this.refreshEnd);
    }
    if (this.writeBuffer.length > 0) {
        var self = this;
        setTimeout(function () {
            self.innerWrite();
        }, 0);
    } else {
        this.writeInProgress = false;
    }
};
Terminal.prototype.writeln = function (data) {
    this.write(data + '\r\n');
};
Terminal.prototype.attachCustomKeydownHandler = function (customKeydownHandler) {
    var message = 'attachCustomKeydownHandler() is DEPRECATED and will be removed soon. Please use attachCustomKeyEventHandler() instead.';
    console.warn(message);
    this.attachCustomKeyEventHandler(customKeydownHandler);
};
Terminal.prototype.attachCustomKeyEventHandler = function (customKeyEventHandler) {
    this.customKeyEventHandler = customKeyEventHandler;
};
Terminal.prototype.setHypertextLinkHandler = function (handler) {
    if (!this.linkifier) {
        throw new Error('Cannot attach a hypertext link handler before Terminal.open is called');
    }
    this.linkifier.setHypertextLinkHandler(handler);
    this.refresh(0, this.rows - 1);
};
Terminal.prototype.setHypertextValidationCallback = function (callback) {
    if (!this.linkifier) {
        throw new Error('Cannot attach a hypertext validation callback before Terminal.open is called');
    }
    this.linkifier.setHypertextValidationCallback(callback);
    this.refresh(0, this.rows - 1);
};
Terminal.prototype.registerLinkMatcher = function (regex, handler, options) {
    if (this.linkifier) {
        var matcherId = this.linkifier.registerLinkMatcher(regex, handler, options);
        this.refresh(0, this.rows - 1);
        return matcherId;
    }
};
Terminal.prototype.deregisterLinkMatcher = function (matcherId) {
    if (this.linkifier) {
        if (this.linkifier.deregisterLinkMatcher(matcherId)) {
            this.refresh(0, this.rows - 1);
        }
    }
};
Terminal.prototype.hasSelection = function () {
    return this.selectionManager ? this.selectionManager.hasSelection : false;
};
Terminal.prototype.getSelection = function () {
    return this.selectionManager ? this.selectionManager.selectionText : '';
};
Terminal.prototype.clearSelection = function () {
    if (this.selectionManager) {
        this.selectionManager.clearSelection();
    }
};
Terminal.prototype.selectAll = function () {
    if (this.selectionManager) {
        this.selectionManager.selectAll();
    }
};
Terminal.prototype.keyDown = function (ev) {
    if (this.customKeyEventHandler && this.customKeyEventHandler(ev) === false) {
        return false;
    }
    this.restartCursorBlinking();
    if (!this.compositionHelper.keydown.bind(this.compositionHelper)(ev)) {
        if (this.buffer.ybase !== this.buffer.ydisp) {
            this.scrollToBottom();
        }
        return false;
    }
    var self = this;
    var result = this.evaluateKeyEscapeSequence(ev);
    if (result.key === EscapeSequences_1.C0.DC3) {
        this.writeStopped = true;
    } else if (result.key === EscapeSequences_1.C0.DC1) {
        this.writeStopped = false;
    }
    if (result.scrollDisp) {
        this.scrollDisp(result.scrollDisp);
        return this.cancel(ev, true);
    }
    if (isThirdLevelShift(this, ev)) {
        return true;
    }
    if (result.cancel) {
        this.cancel(ev, true);
    }
    if (!result.key) {
        return true;
    }
    this.emit('keydown', ev);
    this.emit('key', result.key, ev);
    this.showCursor();
    this.handler(result.key);
    return this.cancel(ev, true);
};
Terminal.prototype.evaluateKeyEscapeSequence = function (ev) {
    var result = {
        cancel: false,
        key: undefined,
        scrollDisp: undefined
    };
    var modifiers = ev.shiftKey << 0 | ev.altKey << 1 | ev.ctrlKey << 2 | ev.metaKey << 3;
    switch (ev.keyCode) {
        case 8:
            if (ev.shiftKey) {
                result.key = EscapeSequences_1.C0.BS;
                break;
            }
            result.key = EscapeSequences_1.C0.DEL;
            break;
        case 9:
            if (ev.shiftKey) {
                result.key = EscapeSequences_1.C0.ESC + '[Z';
                break;
            }
            result.key = EscapeSequences_1.C0.HT;
            result.cancel = true;
            break;
        case 13:
            result.key = EscapeSequences_1.C0.CR;
            result.cancel = true;
            break;
        case 27:
            result.key = EscapeSequences_1.C0.ESC;
            result.cancel = true;
            break;
        case 37:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'D';
                if (result.key == EscapeSequences_1.C0.ESC + '[1;3D') {
                    result.key = this.browser.isMac ? EscapeSequences_1.C0.ESC + 'b' : EscapeSequences_1.C0.ESC + '[1;5D';
                }
            } else if (this.applicationCursor) {
                result.key = EscapeSequences_1.C0.ESC + 'OD';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[D';
            }
            break;
        case 39:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'C';
                if (result.key == EscapeSequences_1.C0.ESC + '[1;3C') {
                    result.key = this.browser.isMac ? EscapeSequences_1.C0.ESC + 'f' : EscapeSequences_1.C0.ESC + '[1;5C';
                }
            } else if (this.applicationCursor) {
                result.key = EscapeSequences_1.C0.ESC + 'OC';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[C';
            }
            break;
        case 38:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'A';
                if (result.key == EscapeSequences_1.C0.ESC + '[1;3A') {
                    result.key = EscapeSequences_1.C0.ESC + '[1;5A';
                }
            } else if (this.applicationCursor) {
                result.key = EscapeSequences_1.C0.ESC + 'OA';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[A';
            }
            break;
        case 40:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'B';
                if (result.key == EscapeSequences_1.C0.ESC + '[1;3B') {
                    result.key = EscapeSequences_1.C0.ESC + '[1;5B';
                }
            } else if (this.applicationCursor) {
                result.key = EscapeSequences_1.C0.ESC + 'OB';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[B';
            }
            break;
        case 45:
            if (!ev.shiftKey && !ev.ctrlKey) {
                result.key = EscapeSequences_1.C0.ESC + '[2~';
            }
            break;
        case 46:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[3;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[3~';
            }
            break;
        case 36:
            if (modifiers) result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'H';else if (this.applicationCursor) result.key = EscapeSequences_1.C0.ESC + 'OH';else result.key = EscapeSequences_1.C0.ESC + '[H';
            break;
        case 35:
            if (modifiers) result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'F';else if (this.applicationCursor) result.key = EscapeSequences_1.C0.ESC + 'OF';else result.key = EscapeSequences_1.C0.ESC + '[F';
            break;
        case 33:
            if (ev.shiftKey) {
                result.scrollDisp = -(this.rows - 1);
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[5~';
            }
            break;
        case 34:
            if (ev.shiftKey) {
                result.scrollDisp = this.rows - 1;
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[6~';
            }
            break;
        case 112:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'P';
            } else {
                result.key = EscapeSequences_1.C0.ESC + 'OP';
            }
            break;
        case 113:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'Q';
            } else {
                result.key = EscapeSequences_1.C0.ESC + 'OQ';
            }
            break;
        case 114:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'R';
            } else {
                result.key = EscapeSequences_1.C0.ESC + 'OR';
            }
            break;
        case 115:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[1;' + (modifiers + 1) + 'S';
            } else {
                result.key = EscapeSequences_1.C0.ESC + 'OS';
            }
            break;
        case 116:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[15;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[15~';
            }
            break;
        case 117:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[17;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[17~';
            }
            break;
        case 118:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[18;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[18~';
            }
            break;
        case 119:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[19;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[19~';
            }
            break;
        case 120:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[20;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[20~';
            }
            break;
        case 121:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[21;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[21~';
            }
            break;
        case 122:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[23;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[23~';
            }
            break;
        case 123:
            if (modifiers) {
                result.key = EscapeSequences_1.C0.ESC + '[24;' + (modifiers + 1) + '~';
            } else {
                result.key = EscapeSequences_1.C0.ESC + '[24~';
            }
            break;
        default:
            if (ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey) {
                if (ev.keyCode >= 65 && ev.keyCode <= 90) {
                    result.key = String.fromCharCode(ev.keyCode - 64);
                } else if (ev.keyCode === 32) {
                    result.key = String.fromCharCode(0);
                } else if (ev.keyCode >= 51 && ev.keyCode <= 55) {
                    result.key = String.fromCharCode(ev.keyCode - 51 + 27);
                } else if (ev.keyCode === 56) {
                    result.key = String.fromCharCode(127);
                } else if (ev.keyCode === 219) {
                    result.key = String.fromCharCode(27);
                } else if (ev.keyCode === 220) {
                    result.key = String.fromCharCode(28);
                } else if (ev.keyCode === 221) {
                    result.key = String.fromCharCode(29);
                }
            } else if (!this.browser.isMac && ev.altKey && !ev.ctrlKey && !ev.metaKey) {
                if (ev.keyCode >= 65 && ev.keyCode <= 90) {
                    result.key = EscapeSequences_1.C0.ESC + String.fromCharCode(ev.keyCode + 32);
                } else if (ev.keyCode === 192) {
                    result.key = EscapeSequences_1.C0.ESC + '`';
                } else if (ev.keyCode >= 48 && ev.keyCode <= 57) {
                    result.key = EscapeSequences_1.C0.ESC + (ev.keyCode - 48);
                }
            } else if (this.browser.isMac && !ev.altKey && !ev.ctrlKey && ev.metaKey) {
                if (ev.keyCode === 65) {
                    this.selectAll();
                }
            }
            break;
    }
    return result;
};
Terminal.prototype.setgLevel = function (g) {
    this.glevel = g;
    this.charset = this.charsets[g];
};
Terminal.prototype.setgCharset = function (g, charset) {
    this.charsets[g] = charset;
    if (this.glevel === g) {
        this.charset = charset;
    }
};
Terminal.prototype.keyPress = function (ev) {
    var key;
    if (this.customKeyEventHandler && this.customKeyEventHandler(ev) === false) {
        return false;
    }
    this.cancel(ev);
    if (ev.charCode) {
        key = ev.charCode;
    } else if (ev.which == null) {
        key = ev.keyCode;
    } else if (ev.which !== 0 && ev.charCode !== 0) {
        key = ev.which;
    } else {
        return false;
    }
    if (!key || (ev.altKey || ev.ctrlKey || ev.metaKey) && !isThirdLevelShift(this, ev)) {
        return false;
    }
    key = String.fromCharCode(key);
    this.emit('keypress', key, ev);
    this.emit('key', key, ev);
    this.showCursor();
    this.handler(key);
    return true;
};
Terminal.prototype.send = function (data) {
    var self = this;
    if (!this.queue) {
        setTimeout(function () {
            self.handler(self.queue);
            self.queue = '';
        }, 1);
    }
    this.queue += data;
};
Terminal.prototype.bell = function () {
    if (!this.visualBell) return;
    var self = this;
    this.element.style.borderColor = 'white';
    setTimeout(function () {
        self.element.style.borderColor = '';
    }, 10);
    if (this.popOnBell) this.focus();
};
Terminal.prototype.log = function () {
    if (!this.debug) return;
    if (!this.context.console || !this.context.console.log) return;
    var args = Array.prototype.slice.call(arguments);
    this.context.console.log.apply(this.context.console, args);
};
Terminal.prototype.error = function () {
    if (!this.debug) return;
    if (!this.context.console || !this.context.console.error) return;
    var args = Array.prototype.slice.call(arguments);
    this.context.console.error.apply(this.context.console, args);
};
Terminal.prototype.resize = function (x, y) {
    if (isNaN(x) || isNaN(y)) {
        return;
    }
    if (y > this.getOption('scrollback')) {
        this.setOption('scrollback', y);
    }
    var line, el, i, j, ch, addToY;
    if (x === this.cols && y === this.rows) {
        if (!this.charMeasure.width || !this.charMeasure.height) {
            this.charMeasure.measure();
        }
        return;
    }
    if (x < 1) x = 1;
    if (y < 1) y = 1;
    this.buffers.resize(x, y);
    while (this.children.length < y) {
        this.insertRow();
    }
    while (this.children.length > y) {
        el = this.children.shift();
        if (!el) continue;
        el.parentNode.removeChild(el);
    }
    this.cols = x;
    this.rows = y;
    this.setupStops(this.cols);
    this.charMeasure.measure();
    this.refresh(0, this.rows - 1);
    this.geometry = [this.cols, this.rows];
    this.emit('resize', { terminal: this, cols: x, rows: y });
};
Terminal.prototype.updateRange = function (y) {
    if (y < this.refreshStart) this.refreshStart = y;
    if (y > this.refreshEnd) this.refreshEnd = y;
};
Terminal.prototype.maxRange = function () {
    this.refreshStart = 0;
    this.refreshEnd = this.rows - 1;
};
Terminal.prototype.setupStops = function (i) {
    if (i != null) {
        if (!this.buffer.tabs[i]) {
            i = this.prevStop(i);
        }
    } else {
        this.buffer.tabs = {};
        i = 0;
    }
    for (; i < this.cols; i += this.getOption('tabStopWidth')) {
        this.buffer.tabs[i] = true;
    }
};
Terminal.prototype.prevStop = function (x) {
    if (x == null) x = this.buffer.x;
    while (!this.buffer.tabs[--x] && x > 0) {}
    return x >= this.cols ? this.cols - 1 : x < 0 ? 0 : x;
};
Terminal.prototype.nextStop = function (x) {
    if (x == null) x = this.buffer.x;
    while (!this.buffer.tabs[++x] && x < this.cols) {}
    return x >= this.cols ? this.cols - 1 : x < 0 ? 0 : x;
};
Terminal.prototype.eraseRight = function (x, y) {
    var line = this.buffer.lines.get(this.buffer.ybase + y);
    if (!line) {
        return;
    }
    var ch = [this.eraseAttr(), ' ', 1];
    for (; x < this.cols; x++) {
        line[x] = ch;
    }
    this.updateRange(y);
};
Terminal.prototype.eraseLeft = function (x, y) {
    var line = this.buffer.lines.get(this.buffer.ybase + y);
    if (!line) {
        return;
    }
    var ch = [this.eraseAttr(), ' ', 1];
    x++;
    while (x--) {
        line[x] = ch;
    }
    this.updateRange(y);
};
Terminal.prototype.clear = function () {
    if (this.buffer.ybase === 0 && this.buffer.y === 0) {
        return;
    }
    this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y));
    this.buffer.lines.length = 1;
    this.buffer.ydisp = 0;
    this.buffer.ybase = 0;
    this.buffer.y = 0;
    for (var i = 1; i < this.rows; i++) {
        this.buffer.lines.push(this.blankLine());
    }
    this.refresh(0, this.rows - 1);
    this.emit('scroll', this.buffer.ydisp);
};
Terminal.prototype.eraseLine = function (y) {
    this.eraseRight(0, y);
};
Terminal.prototype.blankLine = function (cur, isWrapped, cols) {
    var attr = cur ? this.eraseAttr() : this.defAttr;
    var ch = [attr, ' ', 1],
        line = [],
        i = 0;
    if (isWrapped) {
        line.isWrapped = isWrapped;
    }
    cols = cols || this.cols;
    for (; i < cols; i++) {
        line[i] = ch;
    }
    return line;
};
Terminal.prototype.ch = function (cur) {
    return cur ? [this.eraseAttr(), ' ', 1] : [this.defAttr, ' ', 1];
};
Terminal.prototype.is = function (term) {
    var name = this.termName;
    return (name + '').indexOf(term) === 0;
};
Terminal.prototype.handler = function (data) {
    if (this.options.disableStdin) {
        return;
    }
    if (this.selectionManager && this.selectionManager.hasSelection) {
        this.selectionManager.clearSelection();
    }
    if (this.buffer.ybase !== this.buffer.ydisp) {
        this.scrollToBottom();
    }
    this.emit('data', data);
};
Terminal.prototype.handleTitle = function (title) {
    this.emit('title', title);
};
Terminal.prototype.index = function () {
    this.buffer.y++;
    if (this.buffer.y > this.buffer.scrollBottom) {
        this.buffer.y--;
        this.scroll();
    }
    if (this.buffer.x >= this.cols) {
        this.buffer.x--;
    }
};
Terminal.prototype.reverseIndex = function () {
    var j;
    if (this.buffer.y === this.buffer.scrollTop) {
        this.buffer.lines.shiftElements(this.buffer.y + this.buffer.ybase, this.rows - 1, 1);
        this.buffer.lines.set(this.buffer.y + this.buffer.ybase, this.blankLine(true));
        this.updateRange(this.buffer.scrollTop);
        this.updateRange(this.buffer.scrollBottom);
    } else {
        this.buffer.y--;
    }
};
Terminal.prototype.reset = function () {
    this.options.rows = this.rows;
    this.options.cols = this.cols;
    var customKeyEventHandler = this.customKeyEventHandler;
    var cursorBlinkInterval = this.cursorBlinkInterval;
    var inputHandler = this.inputHandler;
    Terminal.call(this, this.options);
    this.customKeyEventHandler = customKeyEventHandler;
    this.cursorBlinkInterval = cursorBlinkInterval;
    this.inputHandler = inputHandler;
    this.refresh(0, this.rows - 1);
    this.viewport.syncScrollArea();
};
Terminal.prototype.tabSet = function () {
    this.buffer.tabs[this.buffer.x] = true;
};
function on(el, type, handler, capture) {
    if (!Array.isArray(el)) {
        el = [el];
    }
    el.forEach(function (element) {
        element.addEventListener(type, handler, capture || false);
    });
}
function off(el, type, handler, capture) {
    el.removeEventListener(type, handler, capture || false);
}
function cancel(ev, force) {
    if (!this.cancelEvents && !force) {
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    return false;
}
function inherits(child, parent) {
    function f() {
        this.constructor = child;
    }
    f.prototype = parent.prototype;
    child.prototype = new f();
}
function indexOf(obj, el) {
    var i = obj.length;
    while (i--) {
        if (obj[i] === el) return i;
    }
    return -1;
}
function isThirdLevelShift(term, ev) {
    var thirdLevelKey = term.browser.isMac && ev.altKey && !ev.ctrlKey && !ev.metaKey || term.browser.isMSWindows && ev.altKey && ev.ctrlKey && !ev.metaKey;
    if (ev.type == 'keypress') {
        return thirdLevelKey;
    }
    return thirdLevelKey && (!ev.keyCode || ev.keyCode > 47);
}
Terminal.prototype.matchColor = matchColor;
function matchColor(r1, g1, b1) {
    var hash = r1 << 16 | g1 << 8 | b1;
    if (matchColor._cache[hash] != null) {
        return matchColor._cache[hash];
    }
    var ldiff = Infinity,
        li = -1,
        i = 0,
        c,
        r2,
        g2,
        b2,
        diff;
    for (; i < Terminal.vcolors.length; i++) {
        c = Terminal.vcolors[i];
        r2 = c[0];
        g2 = c[1];
        b2 = c[2];
        diff = matchColor.distance(r1, g1, b1, r2, g2, b2);
        if (diff === 0) {
            li = i;
            break;
        }
        if (diff < ldiff) {
            ldiff = diff;
            li = i;
        }
    }
    return matchColor._cache[hash] = li;
}
matchColor._cache = {};
matchColor.distance = function (r1, g1, b1, r2, g2, b2) {
    return Math.pow(30 * (r1 - r2), 2) + Math.pow(59 * (g1 - g2), 2) + Math.pow(11 * (b1 - b2), 2);
};
function each(obj, iter, con) {
    if (obj.forEach) return obj.forEach(iter, con);
    for (var i = 0; i < obj.length; i++) {
        iter.call(con, obj[i], i, obj);
    }
}
function wasMondifierKeyOnlyEvent(ev) {
    return ev.keyCode === 16 || ev.keyCode === 17 || ev.keyCode === 18;
}
function keys(obj) {
    if (Object.keys) return Object.keys(obj);
    var key,
        keys = [];
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
}
Terminal.translateBufferLineToString = BufferLine_1.translateBufferLineToString;
Terminal.EventEmitter = EventEmitter_1.EventEmitter;
Terminal.inherits = inherits;
Terminal.on = on;
Terminal.off = off;
Terminal.cancel = cancel;
module.exports = Terminal;

//# sourceMappingURL=xterm.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
;
var EventEmitter = function () {
    function EventEmitter() {
        this._events = this._events || {};
    }
    EventEmitter.prototype.on = function (type, listener) {
        this._events[type] = this._events[type] || [];
        this._events[type].push(listener);
    };
    EventEmitter.prototype.off = function (type, listener) {
        if (!this._events[type]) {
            return;
        }
        var obj = this._events[type];
        var i = obj.length;
        while (i--) {
            if (obj[i] === listener || obj[i].listener === listener) {
                obj.splice(i, 1);
                return;
            }
        }
    };
    EventEmitter.prototype.removeAllListeners = function (type) {
        if (this._events[type]) {
            delete this._events[type];
        }
    };
    EventEmitter.prototype.once = function (type, listener) {
        function on() {
            var args = Array.prototype.slice.call(arguments);
            this.off(type, on);
            return listener.apply(this, args);
        }
        on.listener = listener;
        return this.on(type, on);
    };
    EventEmitter.prototype.emit = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this._events[type]) {
            return;
        }
        var obj = this._events[type];
        for (var i = 0; i < obj.length; i++) {
            obj[i].apply(this, args);
        }
    };
    EventEmitter.prototype.listeners = function (type) {
        return this._events[type] || [];
    };
    return EventEmitter;
}();
exports.EventEmitter = EventEmitter;

//# sourceMappingURL=EventEmitter.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var C0;
(function (C0) {
    C0.NUL = '\x00';
    C0.SOH = '\x01';
    C0.STX = '\x02';
    C0.ETX = '\x03';
    C0.EOT = '\x04';
    C0.ENQ = '\x05';
    C0.ACK = '\x06';
    C0.BEL = '\x07';
    C0.BS = '\x08';
    C0.HT = '\x09';
    C0.LF = '\x0a';
    C0.VT = '\x0b';
    C0.FF = '\x0c';
    C0.CR = '\x0d';
    C0.SO = '\x0e';
    C0.SI = '\x0f';
    C0.DLE = '\x10';
    C0.DC1 = '\x11';
    C0.DC2 = '\x12';
    C0.DC3 = '\x13';
    C0.DC4 = '\x14';
    C0.NAK = '\x15';
    C0.SYN = '\x16';
    C0.ETB = '\x17';
    C0.CAN = '\x18';
    C0.EM = '\x19';
    C0.SUB = '\x1a';
    C0.ESC = '\x1b';
    C0.FS = '\x1c';
    C0.GS = '\x1d';
    C0.RS = '\x1e';
    C0.US = '\x1f';
    C0.SP = '\x20';
    C0.DEL = '\x7f';
})(C0 = exports.C0 || (exports.C0 = {}));
;

//# sourceMappingURL=EscapeSequences.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var SearchHelper = function () {
    function SearchHelper(_terminal, _translateBufferLineToString) {
        this._terminal = _terminal;
        this._translateBufferLineToString = _translateBufferLineToString;
    }
    SearchHelper.prototype.findNext = function (term) {
        if (!term || term.length === 0) {
            return false;
        }
        var result;
        var startRow = this._terminal.buffer.ydisp;
        if (this._terminal.selectionManager.selectionEnd) {
            startRow = this._terminal.selectionManager.selectionEnd[1];
        }
        for (var y = startRow + 1; y < this._terminal.buffer.ybase + this._terminal.rows; y++) {
            result = this._findInLine(term, y);
            if (result) {
                break;
            }
        }
        if (!result) {
            for (var y = 0; y < startRow; y++) {
                result = this._findInLine(term, y);
                if (result) {
                    break;
                }
            }
        }
        return this._selectResult(result);
    };
    SearchHelper.prototype.findPrevious = function (term) {
        if (!term || term.length === 0) {
            return false;
        }
        var result;
        var startRow = this._terminal.buffer.ydisp;
        if (this._terminal.selectionManager.selectionStart) {
            startRow = this._terminal.selectionManager.selectionStart[1];
        }
        for (var y = startRow - 1; y >= 0; y--) {
            result = this._findInLine(term, y);
            if (result) {
                break;
            }
        }
        if (!result) {
            for (var y = this._terminal.buffer.ybase + this._terminal.rows - 1; y > startRow; y--) {
                result = this._findInLine(term, y);
                if (result) {
                    break;
                }
            }
        }
        return this._selectResult(result);
    };
    SearchHelper.prototype._findInLine = function (term, y) {
        var bufferLine = this._terminal.buffer.lines.get(y);
        var lowerStringLine = this._translateBufferLineToString(bufferLine, true).toLowerCase();
        var lowerTerm = term.toLowerCase();
        var searchIndex = lowerStringLine.indexOf(lowerTerm);
        if (searchIndex >= 0) {
            return {
                term: term,
                col: searchIndex,
                row: y
            };
        }
    };
    SearchHelper.prototype._selectResult = function (result) {
        if (!result) {
            return false;
        }
        this._terminal.selectionManager.setSelection(result.col, result.row, result.term.length);
        this._terminal.scrollDisp(result.row - this._terminal.buffer.ydisp, false);
        return true;
    };
    return SearchHelper;
}();
exports.SearchHelper = SearchHelper;

//# sourceMappingURL=SearchHelper.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(25);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.CHARSETS = {};
exports.DEFAULT_CHARSET = exports.CHARSETS['B'];
exports.CHARSETS['0'] = {
    '`': "\u25C6",
    'a': "\u2592",
    'b': "\t",
    'c': "\f",
    'd': "\r",
    'e': "\n",
    'f': "\xB0",
    'g': "\xB1",
    'h': "\u2424",
    'i': "\x0B",
    'j': "\u2518",
    'k': "\u2510",
    'l': "\u250C",
    'm': "\u2514",
    'n': "\u253C",
    'o': "\u23BA",
    'p': "\u23BB",
    'q': "\u2500",
    'r': "\u23BC",
    's': "\u23BD",
    't': "\u251C",
    'u': "\u2524",
    'v': "\u2534",
    'w': "\u252C",
    'x': "\u2502",
    'y': "\u2264",
    'z': "\u2265",
    '{': "\u03C0",
    '|': "\u2260",
    '}': "\xA3",
    '~': "\xB7"
};
exports.CHARSETS['A'] = {
    '#': '£'
};
exports.CHARSETS['B'] = null;
exports.CHARSETS['4'] = {
    '#': '£',
    '@': '¾',
    '[': 'ij',
    '\\': '½',
    ']': '|',
    '{': '¨',
    '|': 'f',
    '}': '¼',
    '~': '´'
};
exports.CHARSETS['C'] = exports.CHARSETS['5'] = {
    '[': 'Ä',
    '\\': 'Ö',
    ']': 'Å',
    '^': 'Ü',
    '`': 'é',
    '{': 'ä',
    '|': 'ö',
    '}': 'å',
    '~': 'ü'
};
exports.CHARSETS['R'] = {
    '#': '£',
    '@': 'à',
    '[': '°',
    '\\': 'ç',
    ']': '§',
    '{': 'é',
    '|': 'ù',
    '}': 'è',
    '~': '¨'
};
exports.CHARSETS['Q'] = {
    '@': 'à',
    '[': 'â',
    '\\': 'ç',
    ']': 'ê',
    '^': 'î',
    '`': 'ô',
    '{': 'é',
    '|': 'ù',
    '}': 'è',
    '~': 'û'
};
exports.CHARSETS['K'] = {
    '@': '§',
    '[': 'Ä',
    '\\': 'Ö',
    ']': 'Ü',
    '{': 'ä',
    '|': 'ö',
    '}': 'ü',
    '~': 'ß'
};
exports.CHARSETS['Y'] = {
    '#': '£',
    '@': '§',
    '[': '°',
    '\\': 'ç',
    ']': 'é',
    '`': 'ù',
    '{': 'à',
    '|': 'ò',
    '}': 'è',
    '~': 'ì'
};
exports.CHARSETS['E'] = exports.CHARSETS['6'] = {
    '@': 'Ä',
    '[': 'Æ',
    '\\': 'Ø',
    ']': 'Å',
    '^': 'Ü',
    '`': 'ä',
    '{': 'æ',
    '|': 'ø',
    '}': 'å',
    '~': 'ü'
};
exports.CHARSETS['Z'] = {
    '#': '£',
    '@': '§',
    '[': '¡',
    '\\': 'Ñ',
    ']': '¿',
    '{': '°',
    '|': 'ñ',
    '}': 'ç'
};
exports.CHARSETS['H'] = exports.CHARSETS['7'] = {
    '@': 'É',
    '[': 'Ä',
    '\\': 'Ö',
    ']': 'Å',
    '^': 'Ü',
    '`': 'é',
    '{': 'ä',
    '|': 'ö',
    '}': 'å',
    '~': 'ü'
};
exports.CHARSETS['='] = {
    '#': 'ù',
    '@': 'à',
    '[': 'é',
    '\\': 'ç',
    ']': 'ê',
    '^': 'î',
    '_': 'è',
    '`': 'ô',
    '{': 'ä',
    '|': 'ö',
    '}': 'ü',
    '~': 'û'
};

//# sourceMappingURL=Charsets.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function getCoordsRelativeToElement(event, element) {
    if (event.pageX == null) {
        return null;
    }
    var x = event.pageX;
    var y = event.pageY;
    while (element && element !== self.document.documentElement) {
        x -= element.offsetLeft;
        y -= element.offsetTop;
        element = 'offsetParent' in element ? element.offsetParent : element.parentElement;
    }
    return [x, y];
}
exports.getCoordsRelativeToElement = getCoordsRelativeToElement;
function getCoords(event, rowContainer, charMeasure, colCount, rowCount, isSelection) {
    if (!charMeasure.width || !charMeasure.height) {
        return null;
    }
    var coords = getCoordsRelativeToElement(event, rowContainer);
    if (!coords) {
        return null;
    }
    coords[0] = Math.ceil((coords[0] + (isSelection ? charMeasure.width / 2 : 0)) / charMeasure.width);
    coords[1] = Math.ceil(coords[1] / charMeasure.height);
    coords[0] = Math.min(Math.max(coords[0], 1), colCount + 1);
    coords[1] = Math.min(Math.max(coords[1], 1), rowCount + 1);
    return coords;
}
exports.getCoords = getCoords;
function getRawByteCoords(event, rowContainer, charMeasure, colCount, rowCount) {
    var coords = getCoords(event, rowContainer, charMeasure, colCount, rowCount);
    var x = coords[0];
    var y = coords[1];
    x += 32;
    y += 32;
    return { x: x, y: y };
}
exports.getRawByteCoords = getRawByteCoords;

//# sourceMappingURL=Mouse.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Generic_1 = __webpack_require__(38);
var isNode = typeof navigator === 'undefined' ? true : false;
var userAgent = isNode ? 'node' : navigator.userAgent;
var platform = isNode ? 'node' : navigator.platform;
exports.isFirefox = !!~userAgent.indexOf('Firefox');
exports.isMSIE = !!~userAgent.indexOf('MSIE') || !!~userAgent.indexOf('Trident');
exports.isMac = Generic_1.contains(['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'], platform);
exports.isIpad = platform === 'iPad';
exports.isIphone = platform === 'iPhone';
exports.isMSWindows = Generic_1.contains(['Windows', 'Win16', 'Win32', 'WinCE'], platform);
exports.isLinux = platform.indexOf('Linux') >= 0;

//# sourceMappingURL=Browser.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var LINE_DATA_CHAR_INDEX = 1;
var LINE_DATA_WIDTH_INDEX = 2;
function translateBufferLineToString(line, trimRight, startCol, endCol) {
    if (startCol === void 0) {
        startCol = 0;
    }
    if (endCol === void 0) {
        endCol = null;
    }
    var lineString = '';
    var widthAdjustedStartCol = startCol;
    var widthAdjustedEndCol = endCol;
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        lineString += char[LINE_DATA_CHAR_INDEX];
        if (char[LINE_DATA_WIDTH_INDEX] === 0) {
            if (startCol >= i) {
                widthAdjustedStartCol--;
            }
            if (endCol >= i) {
                widthAdjustedEndCol--;
            }
        }
    }
    var finalEndCol = widthAdjustedEndCol || line.length;
    if (trimRight) {
        var rightWhitespaceIndex = lineString.search(/\s+$/);
        if (rightWhitespaceIndex !== -1) {
            finalEndCol = Math.min(finalEndCol, rightWhitespaceIndex);
        }
        if (finalEndCol <= widthAdjustedStartCol) {
            return '';
        }
    }
    return lineString.substring(widthAdjustedStartCol, finalEndCol);
}
exports.translateBufferLineToString = translateBufferLineToString;

//# sourceMappingURL=BufferLine.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./attach/attach": 12,
	"./attach/attach.js": 12,
	"./attach/package": 13,
	"./attach/package.json": 13,
	"./fit/fit": 14,
	"./fit/fit.js": 14,
	"./fit/package": 15,
	"./fit/package.json": 15,
	"./fullscreen/fullscreen": 16,
	"./fullscreen/fullscreen.css": 41,
	"./fullscreen/fullscreen.js": 16,
	"./fullscreen/package": 17,
	"./fullscreen/package.json": 17,
	"./search/SearchHelper": 4,
	"./search/SearchHelper.js": 4,
	"./search/SearchHelper.js.map": 43,
	"./search/search": 18,
	"./search/search.js": 18,
	"./search/search.js.map": 44,
	"./terminado/package": 19,
	"./terminado/package.json": 19,
	"./terminado/terminado": 20,
	"./terminado/terminado.js": 20
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 11;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Implements the attach method, that attaches the terminal to a WebSocket stream.
 * @module xterm/addons/attach/attach
 * @license MIT
 */

(function (attach) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
    /*
     * CommonJS environment
     */
    module.exports = attach(__webpack_require__(0));
  } else if (true) {
    /*
     * Require.js is available
     */
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (attach),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    /*
     * Plain browser environment
     */
    attach(window.Terminal);
  }
})(function (Xterm) {
  'use strict';

  var exports = {};

  /**
   * Attaches the given terminal to the given socket.
   *
   * @param {Xterm} term - The terminal to be attached to the given socket.
   * @param {WebSocket} socket - The socket to attach the current terminal.
   * @param {boolean} bidirectional - Whether the terminal should send data
   *                                  to the socket as well.
   * @param {boolean} buffered - Whether the rendering of incoming data
   *                             should happen instantly or at a maximum
   *                             frequency of 1 rendering per 10ms.
   */
  exports.attach = function (term, socket, bidirectional, buffered) {
    bidirectional = typeof bidirectional == 'undefined' ? true : bidirectional;
    term.socket = socket;

    term._flushBuffer = function () {
      term.write(term._attachSocketBuffer);
      term._attachSocketBuffer = null;
      clearTimeout(term._attachSocketBufferTimer);
      term._attachSocketBufferTimer = null;
    };

    term._pushToBuffer = function (data) {
      if (term._attachSocketBuffer) {
        term._attachSocketBuffer += data;
      } else {
        term._attachSocketBuffer = data;
        setTimeout(term._flushBuffer, 10);
      }
    };

    term._getMessage = function (ev) {
      if (buffered) {
        term._pushToBuffer(ev.data);
      } else {
        term.write(ev.data);
      }
    };

    term._sendData = function (data) {
      socket.send(data);
    };

    socket.addEventListener('message', term._getMessage);

    if (bidirectional) {
      term.on('data', term._sendData);
    }

    socket.addEventListener('close', term.detach.bind(term, socket));
    socket.addEventListener('error', term.detach.bind(term, socket));
  };

  /**
   * Detaches the given terminal from the given socket
   *
   * @param {Xterm} term - The terminal to be detached from the given socket.
   * @param {WebSocket} socket - The socket from which to detach the current
   *                             terminal.
   */
  exports.detach = function (term, socket) {
    term.off('data', term._sendData);

    socket = typeof socket == 'undefined' ? term.socket : socket;

    if (socket) {
      socket.removeEventListener('message', term._getMessage);
    }

    delete term.socket;
  };

  /**
   * Attaches the current terminal to the given socket
   *
   * @param {WebSocket} socket - The socket to attach the current terminal.
   * @param {boolean} bidirectional - Whether the terminal should send data
   *                                  to the socket as well.
   * @param {boolean} buffered - Whether the rendering of incoming data
   *                             should happen instantly or at a maximum
   *                             frequency of 1 rendering per 10ms.
   */
  Xterm.prototype.attach = function (socket, bidirectional, buffered) {
    return exports.attach(this, socket, bidirectional, buffered);
  };

  /**
   * Detaches the current terminal from the given socket.
   *
   * @param {WebSocket} socket - The socket from which to detach the current
   *                             terminal.
   */
  Xterm.prototype.detach = function (socket) {
    return exports.detach(this, socket);
  };

  return exports;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {"name":"xterm.attach","main":"attach.js","private":true}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Fit terminal columns and rows to the dimensions of its DOM element.
 *
 * ## Approach
 * - Rows: Truncate the division of the terminal parent element height by the terminal row height.
 *
 * - Columns: Truncate the division of the terminal parent element width by the terminal character
 * width (apply display: inline at the terminal row and truncate its width with the current
 * number of columns).
 * @module xterm/addons/fit/fit
 * @license MIT
 */

(function (fit) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
    /*
     * CommonJS environment
     */
    module.exports = fit(__webpack_require__(0));
  } else if (true) {
    /*
     * Require.js is available
     */
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (fit),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    /*
     * Plain browser environment
     */
    fit(window.Terminal);
  }
})(function (Xterm) {
  var exports = {};

  exports.proposeGeometry = function (term) {
    if (!term.element.parentElement) {
      return null;
    }
    var parentElementStyle = window.getComputedStyle(term.element.parentElement),
        parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height')),
        parentElementWidth = Math.max(0, parseInt(parentElementStyle.getPropertyValue('width')) - 17),
        elementStyle = window.getComputedStyle(term.element),
        elementPaddingVer = parseInt(elementStyle.getPropertyValue('padding-top')) + parseInt(elementStyle.getPropertyValue('padding-bottom')),
        elementPaddingHor = parseInt(elementStyle.getPropertyValue('padding-right')) + parseInt(elementStyle.getPropertyValue('padding-left')),
        availableHeight = parentElementHeight - elementPaddingVer,
        availableWidth = parentElementWidth - elementPaddingHor,
        container = term.rowContainer,
        subjectRow = term.rowContainer.firstElementChild,
        contentBuffer = subjectRow.innerHTML,
        characterHeight,
        rows,
        characterWidth,
        cols,
        geometry;

    subjectRow.style.display = 'inline';
    subjectRow.innerHTML = 'W'; // Common character for measuring width, although on monospace
    characterWidth = subjectRow.getBoundingClientRect().width;
    subjectRow.style.display = ''; // Revert style before calculating height, since they differ.
    characterHeight = subjectRow.getBoundingClientRect().height;
    subjectRow.innerHTML = contentBuffer;

    rows = parseInt(availableHeight / characterHeight);
    cols = parseInt(availableWidth / characterWidth);

    geometry = { cols: cols, rows: rows };
    return geometry;
  };

  exports.fit = function (term) {
    var geometry = exports.proposeGeometry(term);

    if (geometry) {
      term.resize(geometry.cols, geometry.rows);
    }
  };

  Xterm.prototype.proposeGeometry = function () {
    return exports.proposeGeometry(this);
  };

  Xterm.prototype.fit = function () {
    return exports.fit(this);
  };

  return exports;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {"name":"xterm.fit","main":"fit.js","private":true}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Fullscreen addon for xterm.js
 * @module xterm/addons/fullscreen/fullscreen
 * @license MIT
 */
(function (fullscreen) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
    /*
     * CommonJS environment
     */
    module.exports = fullscreen(__webpack_require__(0));
  } else if (true) {
    /*
     * Require.js is available
     */
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (fullscreen),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    /*
     * Plain browser environment
     */
    fullscreen(window.Terminal);
  }
})(function (Xterm) {
  var exports = {};

  /**
   * Toggle the given terminal's fullscreen mode.
   * @param {Xterm} term - The terminal to toggle full screen mode
   * @param {boolean} fullscreen - Toggle fullscreen on (true) or off (false)
   */
  exports.toggleFullScreen = function (term, fullscreen) {
    var fn;

    if (typeof fullscreen == 'undefined') {
      fn = term.element.classList.contains('fullscreen') ? 'remove' : 'add';
    } else if (!fullscreen) {
      fn = 'remove';
    } else {
      fn = 'add';
    }

    term.element.classList[fn]('fullscreen');
  };

  Xterm.prototype.toggleFullscreen = function (fullscreen) {
    exports.toggleFullScreen(this, fullscreen);
  };

  return exports;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {"name":"xterm.fullscreen","main":"fullscreen.js","private":true}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var SearchHelper_1 = __webpack_require__(4);
(function (addon) {
    if ('Terminal' in window) {
        addon(window.Terminal);
    } else if (( false ? "undefined" : _typeof(exports)) === 'object' && ( false ? "undefined" : _typeof(module)) === 'object') {
        module.exports = addon(__webpack_require__(0));
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (addon),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
})(function (Terminal) {
    Terminal.prototype.findNext = function (term) {
        if (!this._searchHelper) {
            this.searchHelper = new SearchHelper_1.SearchHelper(this, Terminal.translateBufferLineToString);
        }
        return this.searchHelper.findNext(term);
    };
    Terminal.prototype.findPrevious = function (term) {
        if (!this._searchHelper) {
            this.searchHelper = new SearchHelper_1.SearchHelper(this, Terminal.translateBufferLineToString);
        }
        return this.searchHelper.findPrevious(term);
    };
});

//# sourceMappingURL=search.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = {"name":"xterm.terminado","main":"terminado.js","private":true}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This module provides methods for attaching a terminal to a terminado WebSocket stream.
 *
 * @module xterm/addons/terminado/terminado
 * @license MIT
 */

(function (attach) {
  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
    /*
     * CommonJS environment
     */
    module.exports = attach(__webpack_require__(0));
  } else if (true) {
    /*
     * Require.js is available
     */
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (attach),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    /*
     * Plain browser environment
     */
    attach(window.Terminal);
  }
})(function (Xterm) {
  'use strict';

  var exports = {};

  /**
   * Attaches the given terminal to the given socket.
   *
   * @param {Xterm} term - The terminal to be attached to the given socket.
   * @param {WebSocket} socket - The socket to attach the current terminal.
   * @param {boolean} bidirectional - Whether the terminal should send data
   *                                  to the socket as well.
   * @param {boolean} buffered - Whether the rendering of incoming data
   *                             should happen instantly or at a maximum
   *                             frequency of 1 rendering per 10ms.
   */
  exports.terminadoAttach = function (term, socket, bidirectional, buffered) {
    bidirectional = typeof bidirectional == 'undefined' ? true : bidirectional;
    term.socket = socket;

    term._flushBuffer = function () {
      term.write(term._attachSocketBuffer);
      term._attachSocketBuffer = null;
      clearTimeout(term._attachSocketBufferTimer);
      term._attachSocketBufferTimer = null;
    };

    term._pushToBuffer = function (data) {
      if (term._attachSocketBuffer) {
        term._attachSocketBuffer += data;
      } else {
        term._attachSocketBuffer = data;
        setTimeout(term._flushBuffer, 10);
      }
    };

    term._getMessage = function (ev) {
      var data = JSON.parse(ev.data);
      if (data[0] == "stdout") {
        if (buffered) {
          term._pushToBuffer(data[1]);
        } else {
          term.write(data[1]);
        }
      }
    };

    term._sendData = function (data) {
      socket.send(JSON.stringify(['stdin', data]));
    };

    term._setSize = function (size) {
      socket.send(JSON.stringify(['set_size', size.rows, size.cols]));
    };

    socket.addEventListener('message', term._getMessage);

    if (bidirectional) {
      term.on('data', term._sendData);
    }
    term.on('resize', term._setSize);

    socket.addEventListener('close', term.terminadoDetach.bind(term, socket));
    socket.addEventListener('error', term.terminadoDetach.bind(term, socket));
  };

  /**
   * Detaches the given terminal from the given socket
   *
   * @param {Xterm} term - The terminal to be detached from the given socket.
   * @param {WebSocket} socket - The socket from which to detach the current
   *                             terminal.
   */
  exports.terminadoDetach = function (term, socket) {
    term.off('data', term._sendData);

    socket = typeof socket == 'undefined' ? term.socket : socket;

    if (socket) {
      socket.removeEventListener('message', term._getMessage);
    }

    delete term.socket;
  };

  /**
   * Attaches the current terminal to the given socket
   *
   * @param {WebSocket} socket - The socket to attach the current terminal.
   * @param {boolean} bidirectional - Whether the terminal should send data
   *                                  to the socket as well.
   * @param {boolean} buffered - Whether the rendering of incoming data
   *                             should happen instantly or at a maximum
   *                             frequency of 1 rendering per 10ms.
   */
  Xterm.prototype.terminadoAttach = function (socket, bidirectional, buffered) {
    return exports.terminadoAttach(this, socket, bidirectional, buffered);
  };

  /**
   * Detaches the current terminal from the given socket.
   *
   * @param {WebSocket} socket - The socket from which to detach the current
   *                             terminal.
   */
  Xterm.prototype.terminadoDetach = function (socket) {
    return exports.terminadoDetach(this, socket);
  };

  return exports;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _player = __webpack_require__(22);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var player = new _player2.default(document.getElementById('#terminal'), scriptData);
player.play();

// document.getElementById("test_button").onclick = function() {
//     console.log("clicked");
//     player.playAll()
// }

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(23);

var _xterm = __webpack_require__(0);

var _xterm2 = _interopRequireDefault(_xterm);

var _timers = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(terminalElementId, playbackData) {
        _classCallCheck(this, Player);

        this.playbackData = playbackData;
        this.currentPlaybackDataIdx = 0;
        this.terminal = new _xterm2.default();
        this.terminal.open(terminalElementId, true);
    }

    _createClass(Player, [{
        key: 'renderFrameEvent',
        value: function renderFrameEvent(frameEvent) {
            //console.log("playing frame: ", frameEvent)
            if (frameEvent.tp == 1) {
                // data msg
                this.terminal.write(atob(frameEvent.dt));
            } else {
                // resize msg
                this.terminal.resize(frameEvent.cols, frameEvent.rows);
            }
        }
    }, {
        key: 'playAll',
        value: function playAll() {
            this.stop();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.playbackData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    event = _step.value;

                    this.renderFrameEvent(event);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'framesLeft',
        value: function framesLeft() {
            return this.playbackData.length - this.currentPlaybackDataIdx - 1;
        }
    }, {
        key: 'renderFrames',
        value: function renderFrames() {
            var thiz = this;
            //console.log("running render frame")
            if (this.framesLeft() > 0) {
                var currentFrameEvent = this.playbackData[this.currentPlaybackDataIdx];
                this.renderFrameEvent(currentFrameEvent);

                // Schedule the next frame playback
                if (this.framesLeft() > 1) {
                    var nextFrameEvent = this.playbackData[this.currentPlaybackDataIdx + 1];
                    var deltaTs = nextFrameEvent.ts - currentFrameEvent.ts;
                    //const deltaTs = nextFrameEvent.ts;
                    console.log("Scheduling next frame after ", deltaTs, " ms");
                    this.tickID = window.setTimeout(function () {
                        thiz.renderFrames();
                    }, deltaTs);
                }
                this.currentPlaybackDataIdx++;
            }
        }
    }, {
        key: 'play',
        value: function play() {
            this.renderFrames();
        }
    }, {
        key: 'pause',
        value: function pause() {
            window.clearInterval(this.tickID);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.pause();
            this.currentPlaybackDataIdx = 0;
        }
    }, {
        key: 'seek',
        value: function seek(position) {}
    }, {
        key: 'setPositionUpdater',
        value: function setPositionUpdater(positionUpdateCallback) {}
    }]);

    return Player;
}();

exports.default = Player;

var playNowAction = function playNowAction() {};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./xterm.css", function() {
			var newContent = require("!!../../css-loader/index.js!./xterm.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "/**\n * xterm.js: xterm, in the browser\n * Copyright (c) 2014-2016, SourceLair Private Company (www.sourcelair.com (MIT License)\n * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)\n * https://github.com/chjj/term.js\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n *\n * Originally forked from (with the author's permission):\n *   Fabrice Bellard's javascript vt100 for jslinux:\n *   http://bellard.org/jslinux/\n *   Copyright (c) 2011 Fabrice Bellard\n *   The original design remains. The terminal itself\n *   has been extended to include xterm CSI codes, among\n *   other features.\n */\n\n/*\n *  Default style for xterm.js\n */\n\n.terminal {\n    background-color: #000;\n    color: #fff;\n    font-family: courier-new, courier, monospace;\n    font-feature-settings: \"liga\" 0;\n    position: relative;\n    user-select: none;\n    -ms-user-select: none;\n    -webkit-user-select: none;\n}\n\n.terminal.focus,\n.terminal:focus {\n    outline: none;\n}\n\n.terminal .xterm-helpers {\n    position: absolute;\n    top: 0;\n}\n\n.terminal .xterm-helper-textarea {\n    /*\n     * HACK: to fix IE's blinking cursor\n     * Move textarea out of the screen to the far left, so that the cursor is not visible.\n     */\n    position: absolute;\n    opacity: 0;\n    left: -9999em;\n    top: 0;\n    width: 0;\n    height: 0;\n    z-index: -10;\n    /** Prevent wrapping so the IME appears against the textarea at the correct position */\n    white-space: nowrap;\n    overflow: hidden;\n    resize: none;\n}\n\n.terminal a {\n    color: inherit;\n    text-decoration: none;\n}\n\n.terminal a:hover {\n    cursor: pointer;\n    text-decoration: underline;\n}\n\n.terminal a.xterm-invalid-link:hover {\n    cursor: text;\n    text-decoration: none;\n}\n\n.terminal .terminal-cursor {\n    position: relative;\n}\n\n.terminal:not(.focus) .terminal-cursor {\n    outline: 1px solid #fff;\n    outline-offset: -1px;\n}\n\n.terminal.xterm-cursor-style-block.focus:not(.xterm-cursor-blink-on) .terminal-cursor {\n    background-color: #fff;\n    color: #000;\n}\n\n.terminal.focus.xterm-cursor-style-bar:not(.xterm-cursor-blink-on) .terminal-cursor::before,\n.terminal.focus.xterm-cursor-style-underline:not(.xterm-cursor-blink-on) .terminal-cursor::before {\n    content: '';\n    position: absolute;\n    background-color: #fff;\n}\n\n.terminal.focus.xterm-cursor-style-bar:not(.xterm-cursor-blink-on) .terminal-cursor::before {\n    top: 0;\n    left: 0;\n    bottom: 0;\n    width: 1px;\n}\n\n.terminal.focus.xterm-cursor-style-underline:not(.xterm-cursor-blink-on) .terminal-cursor::before {\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 1px;\n}\n\n.terminal .composition-view {\n    background: #000;\n    color: #FFF;\n    display: none;\n    position: absolute;\n    white-space: nowrap;\n    z-index: 1;\n}\n\n.terminal .composition-view.active {\n    display: block;\n}\n\n.terminal .xterm-viewport {\n    /* On OS X this is required in order for the scroll bar to appear fully opaque */\n    background-color: #000;\n    overflow-y: scroll;\n}\n\n.terminal .xterm-wide-char,\n.terminal .xterm-normal-char {\n    display: inline-block;\n}\n\n.terminal .xterm-rows {\n    position: absolute;\n    left: 0;\n    top: 0;\n}\n\n.terminal .xterm-rows > div {\n    /* Lines containing spans and text nodes ocassionally wrap despite being the same width (#327) */\n    white-space: nowrap;\n}\n\n.terminal .xterm-scroll-area {\n    visibility: hidden;\n}\n\n.terminal .xterm-char-measure-element {\n    display: inline-block;\n    visibility: hidden;\n    position: absolute;\n    left: -9999em;\n}\n\n.terminal.enable-mouse-events {\n    /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */\n    cursor: default;\n}\n\n.terminal .xterm-selection {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 1;\n    opacity: 0.3;\n    pointer-events: none;\n}\n\n.terminal .xterm-selection div {\n    position: absolute;\n    background-color: #fff;\n}\n\n/*\n *  Determine default colors for xterm.js\n */\n.terminal .xterm-bold {\n    font-weight: bold;\n}\n\n.terminal .xterm-underline {\n    text-decoration: underline;\n}\n\n.terminal .xterm-blink {\n    text-decoration: blink;\n}\n\n.terminal .xterm-blink.xterm-underline {\n    text-decoration: blink underline;\n}\n\n.terminal .xterm-hidden {\n    visibility: hidden;\n}\n\n.terminal .xterm-color-0 {\n    color: #2e3436;\n}\n\n.terminal .xterm-bg-color-0 {\n    background-color: #2e3436;\n}\n\n.terminal .xterm-color-1 {\n    color: #cc0000;\n}\n\n.terminal .xterm-bg-color-1 {\n    background-color: #cc0000;\n}\n\n.terminal .xterm-color-2 {\n    color: #4e9a06;\n}\n\n.terminal .xterm-bg-color-2 {\n    background-color: #4e9a06;\n}\n\n.terminal .xterm-color-3 {\n    color: #c4a000;\n}\n\n.terminal .xterm-bg-color-3 {\n    background-color: #c4a000;\n}\n\n.terminal .xterm-color-4 {\n    color: #3465a4;\n}\n\n.terminal .xterm-bg-color-4 {\n    background-color: #3465a4;\n}\n\n.terminal .xterm-color-5 {\n    color: #75507b;\n}\n\n.terminal .xterm-bg-color-5 {\n    background-color: #75507b;\n}\n\n.terminal .xterm-color-6 {\n    color: #06989a;\n}\n\n.terminal .xterm-bg-color-6 {\n    background-color: #06989a;\n}\n\n.terminal .xterm-color-7 {\n    color: #d3d7cf;\n}\n\n.terminal .xterm-bg-color-7 {\n    background-color: #d3d7cf;\n}\n\n.terminal .xterm-color-8 {\n    color: #555753;\n}\n\n.terminal .xterm-bg-color-8 {\n    background-color: #555753;\n}\n\n.terminal .xterm-color-9 {\n    color: #ef2929;\n}\n\n.terminal .xterm-bg-color-9 {\n    background-color: #ef2929;\n}\n\n.terminal .xterm-color-10 {\n    color: #8ae234;\n}\n\n.terminal .xterm-bg-color-10 {\n    background-color: #8ae234;\n}\n\n.terminal .xterm-color-11 {\n    color: #fce94f;\n}\n\n.terminal .xterm-bg-color-11 {\n    background-color: #fce94f;\n}\n\n.terminal .xterm-color-12 {\n    color: #729fcf;\n}\n\n.terminal .xterm-bg-color-12 {\n    background-color: #729fcf;\n}\n\n.terminal .xterm-color-13 {\n    color: #ad7fa8;\n}\n\n.terminal .xterm-bg-color-13 {\n    background-color: #ad7fa8;\n}\n\n.terminal .xterm-color-14 {\n    color: #34e2e2;\n}\n\n.terminal .xterm-bg-color-14 {\n    background-color: #34e2e2;\n}\n\n.terminal .xterm-color-15 {\n    color: #eeeeec;\n}\n\n.terminal .xterm-bg-color-15 {\n    background-color: #eeeeec;\n}\n\n.terminal .xterm-color-16 {\n    color: #000000;\n}\n\n.terminal .xterm-bg-color-16 {\n    background-color: #000000;\n}\n\n.terminal .xterm-color-17 {\n    color: #00005f;\n}\n\n.terminal .xterm-bg-color-17 {\n    background-color: #00005f;\n}\n\n.terminal .xterm-color-18 {\n    color: #000087;\n}\n\n.terminal .xterm-bg-color-18 {\n    background-color: #000087;\n}\n\n.terminal .xterm-color-19 {\n    color: #0000af;\n}\n\n.terminal .xterm-bg-color-19 {\n    background-color: #0000af;\n}\n\n.terminal .xterm-color-20 {\n    color: #0000d7;\n}\n\n.terminal .xterm-bg-color-20 {\n    background-color: #0000d7;\n}\n\n.terminal .xterm-color-21 {\n    color: #0000ff;\n}\n\n.terminal .xterm-bg-color-21 {\n    background-color: #0000ff;\n}\n\n.terminal .xterm-color-22 {\n    color: #005f00;\n}\n\n.terminal .xterm-bg-color-22 {\n    background-color: #005f00;\n}\n\n.terminal .xterm-color-23 {\n    color: #005f5f;\n}\n\n.terminal .xterm-bg-color-23 {\n    background-color: #005f5f;\n}\n\n.terminal .xterm-color-24 {\n    color: #005f87;\n}\n\n.terminal .xterm-bg-color-24 {\n    background-color: #005f87;\n}\n\n.terminal .xterm-color-25 {\n    color: #005faf;\n}\n\n.terminal .xterm-bg-color-25 {\n    background-color: #005faf;\n}\n\n.terminal .xterm-color-26 {\n    color: #005fd7;\n}\n\n.terminal .xterm-bg-color-26 {\n    background-color: #005fd7;\n}\n\n.terminal .xterm-color-27 {\n    color: #005fff;\n}\n\n.terminal .xterm-bg-color-27 {\n    background-color: #005fff;\n}\n\n.terminal .xterm-color-28 {\n    color: #008700;\n}\n\n.terminal .xterm-bg-color-28 {\n    background-color: #008700;\n}\n\n.terminal .xterm-color-29 {\n    color: #00875f;\n}\n\n.terminal .xterm-bg-color-29 {\n    background-color: #00875f;\n}\n\n.terminal .xterm-color-30 {\n    color: #008787;\n}\n\n.terminal .xterm-bg-color-30 {\n    background-color: #008787;\n}\n\n.terminal .xterm-color-31 {\n    color: #0087af;\n}\n\n.terminal .xterm-bg-color-31 {\n    background-color: #0087af;\n}\n\n.terminal .xterm-color-32 {\n    color: #0087d7;\n}\n\n.terminal .xterm-bg-color-32 {\n    background-color: #0087d7;\n}\n\n.terminal .xterm-color-33 {\n    color: #0087ff;\n}\n\n.terminal .xterm-bg-color-33 {\n    background-color: #0087ff;\n}\n\n.terminal .xterm-color-34 {\n    color: #00af00;\n}\n\n.terminal .xterm-bg-color-34 {\n    background-color: #00af00;\n}\n\n.terminal .xterm-color-35 {\n    color: #00af5f;\n}\n\n.terminal .xterm-bg-color-35 {\n    background-color: #00af5f;\n}\n\n.terminal .xterm-color-36 {\n    color: #00af87;\n}\n\n.terminal .xterm-bg-color-36 {\n    background-color: #00af87;\n}\n\n.terminal .xterm-color-37 {\n    color: #00afaf;\n}\n\n.terminal .xterm-bg-color-37 {\n    background-color: #00afaf;\n}\n\n.terminal .xterm-color-38 {\n    color: #00afd7;\n}\n\n.terminal .xterm-bg-color-38 {\n    background-color: #00afd7;\n}\n\n.terminal .xterm-color-39 {\n    color: #00afff;\n}\n\n.terminal .xterm-bg-color-39 {\n    background-color: #00afff;\n}\n\n.terminal .xterm-color-40 {\n    color: #00d700;\n}\n\n.terminal .xterm-bg-color-40 {\n    background-color: #00d700;\n}\n\n.terminal .xterm-color-41 {\n    color: #00d75f;\n}\n\n.terminal .xterm-bg-color-41 {\n    background-color: #00d75f;\n}\n\n.terminal .xterm-color-42 {\n    color: #00d787;\n}\n\n.terminal .xterm-bg-color-42 {\n    background-color: #00d787;\n}\n\n.terminal .xterm-color-43 {\n    color: #00d7af;\n}\n\n.terminal .xterm-bg-color-43 {\n    background-color: #00d7af;\n}\n\n.terminal .xterm-color-44 {\n    color: #00d7d7;\n}\n\n.terminal .xterm-bg-color-44 {\n    background-color: #00d7d7;\n}\n\n.terminal .xterm-color-45 {\n    color: #00d7ff;\n}\n\n.terminal .xterm-bg-color-45 {\n    background-color: #00d7ff;\n}\n\n.terminal .xterm-color-46 {\n    color: #00ff00;\n}\n\n.terminal .xterm-bg-color-46 {\n    background-color: #00ff00;\n}\n\n.terminal .xterm-color-47 {\n    color: #00ff5f;\n}\n\n.terminal .xterm-bg-color-47 {\n    background-color: #00ff5f;\n}\n\n.terminal .xterm-color-48 {\n    color: #00ff87;\n}\n\n.terminal .xterm-bg-color-48 {\n    background-color: #00ff87;\n}\n\n.terminal .xterm-color-49 {\n    color: #00ffaf;\n}\n\n.terminal .xterm-bg-color-49 {\n    background-color: #00ffaf;\n}\n\n.terminal .xterm-color-50 {\n    color: #00ffd7;\n}\n\n.terminal .xterm-bg-color-50 {\n    background-color: #00ffd7;\n}\n\n.terminal .xterm-color-51 {\n    color: #00ffff;\n}\n\n.terminal .xterm-bg-color-51 {\n    background-color: #00ffff;\n}\n\n.terminal .xterm-color-52 {\n    color: #5f0000;\n}\n\n.terminal .xterm-bg-color-52 {\n    background-color: #5f0000;\n}\n\n.terminal .xterm-color-53 {\n    color: #5f005f;\n}\n\n.terminal .xterm-bg-color-53 {\n    background-color: #5f005f;\n}\n\n.terminal .xterm-color-54 {\n    color: #5f0087;\n}\n\n.terminal .xterm-bg-color-54 {\n    background-color: #5f0087;\n}\n\n.terminal .xterm-color-55 {\n    color: #5f00af;\n}\n\n.terminal .xterm-bg-color-55 {\n    background-color: #5f00af;\n}\n\n.terminal .xterm-color-56 {\n    color: #5f00d7;\n}\n\n.terminal .xterm-bg-color-56 {\n    background-color: #5f00d7;\n}\n\n.terminal .xterm-color-57 {\n    color: #5f00ff;\n}\n\n.terminal .xterm-bg-color-57 {\n    background-color: #5f00ff;\n}\n\n.terminal .xterm-color-58 {\n    color: #5f5f00;\n}\n\n.terminal .xterm-bg-color-58 {\n    background-color: #5f5f00;\n}\n\n.terminal .xterm-color-59 {\n    color: #5f5f5f;\n}\n\n.terminal .xterm-bg-color-59 {\n    background-color: #5f5f5f;\n}\n\n.terminal .xterm-color-60 {\n    color: #5f5f87;\n}\n\n.terminal .xterm-bg-color-60 {\n    background-color: #5f5f87;\n}\n\n.terminal .xterm-color-61 {\n    color: #5f5faf;\n}\n\n.terminal .xterm-bg-color-61 {\n    background-color: #5f5faf;\n}\n\n.terminal .xterm-color-62 {\n    color: #5f5fd7;\n}\n\n.terminal .xterm-bg-color-62 {\n    background-color: #5f5fd7;\n}\n\n.terminal .xterm-color-63 {\n    color: #5f5fff;\n}\n\n.terminal .xterm-bg-color-63 {\n    background-color: #5f5fff;\n}\n\n.terminal .xterm-color-64 {\n    color: #5f8700;\n}\n\n.terminal .xterm-bg-color-64 {\n    background-color: #5f8700;\n}\n\n.terminal .xterm-color-65 {\n    color: #5f875f;\n}\n\n.terminal .xterm-bg-color-65 {\n    background-color: #5f875f;\n}\n\n.terminal .xterm-color-66 {\n    color: #5f8787;\n}\n\n.terminal .xterm-bg-color-66 {\n    background-color: #5f8787;\n}\n\n.terminal .xterm-color-67 {\n    color: #5f87af;\n}\n\n.terminal .xterm-bg-color-67 {\n    background-color: #5f87af;\n}\n\n.terminal .xterm-color-68 {\n    color: #5f87d7;\n}\n\n.terminal .xterm-bg-color-68 {\n    background-color: #5f87d7;\n}\n\n.terminal .xterm-color-69 {\n    color: #5f87ff;\n}\n\n.terminal .xterm-bg-color-69 {\n    background-color: #5f87ff;\n}\n\n.terminal .xterm-color-70 {\n    color: #5faf00;\n}\n\n.terminal .xterm-bg-color-70 {\n    background-color: #5faf00;\n}\n\n.terminal .xterm-color-71 {\n    color: #5faf5f;\n}\n\n.terminal .xterm-bg-color-71 {\n    background-color: #5faf5f;\n}\n\n.terminal .xterm-color-72 {\n    color: #5faf87;\n}\n\n.terminal .xterm-bg-color-72 {\n    background-color: #5faf87;\n}\n\n.terminal .xterm-color-73 {\n    color: #5fafaf;\n}\n\n.terminal .xterm-bg-color-73 {\n    background-color: #5fafaf;\n}\n\n.terminal .xterm-color-74 {\n    color: #5fafd7;\n}\n\n.terminal .xterm-bg-color-74 {\n    background-color: #5fafd7;\n}\n\n.terminal .xterm-color-75 {\n    color: #5fafff;\n}\n\n.terminal .xterm-bg-color-75 {\n    background-color: #5fafff;\n}\n\n.terminal .xterm-color-76 {\n    color: #5fd700;\n}\n\n.terminal .xterm-bg-color-76 {\n    background-color: #5fd700;\n}\n\n.terminal .xterm-color-77 {\n    color: #5fd75f;\n}\n\n.terminal .xterm-bg-color-77 {\n    background-color: #5fd75f;\n}\n\n.terminal .xterm-color-78 {\n    color: #5fd787;\n}\n\n.terminal .xterm-bg-color-78 {\n    background-color: #5fd787;\n}\n\n.terminal .xterm-color-79 {\n    color: #5fd7af;\n}\n\n.terminal .xterm-bg-color-79 {\n    background-color: #5fd7af;\n}\n\n.terminal .xterm-color-80 {\n    color: #5fd7d7;\n}\n\n.terminal .xterm-bg-color-80 {\n    background-color: #5fd7d7;\n}\n\n.terminal .xterm-color-81 {\n    color: #5fd7ff;\n}\n\n.terminal .xterm-bg-color-81 {\n    background-color: #5fd7ff;\n}\n\n.terminal .xterm-color-82 {\n    color: #5fff00;\n}\n\n.terminal .xterm-bg-color-82 {\n    background-color: #5fff00;\n}\n\n.terminal .xterm-color-83 {\n    color: #5fff5f;\n}\n\n.terminal .xterm-bg-color-83 {\n    background-color: #5fff5f;\n}\n\n.terminal .xterm-color-84 {\n    color: #5fff87;\n}\n\n.terminal .xterm-bg-color-84 {\n    background-color: #5fff87;\n}\n\n.terminal .xterm-color-85 {\n    color: #5fffaf;\n}\n\n.terminal .xterm-bg-color-85 {\n    background-color: #5fffaf;\n}\n\n.terminal .xterm-color-86 {\n    color: #5fffd7;\n}\n\n.terminal .xterm-bg-color-86 {\n    background-color: #5fffd7;\n}\n\n.terminal .xterm-color-87 {\n    color: #5fffff;\n}\n\n.terminal .xterm-bg-color-87 {\n    background-color: #5fffff;\n}\n\n.terminal .xterm-color-88 {\n    color: #870000;\n}\n\n.terminal .xterm-bg-color-88 {\n    background-color: #870000;\n}\n\n.terminal .xterm-color-89 {\n    color: #87005f;\n}\n\n.terminal .xterm-bg-color-89 {\n    background-color: #87005f;\n}\n\n.terminal .xterm-color-90 {\n    color: #870087;\n}\n\n.terminal .xterm-bg-color-90 {\n    background-color: #870087;\n}\n\n.terminal .xterm-color-91 {\n    color: #8700af;\n}\n\n.terminal .xterm-bg-color-91 {\n    background-color: #8700af;\n}\n\n.terminal .xterm-color-92 {\n    color: #8700d7;\n}\n\n.terminal .xterm-bg-color-92 {\n    background-color: #8700d7;\n}\n\n.terminal .xterm-color-93 {\n    color: #8700ff;\n}\n\n.terminal .xterm-bg-color-93 {\n    background-color: #8700ff;\n}\n\n.terminal .xterm-color-94 {\n    color: #875f00;\n}\n\n.terminal .xterm-bg-color-94 {\n    background-color: #875f00;\n}\n\n.terminal .xterm-color-95 {\n    color: #875f5f;\n}\n\n.terminal .xterm-bg-color-95 {\n    background-color: #875f5f;\n}\n\n.terminal .xterm-color-96 {\n    color: #875f87;\n}\n\n.terminal .xterm-bg-color-96 {\n    background-color: #875f87;\n}\n\n.terminal .xterm-color-97 {\n    color: #875faf;\n}\n\n.terminal .xterm-bg-color-97 {\n    background-color: #875faf;\n}\n\n.terminal .xterm-color-98 {\n    color: #875fd7;\n}\n\n.terminal .xterm-bg-color-98 {\n    background-color: #875fd7;\n}\n\n.terminal .xterm-color-99 {\n    color: #875fff;\n}\n\n.terminal .xterm-bg-color-99 {\n    background-color: #875fff;\n}\n\n.terminal .xterm-color-100 {\n    color: #878700;\n}\n\n.terminal .xterm-bg-color-100 {\n    background-color: #878700;\n}\n\n.terminal .xterm-color-101 {\n    color: #87875f;\n}\n\n.terminal .xterm-bg-color-101 {\n    background-color: #87875f;\n}\n\n.terminal .xterm-color-102 {\n    color: #878787;\n}\n\n.terminal .xterm-bg-color-102 {\n    background-color: #878787;\n}\n\n.terminal .xterm-color-103 {\n    color: #8787af;\n}\n\n.terminal .xterm-bg-color-103 {\n    background-color: #8787af;\n}\n\n.terminal .xterm-color-104 {\n    color: #8787d7;\n}\n\n.terminal .xterm-bg-color-104 {\n    background-color: #8787d7;\n}\n\n.terminal .xterm-color-105 {\n    color: #8787ff;\n}\n\n.terminal .xterm-bg-color-105 {\n    background-color: #8787ff;\n}\n\n.terminal .xterm-color-106 {\n    color: #87af00;\n}\n\n.terminal .xterm-bg-color-106 {\n    background-color: #87af00;\n}\n\n.terminal .xterm-color-107 {\n    color: #87af5f;\n}\n\n.terminal .xterm-bg-color-107 {\n    background-color: #87af5f;\n}\n\n.terminal .xterm-color-108 {\n    color: #87af87;\n}\n\n.terminal .xterm-bg-color-108 {\n    background-color: #87af87;\n}\n\n.terminal .xterm-color-109 {\n    color: #87afaf;\n}\n\n.terminal .xterm-bg-color-109 {\n    background-color: #87afaf;\n}\n\n.terminal .xterm-color-110 {\n    color: #87afd7;\n}\n\n.terminal .xterm-bg-color-110 {\n    background-color: #87afd7;\n}\n\n.terminal .xterm-color-111 {\n    color: #87afff;\n}\n\n.terminal .xterm-bg-color-111 {\n    background-color: #87afff;\n}\n\n.terminal .xterm-color-112 {\n    color: #87d700;\n}\n\n.terminal .xterm-bg-color-112 {\n    background-color: #87d700;\n}\n\n.terminal .xterm-color-113 {\n    color: #87d75f;\n}\n\n.terminal .xterm-bg-color-113 {\n    background-color: #87d75f;\n}\n\n.terminal .xterm-color-114 {\n    color: #87d787;\n}\n\n.terminal .xterm-bg-color-114 {\n    background-color: #87d787;\n}\n\n.terminal .xterm-color-115 {\n    color: #87d7af;\n}\n\n.terminal .xterm-bg-color-115 {\n    background-color: #87d7af;\n}\n\n.terminal .xterm-color-116 {\n    color: #87d7d7;\n}\n\n.terminal .xterm-bg-color-116 {\n    background-color: #87d7d7;\n}\n\n.terminal .xterm-color-117 {\n    color: #87d7ff;\n}\n\n.terminal .xterm-bg-color-117 {\n    background-color: #87d7ff;\n}\n\n.terminal .xterm-color-118 {\n    color: #87ff00;\n}\n\n.terminal .xterm-bg-color-118 {\n    background-color: #87ff00;\n}\n\n.terminal .xterm-color-119 {\n    color: #87ff5f;\n}\n\n.terminal .xterm-bg-color-119 {\n    background-color: #87ff5f;\n}\n\n.terminal .xterm-color-120 {\n    color: #87ff87;\n}\n\n.terminal .xterm-bg-color-120 {\n    background-color: #87ff87;\n}\n\n.terminal .xterm-color-121 {\n    color: #87ffaf;\n}\n\n.terminal .xterm-bg-color-121 {\n    background-color: #87ffaf;\n}\n\n.terminal .xterm-color-122 {\n    color: #87ffd7;\n}\n\n.terminal .xterm-bg-color-122 {\n    background-color: #87ffd7;\n}\n\n.terminal .xterm-color-123 {\n    color: #87ffff;\n}\n\n.terminal .xterm-bg-color-123 {\n    background-color: #87ffff;\n}\n\n.terminal .xterm-color-124 {\n    color: #af0000;\n}\n\n.terminal .xterm-bg-color-124 {\n    background-color: #af0000;\n}\n\n.terminal .xterm-color-125 {\n    color: #af005f;\n}\n\n.terminal .xterm-bg-color-125 {\n    background-color: #af005f;\n}\n\n.terminal .xterm-color-126 {\n    color: #af0087;\n}\n\n.terminal .xterm-bg-color-126 {\n    background-color: #af0087;\n}\n\n.terminal .xterm-color-127 {\n    color: #af00af;\n}\n\n.terminal .xterm-bg-color-127 {\n    background-color: #af00af;\n}\n\n.terminal .xterm-color-128 {\n    color: #af00d7;\n}\n\n.terminal .xterm-bg-color-128 {\n    background-color: #af00d7;\n}\n\n.terminal .xterm-color-129 {\n    color: #af00ff;\n}\n\n.terminal .xterm-bg-color-129 {\n    background-color: #af00ff;\n}\n\n.terminal .xterm-color-130 {\n    color: #af5f00;\n}\n\n.terminal .xterm-bg-color-130 {\n    background-color: #af5f00;\n}\n\n.terminal .xterm-color-131 {\n    color: #af5f5f;\n}\n\n.terminal .xterm-bg-color-131 {\n    background-color: #af5f5f;\n}\n\n.terminal .xterm-color-132 {\n    color: #af5f87;\n}\n\n.terminal .xterm-bg-color-132 {\n    background-color: #af5f87;\n}\n\n.terminal .xterm-color-133 {\n    color: #af5faf;\n}\n\n.terminal .xterm-bg-color-133 {\n    background-color: #af5faf;\n}\n\n.terminal .xterm-color-134 {\n    color: #af5fd7;\n}\n\n.terminal .xterm-bg-color-134 {\n    background-color: #af5fd7;\n}\n\n.terminal .xterm-color-135 {\n    color: #af5fff;\n}\n\n.terminal .xterm-bg-color-135 {\n    background-color: #af5fff;\n}\n\n.terminal .xterm-color-136 {\n    color: #af8700;\n}\n\n.terminal .xterm-bg-color-136 {\n    background-color: #af8700;\n}\n\n.terminal .xterm-color-137 {\n    color: #af875f;\n}\n\n.terminal .xterm-bg-color-137 {\n    background-color: #af875f;\n}\n\n.terminal .xterm-color-138 {\n    color: #af8787;\n}\n\n.terminal .xterm-bg-color-138 {\n    background-color: #af8787;\n}\n\n.terminal .xterm-color-139 {\n    color: #af87af;\n}\n\n.terminal .xterm-bg-color-139 {\n    background-color: #af87af;\n}\n\n.terminal .xterm-color-140 {\n    color: #af87d7;\n}\n\n.terminal .xterm-bg-color-140 {\n    background-color: #af87d7;\n}\n\n.terminal .xterm-color-141 {\n    color: #af87ff;\n}\n\n.terminal .xterm-bg-color-141 {\n    background-color: #af87ff;\n}\n\n.terminal .xterm-color-142 {\n    color: #afaf00;\n}\n\n.terminal .xterm-bg-color-142 {\n    background-color: #afaf00;\n}\n\n.terminal .xterm-color-143 {\n    color: #afaf5f;\n}\n\n.terminal .xterm-bg-color-143 {\n    background-color: #afaf5f;\n}\n\n.terminal .xterm-color-144 {\n    color: #afaf87;\n}\n\n.terminal .xterm-bg-color-144 {\n    background-color: #afaf87;\n}\n\n.terminal .xterm-color-145 {\n    color: #afafaf;\n}\n\n.terminal .xterm-bg-color-145 {\n    background-color: #afafaf;\n}\n\n.terminal .xterm-color-146 {\n    color: #afafd7;\n}\n\n.terminal .xterm-bg-color-146 {\n    background-color: #afafd7;\n}\n\n.terminal .xterm-color-147 {\n    color: #afafff;\n}\n\n.terminal .xterm-bg-color-147 {\n    background-color: #afafff;\n}\n\n.terminal .xterm-color-148 {\n    color: #afd700;\n}\n\n.terminal .xterm-bg-color-148 {\n    background-color: #afd700;\n}\n\n.terminal .xterm-color-149 {\n    color: #afd75f;\n}\n\n.terminal .xterm-bg-color-149 {\n    background-color: #afd75f;\n}\n\n.terminal .xterm-color-150 {\n    color: #afd787;\n}\n\n.terminal .xterm-bg-color-150 {\n    background-color: #afd787;\n}\n\n.terminal .xterm-color-151 {\n    color: #afd7af;\n}\n\n.terminal .xterm-bg-color-151 {\n    background-color: #afd7af;\n}\n\n.terminal .xterm-color-152 {\n    color: #afd7d7;\n}\n\n.terminal .xterm-bg-color-152 {\n    background-color: #afd7d7;\n}\n\n.terminal .xterm-color-153 {\n    color: #afd7ff;\n}\n\n.terminal .xterm-bg-color-153 {\n    background-color: #afd7ff;\n}\n\n.terminal .xterm-color-154 {\n    color: #afff00;\n}\n\n.terminal .xterm-bg-color-154 {\n    background-color: #afff00;\n}\n\n.terminal .xterm-color-155 {\n    color: #afff5f;\n}\n\n.terminal .xterm-bg-color-155 {\n    background-color: #afff5f;\n}\n\n.terminal .xterm-color-156 {\n    color: #afff87;\n}\n\n.terminal .xterm-bg-color-156 {\n    background-color: #afff87;\n}\n\n.terminal .xterm-color-157 {\n    color: #afffaf;\n}\n\n.terminal .xterm-bg-color-157 {\n    background-color: #afffaf;\n}\n\n.terminal .xterm-color-158 {\n    color: #afffd7;\n}\n\n.terminal .xterm-bg-color-158 {\n    background-color: #afffd7;\n}\n\n.terminal .xterm-color-159 {\n    color: #afffff;\n}\n\n.terminal .xterm-bg-color-159 {\n    background-color: #afffff;\n}\n\n.terminal .xterm-color-160 {\n    color: #d70000;\n}\n\n.terminal .xterm-bg-color-160 {\n    background-color: #d70000;\n}\n\n.terminal .xterm-color-161 {\n    color: #d7005f;\n}\n\n.terminal .xterm-bg-color-161 {\n    background-color: #d7005f;\n}\n\n.terminal .xterm-color-162 {\n    color: #d70087;\n}\n\n.terminal .xterm-bg-color-162 {\n    background-color: #d70087;\n}\n\n.terminal .xterm-color-163 {\n    color: #d700af;\n}\n\n.terminal .xterm-bg-color-163 {\n    background-color: #d700af;\n}\n\n.terminal .xterm-color-164 {\n    color: #d700d7;\n}\n\n.terminal .xterm-bg-color-164 {\n    background-color: #d700d7;\n}\n\n.terminal .xterm-color-165 {\n    color: #d700ff;\n}\n\n.terminal .xterm-bg-color-165 {\n    background-color: #d700ff;\n}\n\n.terminal .xterm-color-166 {\n    color: #d75f00;\n}\n\n.terminal .xterm-bg-color-166 {\n    background-color: #d75f00;\n}\n\n.terminal .xterm-color-167 {\n    color: #d75f5f;\n}\n\n.terminal .xterm-bg-color-167 {\n    background-color: #d75f5f;\n}\n\n.terminal .xterm-color-168 {\n    color: #d75f87;\n}\n\n.terminal .xterm-bg-color-168 {\n    background-color: #d75f87;\n}\n\n.terminal .xterm-color-169 {\n    color: #d75faf;\n}\n\n.terminal .xterm-bg-color-169 {\n    background-color: #d75faf;\n}\n\n.terminal .xterm-color-170 {\n    color: #d75fd7;\n}\n\n.terminal .xterm-bg-color-170 {\n    background-color: #d75fd7;\n}\n\n.terminal .xterm-color-171 {\n    color: #d75fff;\n}\n\n.terminal .xterm-bg-color-171 {\n    background-color: #d75fff;\n}\n\n.terminal .xterm-color-172 {\n    color: #d78700;\n}\n\n.terminal .xterm-bg-color-172 {\n    background-color: #d78700;\n}\n\n.terminal .xterm-color-173 {\n    color: #d7875f;\n}\n\n.terminal .xterm-bg-color-173 {\n    background-color: #d7875f;\n}\n\n.terminal .xterm-color-174 {\n    color: #d78787;\n}\n\n.terminal .xterm-bg-color-174 {\n    background-color: #d78787;\n}\n\n.terminal .xterm-color-175 {\n    color: #d787af;\n}\n\n.terminal .xterm-bg-color-175 {\n    background-color: #d787af;\n}\n\n.terminal .xterm-color-176 {\n    color: #d787d7;\n}\n\n.terminal .xterm-bg-color-176 {\n    background-color: #d787d7;\n}\n\n.terminal .xterm-color-177 {\n    color: #d787ff;\n}\n\n.terminal .xterm-bg-color-177 {\n    background-color: #d787ff;\n}\n\n.terminal .xterm-color-178 {\n    color: #d7af00;\n}\n\n.terminal .xterm-bg-color-178 {\n    background-color: #d7af00;\n}\n\n.terminal .xterm-color-179 {\n    color: #d7af5f;\n}\n\n.terminal .xterm-bg-color-179 {\n    background-color: #d7af5f;\n}\n\n.terminal .xterm-color-180 {\n    color: #d7af87;\n}\n\n.terminal .xterm-bg-color-180 {\n    background-color: #d7af87;\n}\n\n.terminal .xterm-color-181 {\n    color: #d7afaf;\n}\n\n.terminal .xterm-bg-color-181 {\n    background-color: #d7afaf;\n}\n\n.terminal .xterm-color-182 {\n    color: #d7afd7;\n}\n\n.terminal .xterm-bg-color-182 {\n    background-color: #d7afd7;\n}\n\n.terminal .xterm-color-183 {\n    color: #d7afff;\n}\n\n.terminal .xterm-bg-color-183 {\n    background-color: #d7afff;\n}\n\n.terminal .xterm-color-184 {\n    color: #d7d700;\n}\n\n.terminal .xterm-bg-color-184 {\n    background-color: #d7d700;\n}\n\n.terminal .xterm-color-185 {\n    color: #d7d75f;\n}\n\n.terminal .xterm-bg-color-185 {\n    background-color: #d7d75f;\n}\n\n.terminal .xterm-color-186 {\n    color: #d7d787;\n}\n\n.terminal .xterm-bg-color-186 {\n    background-color: #d7d787;\n}\n\n.terminal .xterm-color-187 {\n    color: #d7d7af;\n}\n\n.terminal .xterm-bg-color-187 {\n    background-color: #d7d7af;\n}\n\n.terminal .xterm-color-188 {\n    color: #d7d7d7;\n}\n\n.terminal .xterm-bg-color-188 {\n    background-color: #d7d7d7;\n}\n\n.terminal .xterm-color-189 {\n    color: #d7d7ff;\n}\n\n.terminal .xterm-bg-color-189 {\n    background-color: #d7d7ff;\n}\n\n.terminal .xterm-color-190 {\n    color: #d7ff00;\n}\n\n.terminal .xterm-bg-color-190 {\n    background-color: #d7ff00;\n}\n\n.terminal .xterm-color-191 {\n    color: #d7ff5f;\n}\n\n.terminal .xterm-bg-color-191 {\n    background-color: #d7ff5f;\n}\n\n.terminal .xterm-color-192 {\n    color: #d7ff87;\n}\n\n.terminal .xterm-bg-color-192 {\n    background-color: #d7ff87;\n}\n\n.terminal .xterm-color-193 {\n    color: #d7ffaf;\n}\n\n.terminal .xterm-bg-color-193 {\n    background-color: #d7ffaf;\n}\n\n.terminal .xterm-color-194 {\n    color: #d7ffd7;\n}\n\n.terminal .xterm-bg-color-194 {\n    background-color: #d7ffd7;\n}\n\n.terminal .xterm-color-195 {\n    color: #d7ffff;\n}\n\n.terminal .xterm-bg-color-195 {\n    background-color: #d7ffff;\n}\n\n.terminal .xterm-color-196 {\n    color: #ff0000;\n}\n\n.terminal .xterm-bg-color-196 {\n    background-color: #ff0000;\n}\n\n.terminal .xterm-color-197 {\n    color: #ff005f;\n}\n\n.terminal .xterm-bg-color-197 {\n    background-color: #ff005f;\n}\n\n.terminal .xterm-color-198 {\n    color: #ff0087;\n}\n\n.terminal .xterm-bg-color-198 {\n    background-color: #ff0087;\n}\n\n.terminal .xterm-color-199 {\n    color: #ff00af;\n}\n\n.terminal .xterm-bg-color-199 {\n    background-color: #ff00af;\n}\n\n.terminal .xterm-color-200 {\n    color: #ff00d7;\n}\n\n.terminal .xterm-bg-color-200 {\n    background-color: #ff00d7;\n}\n\n.terminal .xterm-color-201 {\n    color: #ff00ff;\n}\n\n.terminal .xterm-bg-color-201 {\n    background-color: #ff00ff;\n}\n\n.terminal .xterm-color-202 {\n    color: #ff5f00;\n}\n\n.terminal .xterm-bg-color-202 {\n    background-color: #ff5f00;\n}\n\n.terminal .xterm-color-203 {\n    color: #ff5f5f;\n}\n\n.terminal .xterm-bg-color-203 {\n    background-color: #ff5f5f;\n}\n\n.terminal .xterm-color-204 {\n    color: #ff5f87;\n}\n\n.terminal .xterm-bg-color-204 {\n    background-color: #ff5f87;\n}\n\n.terminal .xterm-color-205 {\n    color: #ff5faf;\n}\n\n.terminal .xterm-bg-color-205 {\n    background-color: #ff5faf;\n}\n\n.terminal .xterm-color-206 {\n    color: #ff5fd7;\n}\n\n.terminal .xterm-bg-color-206 {\n    background-color: #ff5fd7;\n}\n\n.terminal .xterm-color-207 {\n    color: #ff5fff;\n}\n\n.terminal .xterm-bg-color-207 {\n    background-color: #ff5fff;\n}\n\n.terminal .xterm-color-208 {\n    color: #ff8700;\n}\n\n.terminal .xterm-bg-color-208 {\n    background-color: #ff8700;\n}\n\n.terminal .xterm-color-209 {\n    color: #ff875f;\n}\n\n.terminal .xterm-bg-color-209 {\n    background-color: #ff875f;\n}\n\n.terminal .xterm-color-210 {\n    color: #ff8787;\n}\n\n.terminal .xterm-bg-color-210 {\n    background-color: #ff8787;\n}\n\n.terminal .xterm-color-211 {\n    color: #ff87af;\n}\n\n.terminal .xterm-bg-color-211 {\n    background-color: #ff87af;\n}\n\n.terminal .xterm-color-212 {\n    color: #ff87d7;\n}\n\n.terminal .xterm-bg-color-212 {\n    background-color: #ff87d7;\n}\n\n.terminal .xterm-color-213 {\n    color: #ff87ff;\n}\n\n.terminal .xterm-bg-color-213 {\n    background-color: #ff87ff;\n}\n\n.terminal .xterm-color-214 {\n    color: #ffaf00;\n}\n\n.terminal .xterm-bg-color-214 {\n    background-color: #ffaf00;\n}\n\n.terminal .xterm-color-215 {\n    color: #ffaf5f;\n}\n\n.terminal .xterm-bg-color-215 {\n    background-color: #ffaf5f;\n}\n\n.terminal .xterm-color-216 {\n    color: #ffaf87;\n}\n\n.terminal .xterm-bg-color-216 {\n    background-color: #ffaf87;\n}\n\n.terminal .xterm-color-217 {\n    color: #ffafaf;\n}\n\n.terminal .xterm-bg-color-217 {\n    background-color: #ffafaf;\n}\n\n.terminal .xterm-color-218 {\n    color: #ffafd7;\n}\n\n.terminal .xterm-bg-color-218 {\n    background-color: #ffafd7;\n}\n\n.terminal .xterm-color-219 {\n    color: #ffafff;\n}\n\n.terminal .xterm-bg-color-219 {\n    background-color: #ffafff;\n}\n\n.terminal .xterm-color-220 {\n    color: #ffd700;\n}\n\n.terminal .xterm-bg-color-220 {\n    background-color: #ffd700;\n}\n\n.terminal .xterm-color-221 {\n    color: #ffd75f;\n}\n\n.terminal .xterm-bg-color-221 {\n    background-color: #ffd75f;\n}\n\n.terminal .xterm-color-222 {\n    color: #ffd787;\n}\n\n.terminal .xterm-bg-color-222 {\n    background-color: #ffd787;\n}\n\n.terminal .xterm-color-223 {\n    color: #ffd7af;\n}\n\n.terminal .xterm-bg-color-223 {\n    background-color: #ffd7af;\n}\n\n.terminal .xterm-color-224 {\n    color: #ffd7d7;\n}\n\n.terminal .xterm-bg-color-224 {\n    background-color: #ffd7d7;\n}\n\n.terminal .xterm-color-225 {\n    color: #ffd7ff;\n}\n\n.terminal .xterm-bg-color-225 {\n    background-color: #ffd7ff;\n}\n\n.terminal .xterm-color-226 {\n    color: #ffff00;\n}\n\n.terminal .xterm-bg-color-226 {\n    background-color: #ffff00;\n}\n\n.terminal .xterm-color-227 {\n    color: #ffff5f;\n}\n\n.terminal .xterm-bg-color-227 {\n    background-color: #ffff5f;\n}\n\n.terminal .xterm-color-228 {\n    color: #ffff87;\n}\n\n.terminal .xterm-bg-color-228 {\n    background-color: #ffff87;\n}\n\n.terminal .xterm-color-229 {\n    color: #ffffaf;\n}\n\n.terminal .xterm-bg-color-229 {\n    background-color: #ffffaf;\n}\n\n.terminal .xterm-color-230 {\n    color: #ffffd7;\n}\n\n.terminal .xterm-bg-color-230 {\n    background-color: #ffffd7;\n}\n\n.terminal .xterm-color-231 {\n    color: #ffffff;\n}\n\n.terminal .xterm-bg-color-231 {\n    background-color: #ffffff;\n}\n\n.terminal .xterm-color-232 {\n    color: #080808;\n}\n\n.terminal .xterm-bg-color-232 {\n    background-color: #080808;\n}\n\n.terminal .xterm-color-233 {\n    color: #121212;\n}\n\n.terminal .xterm-bg-color-233 {\n    background-color: #121212;\n}\n\n.terminal .xterm-color-234 {\n    color: #1c1c1c;\n}\n\n.terminal .xterm-bg-color-234 {\n    background-color: #1c1c1c;\n}\n\n.terminal .xterm-color-235 {\n    color: #262626;\n}\n\n.terminal .xterm-bg-color-235 {\n    background-color: #262626;\n}\n\n.terminal .xterm-color-236 {\n    color: #303030;\n}\n\n.terminal .xterm-bg-color-236 {\n    background-color: #303030;\n}\n\n.terminal .xterm-color-237 {\n    color: #3a3a3a;\n}\n\n.terminal .xterm-bg-color-237 {\n    background-color: #3a3a3a;\n}\n\n.terminal .xterm-color-238 {\n    color: #444444;\n}\n\n.terminal .xterm-bg-color-238 {\n    background-color: #444444;\n}\n\n.terminal .xterm-color-239 {\n    color: #4e4e4e;\n}\n\n.terminal .xterm-bg-color-239 {\n    background-color: #4e4e4e;\n}\n\n.terminal .xterm-color-240 {\n    color: #585858;\n}\n\n.terminal .xterm-bg-color-240 {\n    background-color: #585858;\n}\n\n.terminal .xterm-color-241 {\n    color: #626262;\n}\n\n.terminal .xterm-bg-color-241 {\n    background-color: #626262;\n}\n\n.terminal .xterm-color-242 {\n    color: #6c6c6c;\n}\n\n.terminal .xterm-bg-color-242 {\n    background-color: #6c6c6c;\n}\n\n.terminal .xterm-color-243 {\n    color: #767676;\n}\n\n.terminal .xterm-bg-color-243 {\n    background-color: #767676;\n}\n\n.terminal .xterm-color-244 {\n    color: #808080;\n}\n\n.terminal .xterm-bg-color-244 {\n    background-color: #808080;\n}\n\n.terminal .xterm-color-245 {\n    color: #8a8a8a;\n}\n\n.terminal .xterm-bg-color-245 {\n    background-color: #8a8a8a;\n}\n\n.terminal .xterm-color-246 {\n    color: #949494;\n}\n\n.terminal .xterm-bg-color-246 {\n    background-color: #949494;\n}\n\n.terminal .xterm-color-247 {\n    color: #9e9e9e;\n}\n\n.terminal .xterm-bg-color-247 {\n    background-color: #9e9e9e;\n}\n\n.terminal .xterm-color-248 {\n    color: #a8a8a8;\n}\n\n.terminal .xterm-bg-color-248 {\n    background-color: #a8a8a8;\n}\n\n.terminal .xterm-color-249 {\n    color: #b2b2b2;\n}\n\n.terminal .xterm-bg-color-249 {\n    background-color: #b2b2b2;\n}\n\n.terminal .xterm-color-250 {\n    color: #bcbcbc;\n}\n\n.terminal .xterm-bg-color-250 {\n    background-color: #bcbcbc;\n}\n\n.terminal .xterm-color-251 {\n    color: #c6c6c6;\n}\n\n.terminal .xterm-bg-color-251 {\n    background-color: #c6c6c6;\n}\n\n.terminal .xterm-color-252 {\n    color: #d0d0d0;\n}\n\n.terminal .xterm-bg-color-252 {\n    background-color: #d0d0d0;\n}\n\n.terminal .xterm-color-253 {\n    color: #dadada;\n}\n\n.terminal .xterm-bg-color-253 {\n    background-color: #dadada;\n}\n\n.terminal .xterm-color-254 {\n    color: #e4e4e4;\n}\n\n.terminal .xterm-bg-color-254 {\n    background-color: #e4e4e4;\n}\n\n.terminal .xterm-color-255 {\n    color: #eeeeee;\n}\n\n.terminal .xterm-bg-color-255 {\n    background-color: #eeeeee;\n}\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Buffer_1 = __webpack_require__(27);
var EventEmitter_1 = __webpack_require__(2);
var BufferSet = function (_super) {
    __extends(BufferSet, _super);
    function BufferSet(_terminal) {
        var _this = _super.call(this) || this;
        _this._terminal = _terminal;
        _this._normal = new Buffer_1.Buffer(_this._terminal);
        _this._normal.fillViewportRows();
        _this._alt = new Buffer_1.Buffer(_this._terminal);
        _this._activeBuffer = _this._normal;
        return _this;
    }
    Object.defineProperty(BufferSet.prototype, "alt", {
        get: function get() {
            return this._alt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferSet.prototype, "active", {
        get: function get() {
            return this._activeBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferSet.prototype, "normal", {
        get: function get() {
            return this._normal;
        },
        enumerable: true,
        configurable: true
    });
    BufferSet.prototype.activateNormalBuffer = function () {
        this._alt.clear();
        this._activeBuffer = this._normal;
        this.emit('activate', this._normal);
    };
    BufferSet.prototype.activateAltBuffer = function () {
        this._alt.fillViewportRows();
        this._activeBuffer = this._alt;
        this.emit('activate', this._alt);
    };
    BufferSet.prototype.resize = function (newCols, newRows) {
        this._normal.resize(newCols, newRows);
        this._alt.resize(newCols, newRows);
    };
    return BufferSet;
}(EventEmitter_1.EventEmitter);
exports.BufferSet = BufferSet;

//# sourceMappingURL=BufferSet.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var CircularList_1 = __webpack_require__(28);
var Buffer = function () {
    function Buffer(_terminal) {
        this._terminal = _terminal;
        this.clear();
    }
    Object.defineProperty(Buffer.prototype, "lines", {
        get: function get() {
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    Buffer.prototype.fillViewportRows = function () {
        if (this._lines.length === 0) {
            var i = this._terminal.rows;
            while (i--) {
                this.lines.push(this._terminal.blankLine());
            }
        }
    };
    Buffer.prototype.clear = function () {
        this.ydisp = 0;
        this.ybase = 0;
        this.y = 0;
        this.x = 0;
        this.scrollBottom = 0;
        this.scrollTop = 0;
        this.tabs = {};
        this._lines = new CircularList_1.CircularList(this._terminal.scrollback);
        this.scrollBottom = this._terminal.rows - 1;
    };
    Buffer.prototype.resize = function (newCols, newRows) {
        if (this._lines.length === 0) {
            return;
        }
        if (this._terminal.cols < newCols) {
            var ch = [this._terminal.defAttr, ' ', 1];
            for (var i = 0; i < this._lines.length; i++) {
                if (this._lines.get(i) === undefined) {
                    this._lines.set(i, this._terminal.blankLine(undefined, undefined, newCols));
                }
                while (this._lines.get(i).length < newCols) {
                    this._lines.get(i).push(ch);
                }
            }
        }
        var addToY = 0;
        if (this._terminal.rows < newRows) {
            for (var y = this._terminal.rows; y < newRows; y++) {
                if (this._lines.length < newRows + this.ybase) {
                    if (this.ybase > 0 && this._lines.length <= this.ybase + this.y + addToY + 1) {
                        this.ybase--;
                        addToY++;
                        if (this.ydisp > 0) {
                            this.ydisp--;
                        }
                    } else {
                        this._lines.push(this._terminal.blankLine(undefined, undefined, newCols));
                    }
                }
            }
        } else {
            for (var y = this._terminal.rows; y > newRows; y--) {
                if (this._lines.length > newRows + this.ybase) {
                    if (this._lines.length > this.ybase + this.y + 1) {
                        this._lines.pop();
                    } else {
                        this.ybase++;
                        this.ydisp++;
                    }
                }
            }
        }
        if (this.y >= newRows) {
            this.y = newRows - 1;
        }
        if (addToY) {
            this.y += addToY;
        }
        if (this.x >= newCols) {
            this.x = newCols - 1;
        }
        this.scrollTop = 0;
        this.scrollBottom = newRows - 1;
    };
    return Buffer;
}();
exports.Buffer = Buffer;

//# sourceMappingURL=Buffer.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = __webpack_require__(2);
var CircularList = function (_super) {
    __extends(CircularList, _super);
    function CircularList(maxLength) {
        var _this = _super.call(this) || this;
        _this._array = new Array(maxLength);
        _this._startIndex = 0;
        _this._length = 0;
        return _this;
    }
    Object.defineProperty(CircularList.prototype, "maxLength", {
        get: function get() {
            return this._array.length;
        },
        set: function set(newMaxLength) {
            var newArray = new Array(newMaxLength);
            for (var i = 0; i < Math.min(newMaxLength, this.length); i++) {
                newArray[i] = this._array[this._getCyclicIndex(i)];
            }
            this._array = newArray;
            this._startIndex = 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CircularList.prototype, "length", {
        get: function get() {
            return this._length;
        },
        set: function set(newLength) {
            if (newLength > this._length) {
                for (var i = this._length; i < newLength; i++) {
                    this._array[i] = undefined;
                }
            }
            this._length = newLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CircularList.prototype, "forEach", {
        get: function get() {
            var _this = this;
            return function (callbackfn) {
                var i = 0;
                var length = _this.length;
                for (var i_1 = 0; i_1 < length; i_1++) {
                    callbackfn(_this.get(i_1), i_1);
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    CircularList.prototype.get = function (index) {
        return this._array[this._getCyclicIndex(index)];
    };
    CircularList.prototype.set = function (index, value) {
        this._array[this._getCyclicIndex(index)] = value;
    };
    CircularList.prototype.push = function (value) {
        this._array[this._getCyclicIndex(this._length)] = value;
        if (this._length === this.maxLength) {
            this._startIndex++;
            if (this._startIndex === this.maxLength) {
                this._startIndex = 0;
            }
            this.emit('trim', 1);
        } else {
            this._length++;
        }
    };
    CircularList.prototype.pop = function () {
        return this._array[this._getCyclicIndex(this._length-- - 1)];
    };
    CircularList.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        if (deleteCount) {
            for (var i = start; i < this._length - deleteCount; i++) {
                this._array[this._getCyclicIndex(i)] = this._array[this._getCyclicIndex(i + deleteCount)];
            }
            this._length -= deleteCount;
        }
        if (items && items.length) {
            for (var i = this._length - 1; i >= start; i--) {
                this._array[this._getCyclicIndex(i + items.length)] = this._array[this._getCyclicIndex(i)];
            }
            for (var i = 0; i < items.length; i++) {
                this._array[this._getCyclicIndex(start + i)] = items[i];
            }
            if (this._length + items.length > this.maxLength) {
                var countToTrim = this._length + items.length - this.maxLength;
                this._startIndex += countToTrim;
                this._length = this.maxLength;
                this.emit('trim', countToTrim);
            } else {
                this._length += items.length;
            }
        }
    };
    CircularList.prototype.trimStart = function (count) {
        if (count > this._length) {
            count = this._length;
        }
        this._startIndex += count;
        this._length -= count;
        this.emit('trim', count);
    };
    CircularList.prototype.shiftElements = function (start, count, offset) {
        if (count <= 0) {
            return;
        }
        if (start < 0 || start >= this._length) {
            throw new Error('start argument out of range');
        }
        if (start + offset < 0) {
            throw new Error('Cannot shift elements in list beyond index 0');
        }
        if (offset > 0) {
            for (var i = count - 1; i >= 0; i--) {
                this.set(start + i + offset, this.get(start + i));
            }
            var expandListBy = start + count + offset - this._length;
            if (expandListBy > 0) {
                this._length += expandListBy;
                while (this._length > this.maxLength) {
                    this._length--;
                    this._startIndex++;
                    this.emit('trim', 1);
                }
            }
        } else {
            for (var i = 0; i < count; i++) {
                this.set(start + i + offset, this.get(start + i));
            }
        }
    };
    CircularList.prototype._getCyclicIndex = function (index) {
        return (this._startIndex + index) % this.maxLength;
    };
    return CircularList;
}(EventEmitter_1.EventEmitter);
exports.CircularList = CircularList;

//# sourceMappingURL=CircularList.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var CompositionHelper = function () {
    function CompositionHelper(textarea, compositionView, terminal) {
        this.textarea = textarea;
        this.compositionView = compositionView;
        this.terminal = terminal;
        this.isComposing = false;
        this.isSendingComposition = false;
        this.compositionPosition = { start: null, end: null };
    }
    CompositionHelper.prototype.compositionstart = function () {
        this.isComposing = true;
        this.compositionPosition.start = this.textarea.value.length;
        this.compositionView.textContent = '';
        this.compositionView.classList.add('active');
    };
    CompositionHelper.prototype.compositionupdate = function (ev) {
        var _this = this;
        this.compositionView.textContent = ev.data;
        this.updateCompositionElements();
        setTimeout(function () {
            _this.compositionPosition.end = _this.textarea.value.length;
        }, 0);
    };
    CompositionHelper.prototype.compositionend = function () {
        this.finalizeComposition(true);
    };
    CompositionHelper.prototype.keydown = function (ev) {
        if (this.isComposing || this.isSendingComposition) {
            if (ev.keyCode === 229) {
                return false;
            } else if (ev.keyCode === 16 || ev.keyCode === 17 || ev.keyCode === 18) {
                return false;
            } else {
                this.finalizeComposition(false);
            }
        }
        if (ev.keyCode === 229) {
            this.handleAnyTextareaChanges();
            return false;
        }
        return true;
    };
    CompositionHelper.prototype.finalizeComposition = function (waitForPropogation) {
        var _this = this;
        this.compositionView.classList.remove('active');
        this.isComposing = false;
        this.clearTextareaPosition();
        if (!waitForPropogation) {
            this.isSendingComposition = false;
            var input = this.textarea.value.substring(this.compositionPosition.start, this.compositionPosition.end);
            this.terminal.handler(input);
        } else {
            var currentCompositionPosition_1 = {
                start: this.compositionPosition.start,
                end: this.compositionPosition.end
            };
            this.isSendingComposition = true;
            setTimeout(function () {
                if (_this.isSendingComposition) {
                    _this.isSendingComposition = false;
                    var input = void 0;
                    if (_this.isComposing) {
                        input = _this.textarea.value.substring(currentCompositionPosition_1.start, currentCompositionPosition_1.end);
                    } else {
                        input = _this.textarea.value.substring(currentCompositionPosition_1.start);
                    }
                    _this.terminal.handler(input);
                }
            }, 0);
        }
    };
    CompositionHelper.prototype.handleAnyTextareaChanges = function () {
        var _this = this;
        var oldValue = this.textarea.value;
        setTimeout(function () {
            if (!_this.isComposing) {
                var newValue = _this.textarea.value;
                var diff = newValue.replace(oldValue, '');
                if (diff.length > 0) {
                    _this.terminal.handler(diff);
                }
            }
        }, 0);
    };
    CompositionHelper.prototype.updateCompositionElements = function (dontRecurse) {
        var _this = this;
        if (!this.isComposing) {
            return;
        }
        var cursor = this.terminal.element.querySelector('.terminal-cursor');
        if (cursor) {
            var xtermRows = this.terminal.element.querySelector('.xterm-rows');
            var cursorTop = xtermRows.offsetTop + cursor.offsetTop;
            this.compositionView.style.left = cursor.offsetLeft + 'px';
            this.compositionView.style.top = cursorTop + 'px';
            this.compositionView.style.height = cursor.offsetHeight + 'px';
            this.compositionView.style.lineHeight = cursor.offsetHeight + 'px';
            var compositionViewBounds = this.compositionView.getBoundingClientRect();
            this.textarea.style.left = cursor.offsetLeft + 'px';
            this.textarea.style.top = cursorTop + 'px';
            this.textarea.style.width = compositionViewBounds.width + 'px';
            this.textarea.style.height = compositionViewBounds.height + 'px';
            this.textarea.style.lineHeight = compositionViewBounds.height + 'px';
        }
        if (!dontRecurse) {
            setTimeout(function () {
                return _this.updateCompositionElements(true);
            }, 0);
        }
    };
    ;
    CompositionHelper.prototype.clearTextareaPosition = function () {
        this.textarea.style.left = '';
        this.textarea.style.top = '';
    };
    ;
    return CompositionHelper;
}();
exports.CompositionHelper = CompositionHelper;

//# sourceMappingURL=CompositionHelper.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Viewport = function () {
    function Viewport(terminal, viewportElement, scrollArea, charMeasure) {
        var _this = this;
        this.terminal = terminal;
        this.viewportElement = viewportElement;
        this.scrollArea = scrollArea;
        this.charMeasure = charMeasure;
        this.currentRowHeight = 0;
        this.lastRecordedBufferLength = 0;
        this.lastRecordedViewportHeight = 0;
        this.terminal.on('scroll', this.syncScrollArea.bind(this));
        this.terminal.on('resize', this.syncScrollArea.bind(this));
        this.viewportElement.addEventListener('scroll', this.onScroll.bind(this));
        setTimeout(function () {
            return _this.syncScrollArea();
        }, 0);
    }
    Viewport.prototype.refresh = function () {
        if (this.charMeasure.height > 0) {
            var rowHeightChanged = this.charMeasure.height !== this.currentRowHeight;
            if (rowHeightChanged) {
                this.currentRowHeight = this.charMeasure.height;
                this.viewportElement.style.lineHeight = this.charMeasure.height + 'px';
                this.terminal.rowContainer.style.lineHeight = this.charMeasure.height + 'px';
            }
            var viewportHeightChanged = this.lastRecordedViewportHeight !== this.terminal.rows;
            if (rowHeightChanged || viewportHeightChanged) {
                this.lastRecordedViewportHeight = this.terminal.rows;
                this.viewportElement.style.height = this.charMeasure.height * this.terminal.rows + 'px';
                this.terminal.selectionContainer.style.height = this.viewportElement.style.height;
            }
            this.scrollArea.style.height = this.charMeasure.height * this.lastRecordedBufferLength + 'px';
        }
    };
    Viewport.prototype.syncScrollArea = function () {
        if (this.lastRecordedBufferLength !== this.terminal.buffer.lines.length) {
            this.lastRecordedBufferLength = this.terminal.buffer.lines.length;
            this.refresh();
        } else if (this.lastRecordedViewportHeight !== this.terminal.rows) {
            this.refresh();
        } else {
            if (this.charMeasure.height !== this.currentRowHeight) {
                this.refresh();
            }
        }
        var scrollTop = this.terminal.buffer.ydisp * this.currentRowHeight;
        if (this.viewportElement.scrollTop !== scrollTop) {
            this.viewportElement.scrollTop = scrollTop;
        }
    };
    Viewport.prototype.onScroll = function (ev) {
        var newRow = Math.round(this.viewportElement.scrollTop / this.currentRowHeight);
        var diff = newRow - this.terminal.buffer.ydisp;
        this.terminal.scrollDisp(diff, true);
    };
    Viewport.prototype.onWheel = function (ev) {
        if (ev.deltaY === 0) {
            return;
        }
        var multiplier = 1;
        if (ev.deltaMode === WheelEvent.DOM_DELTA_LINE) {
            multiplier = this.currentRowHeight;
        } else if (ev.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
            multiplier = this.currentRowHeight * this.terminal.rows;
        }
        this.viewportElement.scrollTop += ev.deltaY * multiplier;
        ev.preventDefault();
    };
    ;
    Viewport.prototype.onTouchStart = function (ev) {
        this.lastTouchY = ev.touches[0].pageY;
    };
    ;
    Viewport.prototype.onTouchMove = function (ev) {
        var deltaY = this.lastTouchY - ev.touches[0].pageY;
        this.lastTouchY = ev.touches[0].pageY;
        if (deltaY === 0) {
            return;
        }
        this.viewportElement.scrollTop += deltaY;
        ev.preventDefault();
    };
    ;
    return Viewport;
}();
exports.Viewport = Viewport;

//# sourceMappingURL=Viewport.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function prepareTextForTerminal(text, isMSWindows) {
    if (isMSWindows) {
        return text.replace(/\r?\n/g, '\r');
    }
    return text;
}
exports.prepareTextForTerminal = prepareTextForTerminal;
function copyHandler(ev, term, selectionManager) {
    if (term.browser.isMSIE) {
        window.clipboardData.setData('Text', selectionManager.selectionText);
    } else {
        ev.clipboardData.setData('text/plain', selectionManager.selectionText);
    }
    ev.preventDefault();
}
exports.copyHandler = copyHandler;
function pasteHandler(ev, term) {
    ev.stopPropagation();
    var text;
    var dispatchPaste = function dispatchPaste(text) {
        text = prepareTextForTerminal(text, term.browser.isMSWindows);
        term.handler(text);
        term.textarea.value = '';
        term.emit('paste', text);
        return term.cancel(ev);
    };
    if (term.browser.isMSIE) {
        if (window.clipboardData) {
            text = window.clipboardData.getData('Text');
            dispatchPaste(text);
        }
    } else {
        if (ev.clipboardData) {
            text = ev.clipboardData.getData('text/plain');
            dispatchPaste(text);
        }
    }
}
exports.pasteHandler = pasteHandler;
function moveTextAreaUnderMouseCursor(ev, textarea) {
    textarea.style.position = 'fixed';
    textarea.style.width = '20px';
    textarea.style.height = '20px';
    textarea.style.left = ev.clientX - 10 + 'px';
    textarea.style.top = ev.clientY - 10 + 'px';
    textarea.style.zIndex = '1000';
    textarea.focus();
    setTimeout(function () {
        textarea.style.position = null;
        textarea.style.width = null;
        textarea.style.height = null;
        textarea.style.left = null;
        textarea.style.top = null;
        textarea.style.zIndex = null;
    }, 4);
}
exports.moveTextAreaUnderMouseCursor = moveTextAreaUnderMouseCursor;
function rightClickHandler(ev, textarea, selectionManager) {
    moveTextAreaUnderMouseCursor(ev, textarea);
    textarea.value = selectionManager.selectionText;
    textarea.select();
}
exports.rightClickHandler = rightClickHandler;

//# sourceMappingURL=Clipboard.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var EscapeSequences_1 = __webpack_require__(3);
var Charsets_1 = __webpack_require__(7);
var InputHandler = function () {
    function InputHandler(_terminal) {
        this._terminal = _terminal;
    }
    InputHandler.prototype.addChar = function (char, code) {
        if (char >= ' ') {
            var ch_width = exports.wcwidth(code);
            if (this._terminal.charset && this._terminal.charset[char]) {
                char = this._terminal.charset[char];
            }
            var row = this._terminal.buffer.y + this._terminal.buffer.ybase;
            if (!ch_width && this._terminal.buffer.x) {
                if (this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1]) {
                    if (!this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1][2]) {
                        if (this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 2]) this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 2][1] += char;
                    } else {
                        this._terminal.buffer.lines.get(row)[this._terminal.buffer.x - 1][1] += char;
                    }
                    this._terminal.updateRange(this._terminal.buffer.y);
                }
                return;
            }
            if (this._terminal.buffer.x + ch_width - 1 >= this._terminal.cols) {
                if (this._terminal.wraparoundMode) {
                    this._terminal.buffer.x = 0;
                    this._terminal.buffer.y++;
                    if (this._terminal.buffer.y > this._terminal.buffer.scrollBottom) {
                        this._terminal.buffer.y--;
                        this._terminal.scroll(true);
                    } else {
                        this._terminal.buffer.lines.get(this._terminal.buffer.y).isWrapped = true;
                    }
                } else {
                    if (ch_width === 2) return;
                }
            }
            row = this._terminal.buffer.y + this._terminal.buffer.ybase;
            if (this._terminal.insertMode) {
                for (var moves = 0; moves < ch_width; ++moves) {
                    var removed = this._terminal.buffer.lines.get(this._terminal.buffer.y + this._terminal.buffer.ybase).pop();
                    if (removed[2] === 0 && this._terminal.buffer.lines.get(row)[this._terminal.cols - 2] && this._terminal.buffer.lines.get(row)[this._terminal.cols - 2][2] === 2) {
                        this._terminal.buffer.lines.get(row)[this._terminal.cols - 2] = [this._terminal.curAttr, ' ', 1];
                    }
                    this._terminal.buffer.lines.get(row).splice(this._terminal.buffer.x, 0, [this._terminal.curAttr, ' ', 1]);
                }
            }
            this._terminal.buffer.lines.get(row)[this._terminal.buffer.x] = [this._terminal.curAttr, char, ch_width];
            this._terminal.buffer.x++;
            this._terminal.updateRange(this._terminal.buffer.y);
            if (ch_width === 2) {
                this._terminal.buffer.lines.get(row)[this._terminal.buffer.x] = [this._terminal.curAttr, '', 0];
                this._terminal.buffer.x++;
            }
        }
    };
    InputHandler.prototype.bell = function () {
        var _this = this;
        if (!this._terminal.visualBell) {
            return;
        }
        this._terminal.element.style.borderColor = 'white';
        setTimeout(function () {
            return _this._terminal.element.style.borderColor = '';
        }, 10);
        if (this._terminal.popOnBell) {
            this._terminal.focus();
        }
    };
    InputHandler.prototype.lineFeed = function () {
        if (this._terminal.convertEol) {
            this._terminal.buffer.x = 0;
        }
        this._terminal.buffer.y++;
        if (this._terminal.buffer.y > this._terminal.buffer.scrollBottom) {
            this._terminal.buffer.y--;
            this._terminal.scroll();
        }
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x--;
        }
        this._terminal.emit('lineFeed');
    };
    InputHandler.prototype.carriageReturn = function () {
        this._terminal.buffer.x = 0;
    };
    InputHandler.prototype.backspace = function () {
        if (this._terminal.buffer.x > 0) {
            this._terminal.buffer.x--;
        }
    };
    InputHandler.prototype.tab = function () {
        this._terminal.buffer.x = this._terminal.nextStop();
    };
    InputHandler.prototype.shiftOut = function () {
        this._terminal.setgLevel(1);
    };
    InputHandler.prototype.shiftIn = function () {
        this._terminal.setgLevel(0);
    };
    InputHandler.prototype.insertChars = function (params) {
        var param, row, j, ch;
        param = params[0];
        if (param < 1) param = 1;
        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
        j = this._terminal.buffer.x;
        ch = [this._terminal.eraseAttr(), ' ', 1];
        while (param-- && j < this._terminal.cols) {
            this._terminal.buffer.lines.get(row).splice(j++, 0, ch);
            this._terminal.buffer.lines.get(row).pop();
        }
    };
    InputHandler.prototype.cursorUp = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y -= param;
        if (this._terminal.buffer.y < 0) {
            this._terminal.buffer.y = 0;
        }
    };
    InputHandler.prototype.cursorDown = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y += param;
        if (this._terminal.buffer.y >= this._terminal.rows) {
            this._terminal.buffer.y = this._terminal.rows - 1;
        }
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x--;
        }
    };
    InputHandler.prototype.cursorForward = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.x += param;
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x = this._terminal.cols - 1;
        }
    };
    InputHandler.prototype.cursorBackward = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x--;
        }
        this._terminal.buffer.x -= param;
        if (this._terminal.buffer.x < 0) {
            this._terminal.buffer.x = 0;
        }
    };
    InputHandler.prototype.cursorNextLine = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y += param;
        if (this._terminal.buffer.y >= this._terminal.rows) {
            this._terminal.buffer.y = this._terminal.rows - 1;
        }
        this._terminal.buffer.x = 0;
    };
    InputHandler.prototype.cursorPrecedingLine = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y -= param;
        if (this._terminal.buffer.y < 0) {
            this._terminal.buffer.y = 0;
        }
        this._terminal.buffer.x = 0;
    };
    InputHandler.prototype.cursorCharAbsolute = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.x = param - 1;
    };
    InputHandler.prototype.cursorPosition = function (params) {
        var row, col;
        row = params[0] - 1;
        if (params.length >= 2) {
            col = params[1] - 1;
        } else {
            col = 0;
        }
        if (row < 0) {
            row = 0;
        } else if (row >= this._terminal.rows) {
            row = this._terminal.rows - 1;
        }
        if (col < 0) {
            col = 0;
        } else if (col >= this._terminal.cols) {
            col = this._terminal.cols - 1;
        }
        this._terminal.buffer.x = col;
        this._terminal.buffer.y = row;
    };
    InputHandler.prototype.cursorForwardTab = function (params) {
        var param = params[0] || 1;
        while (param--) {
            this._terminal.buffer.x = this._terminal.nextStop();
        }
    };
    InputHandler.prototype.eraseInDisplay = function (params) {
        var j;
        switch (params[0]) {
            case 0:
                this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y);
                j = this._terminal.buffer.y + 1;
                for (; j < this._terminal.rows; j++) {
                    this._terminal.eraseLine(j);
                }
                break;
            case 1:
                this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y);
                j = this._terminal.buffer.y;
                while (j--) {
                    this._terminal.eraseLine(j);
                }
                break;
            case 2:
                j = this._terminal.rows;
                while (j--) {
                    this._terminal.eraseLine(j);
                }break;
            case 3:
                var scrollBackSize = this._terminal.buffer.lines.length - this._terminal.rows;
                if (scrollBackSize > 0) {
                    this._terminal.buffer.lines.trimStart(scrollBackSize);
                    this._terminal.buffer.ybase = Math.max(this._terminal.buffer.ybase - scrollBackSize, 0);
                    this._terminal.buffer.ydisp = Math.max(this._terminal.buffer.ydisp - scrollBackSize, 0);
                    this._terminal.emit('scroll', 0);
                }
                break;
        }
    };
    InputHandler.prototype.eraseInLine = function (params) {
        switch (params[0]) {
            case 0:
                this._terminal.eraseRight(this._terminal.buffer.x, this._terminal.buffer.y);
                break;
            case 1:
                this._terminal.eraseLeft(this._terminal.buffer.x, this._terminal.buffer.y);
                break;
            case 2:
                this._terminal.eraseLine(this._terminal.buffer.y);
                break;
        }
    };
    InputHandler.prototype.insertLines = function (params) {
        var param, row, j;
        param = params[0];
        if (param < 1) {
            param = 1;
        }
        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
        j = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom;
        j = this._terminal.rows - 1 + this._terminal.buffer.ybase - j + 1;
        while (param--) {
            if (this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength) {
                this._terminal.buffer.lines.trimStart(1);
                this._terminal.buffer.ybase--;
                this._terminal.buffer.ydisp--;
                row--;
                j--;
            }
            this._terminal.buffer.lines.splice(row, 0, this._terminal.blankLine(true));
            this._terminal.buffer.lines.splice(j, 1);
        }
        this._terminal.updateRange(this._terminal.buffer.y);
        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
    };
    InputHandler.prototype.deleteLines = function (params) {
        var param, row, j;
        param = params[0];
        if (param < 1) {
            param = 1;
        }
        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
        j = this._terminal.rows - 1 - this._terminal.buffer.scrollBottom;
        j = this._terminal.rows - 1 + this._terminal.buffer.ybase - j;
        while (param--) {
            if (this._terminal.buffer.lines.length === this._terminal.buffer.lines.maxLength) {
                this._terminal.buffer.lines.trimStart(1);
                this._terminal.buffer.ybase -= 1;
                this._terminal.buffer.ydisp -= 1;
            }
            this._terminal.buffer.lines.splice(j + 1, 0, this._terminal.blankLine(true));
            this._terminal.buffer.lines.splice(row, 1);
        }
        this._terminal.updateRange(this._terminal.buffer.y);
        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
    };
    InputHandler.prototype.deleteChars = function (params) {
        var param, row, ch;
        param = params[0];
        if (param < 1) {
            param = 1;
        }
        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
        ch = [this._terminal.eraseAttr(), ' ', 1];
        while (param--) {
            this._terminal.buffer.lines.get(row).splice(this._terminal.buffer.x, 1);
            this._terminal.buffer.lines.get(row).push(ch);
        }
    };
    InputHandler.prototype.scrollUp = function (params) {
        var param = params[0] || 1;
        while (param--) {
            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 1);
            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 0, this._terminal.blankLine());
        }
        this._terminal.updateRange(this._terminal.buffer.scrollTop);
        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
    };
    InputHandler.prototype.scrollDown = function (params) {
        var param = params[0] || 1;
        while (param--) {
            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollBottom, 1);
            this._terminal.buffer.lines.splice(this._terminal.buffer.ybase + this._terminal.buffer.scrollTop, 0, this._terminal.blankLine());
        }
        this._terminal.updateRange(this._terminal.buffer.scrollTop);
        this._terminal.updateRange(this._terminal.buffer.scrollBottom);
    };
    InputHandler.prototype.eraseChars = function (params) {
        var param, row, j, ch;
        param = params[0];
        if (param < 1) {
            param = 1;
        }
        row = this._terminal.buffer.y + this._terminal.buffer.ybase;
        j = this._terminal.buffer.x;
        ch = [this._terminal.eraseAttr(), ' ', 1];
        while (param-- && j < this._terminal.cols) {
            this._terminal.buffer.lines.get(row)[j++] = ch;
        }
    };
    InputHandler.prototype.cursorBackwardTab = function (params) {
        var param = params[0] || 1;
        while (param--) {
            this._terminal.buffer.x = this._terminal.prevStop();
        }
    };
    InputHandler.prototype.charPosAbsolute = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.x = param - 1;
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x = this._terminal.cols - 1;
        }
    };
    InputHandler.prototype.HPositionRelative = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.x += param;
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x = this._terminal.cols - 1;
        }
    };
    InputHandler.prototype.repeatPrecedingCharacter = function (params) {
        var param = params[0] || 1,
            line = this._terminal.buffer.lines.get(this._terminal.buffer.ybase + this._terminal.buffer.y),
            ch = line[this._terminal.buffer.x - 1] || [this._terminal.defAttr, ' ', 1];
        while (param--) {
            line[this._terminal.buffer.x++] = ch;
        }
    };
    InputHandler.prototype.sendDeviceAttributes = function (params) {
        if (params[0] > 0) {
            return;
        }
        if (!this._terminal.prefix) {
            if (this._terminal.is('xterm') || this._terminal.is('rxvt-unicode') || this._terminal.is('screen')) {
                this._terminal.send(EscapeSequences_1.C0.ESC + '[?1;2c');
            } else if (this._terminal.is('linux')) {
                this._terminal.send(EscapeSequences_1.C0.ESC + '[?6c');
            }
        } else if (this._terminal.prefix === '>') {
            if (this._terminal.is('xterm')) {
                this._terminal.send(EscapeSequences_1.C0.ESC + '[>0;276;0c');
            } else if (this._terminal.is('rxvt-unicode')) {
                this._terminal.send(EscapeSequences_1.C0.ESC + '[>85;95;0c');
            } else if (this._terminal.is('linux')) {
                this._terminal.send(params[0] + 'c');
            } else if (this._terminal.is('screen')) {
                this._terminal.send(EscapeSequences_1.C0.ESC + '[>83;40003;0c');
            }
        }
    };
    InputHandler.prototype.linePosAbsolute = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y = param - 1;
        if (this._terminal.buffer.y >= this._terminal.rows) {
            this._terminal.buffer.y = this._terminal.rows - 1;
        }
    };
    InputHandler.prototype.VPositionRelative = function (params) {
        var param = params[0];
        if (param < 1) {
            param = 1;
        }
        this._terminal.buffer.y += param;
        if (this._terminal.buffer.y >= this._terminal.rows) {
            this._terminal.buffer.y = this._terminal.rows - 1;
        }
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x--;
        }
    };
    InputHandler.prototype.HVPosition = function (params) {
        if (params[0] < 1) params[0] = 1;
        if (params[1] < 1) params[1] = 1;
        this._terminal.buffer.y = params[0] - 1;
        if (this._terminal.buffer.y >= this._terminal.rows) {
            this._terminal.buffer.y = this._terminal.rows - 1;
        }
        this._terminal.buffer.x = params[1] - 1;
        if (this._terminal.buffer.x >= this._terminal.cols) {
            this._terminal.buffer.x = this._terminal.cols - 1;
        }
    };
    InputHandler.prototype.tabClear = function (params) {
        var param = params[0];
        if (param <= 0) {
            delete this._terminal.buffer.tabs[this._terminal.buffer.x];
        } else if (param === 3) {
            this._terminal.buffer.tabs = {};
        }
    };
    InputHandler.prototype.setMode = function (params) {
        if (params.length > 1) {
            for (var i = 0; i < params.length; i++) {
                this.setMode([params[i]]);
            }
            return;
        }
        if (!this._terminal.prefix) {
            switch (params[0]) {
                case 4:
                    this._terminal.insertMode = true;
                    break;
                case 20:
                    break;
            }
        } else if (this._terminal.prefix === '?') {
            switch (params[0]) {
                case 1:
                    this._terminal.applicationCursor = true;
                    break;
                case 2:
                    this._terminal.setgCharset(0, Charsets_1.DEFAULT_CHARSET);
                    this._terminal.setgCharset(1, Charsets_1.DEFAULT_CHARSET);
                    this._terminal.setgCharset(2, Charsets_1.DEFAULT_CHARSET);
                    this._terminal.setgCharset(3, Charsets_1.DEFAULT_CHARSET);
                    break;
                case 3:
                    this._terminal.savedCols = this._terminal.cols;
                    this._terminal.resize(132, this._terminal.rows);
                    break;
                case 6:
                    this._terminal.originMode = true;
                    break;
                case 7:
                    this._terminal.wraparoundMode = true;
                    break;
                case 12:
                    break;
                case 66:
                    this._terminal.log('Serial port requested application keypad.');
                    this._terminal.applicationKeypad = true;
                    this._terminal.viewport.syncScrollArea();
                    break;
                case 9:
                case 1000:
                case 1002:
                case 1003:
                    this._terminal.x10Mouse = params[0] === 9;
                    this._terminal.vt200Mouse = params[0] === 1000;
                    this._terminal.normalMouse = params[0] > 1000;
                    this._terminal.mouseEvents = true;
                    this._terminal.element.classList.add('enable-mouse-events');
                    this._terminal.selectionManager.disable();
                    this._terminal.log('Binding to mouse events.');
                    break;
                case 1004:
                    this._terminal.sendFocus = true;
                    break;
                case 1005:
                    this._terminal.utfMouse = true;
                    break;
                case 1006:
                    this._terminal.sgrMouse = true;
                    break;
                case 1015:
                    this._terminal.urxvtMouse = true;
                    break;
                case 25:
                    this._terminal.cursorHidden = false;
                    break;
                case 1049:
                case 47:
                case 1047:
                    this._terminal.buffers.activateAltBuffer();
                    this._terminal.viewport.syncScrollArea();
                    this._terminal.showCursor();
                    break;
            }
        }
    };
    InputHandler.prototype.resetMode = function (params) {
        if (params.length > 1) {
            for (var i = 0; i < params.length; i++) {
                this.resetMode([params[i]]);
            }
            return;
        }
        if (!this._terminal.prefix) {
            switch (params[0]) {
                case 4:
                    this._terminal.insertMode = false;
                    break;
                case 20:
                    break;
            }
        } else if (this._terminal.prefix === '?') {
            switch (params[0]) {
                case 1:
                    this._terminal.applicationCursor = false;
                    break;
                case 3:
                    if (this._terminal.cols === 132 && this._terminal.savedCols) {
                        this._terminal.resize(this._terminal.savedCols, this._terminal.rows);
                    }
                    delete this._terminal.savedCols;
                    break;
                case 6:
                    this._terminal.originMode = false;
                    break;
                case 7:
                    this._terminal.wraparoundMode = false;
                    break;
                case 12:
                    break;
                case 66:
                    this._terminal.log('Switching back to normal keypad.');
                    this._terminal.applicationKeypad = false;
                    this._terminal.viewport.syncScrollArea();
                    break;
                case 9:
                case 1000:
                case 1002:
                case 1003:
                    this._terminal.x10Mouse = false;
                    this._terminal.vt200Mouse = false;
                    this._terminal.normalMouse = false;
                    this._terminal.mouseEvents = false;
                    this._terminal.element.classList.remove('enable-mouse-events');
                    this._terminal.selectionManager.enable();
                    break;
                case 1004:
                    this._terminal.sendFocus = false;
                    break;
                case 1005:
                    this._terminal.utfMouse = false;
                    break;
                case 1006:
                    this._terminal.sgrMouse = false;
                    break;
                case 1015:
                    this._terminal.urxvtMouse = false;
                    break;
                case 25:
                    this._terminal.cursorHidden = true;
                    break;
                case 1049:
                case 47:
                case 1047:
                    this._terminal.buffers.activateNormalBuffer();
                    this._terminal.selectionManager.setBuffer(this._terminal.buffer.lines);
                    this._terminal.refresh(0, this._terminal.rows - 1);
                    this._terminal.viewport.syncScrollArea();
                    this._terminal.showCursor();
                    break;
            }
        }
    };
    InputHandler.prototype.charAttributes = function (params) {
        if (params.length === 1 && params[0] === 0) {
            this._terminal.curAttr = this._terminal.defAttr;
            return;
        }
        var l = params.length,
            i = 0,
            flags = this._terminal.curAttr >> 18,
            fg = this._terminal.curAttr >> 9 & 0x1ff,
            bg = this._terminal.curAttr & 0x1ff,
            p;
        for (; i < l; i++) {
            p = params[i];
            if (p >= 30 && p <= 37) {
                fg = p - 30;
            } else if (p >= 40 && p <= 47) {
                bg = p - 40;
            } else if (p >= 90 && p <= 97) {
                p += 8;
                fg = p - 90;
            } else if (p >= 100 && p <= 107) {
                p += 8;
                bg = p - 100;
            } else if (p === 0) {
                flags = this._terminal.defAttr >> 18;
                fg = this._terminal.defAttr >> 9 & 0x1ff;
                bg = this._terminal.defAttr & 0x1ff;
            } else if (p === 1) {
                flags |= 1;
            } else if (p === 4) {
                flags |= 2;
            } else if (p === 5) {
                flags |= 4;
            } else if (p === 7) {
                flags |= 8;
            } else if (p === 8) {
                flags |= 16;
            } else if (p === 22) {
                flags &= ~1;
            } else if (p === 24) {
                flags &= ~2;
            } else if (p === 25) {
                flags &= ~4;
            } else if (p === 27) {
                flags &= ~8;
            } else if (p === 28) {
                flags &= ~16;
            } else if (p === 39) {
                fg = this._terminal.defAttr >> 9 & 0x1ff;
            } else if (p === 49) {
                bg = this._terminal.defAttr & 0x1ff;
            } else if (p === 38) {
                if (params[i + 1] === 2) {
                    i += 2;
                    fg = this._terminal.matchColor(params[i] & 0xff, params[i + 1] & 0xff, params[i + 2] & 0xff);
                    if (fg === -1) fg = 0x1ff;
                    i += 2;
                } else if (params[i + 1] === 5) {
                    i += 2;
                    p = params[i] & 0xff;
                    fg = p;
                }
            } else if (p === 48) {
                if (params[i + 1] === 2) {
                    i += 2;
                    bg = this._terminal.matchColor(params[i] & 0xff, params[i + 1] & 0xff, params[i + 2] & 0xff);
                    if (bg === -1) bg = 0x1ff;
                    i += 2;
                } else if (params[i + 1] === 5) {
                    i += 2;
                    p = params[i] & 0xff;
                    bg = p;
                }
            } else if (p === 100) {
                fg = this._terminal.defAttr >> 9 & 0x1ff;
                bg = this._terminal.defAttr & 0x1ff;
            } else {
                this._terminal.error('Unknown SGR attribute: %d.', p);
            }
        }
        this._terminal.curAttr = flags << 18 | fg << 9 | bg;
    };
    InputHandler.prototype.deviceStatus = function (params) {
        if (!this._terminal.prefix) {
            switch (params[0]) {
                case 5:
                    this._terminal.send(EscapeSequences_1.C0.ESC + '[0n');
                    break;
                case 6:
                    this._terminal.send(EscapeSequences_1.C0.ESC + '[' + (this._terminal.buffer.y + 1) + ';' + (this._terminal.buffer.x + 1) + 'R');
                    break;
            }
        } else if (this._terminal.prefix === '?') {
            switch (params[0]) {
                case 6:
                    this._terminal.send(EscapeSequences_1.C0.ESC + '[?' + (this._terminal.buffer.y + 1) + ';' + (this._terminal.buffer.x + 1) + 'R');
                    break;
                case 15:
                    break;
                case 25:
                    break;
                case 26:
                    break;
                case 53:
                    break;
            }
        }
    };
    InputHandler.prototype.softReset = function (params) {
        this._terminal.cursorHidden = false;
        this._terminal.insertMode = false;
        this._terminal.originMode = false;
        this._terminal.wraparoundMode = true;
        this._terminal.applicationKeypad = false;
        this._terminal.viewport.syncScrollArea();
        this._terminal.applicationCursor = false;
        this._terminal.buffer.scrollTop = 0;
        this._terminal.buffer.scrollBottom = this._terminal.rows - 1;
        this._terminal.curAttr = this._terminal.defAttr;
        this._terminal.buffer.x = this._terminal.buffer.y = 0;
        this._terminal.charset = null;
        this._terminal.glevel = 0;
        this._terminal.charsets = [null];
    };
    InputHandler.prototype.setCursorStyle = function (params) {
        var param = params[0] < 1 ? 1 : params[0];
        switch (param) {
            case 1:
            case 2:
                this._terminal.setOption('cursorStyle', 'block');
                break;
            case 3:
            case 4:
                this._terminal.setOption('cursorStyle', 'underline');
                break;
            case 5:
            case 6:
                this._terminal.setOption('cursorStyle', 'bar');
                break;
        }
        var isBlinking = param % 2 === 1;
        this._terminal.setOption('cursorBlink', isBlinking);
    };
    InputHandler.prototype.setScrollRegion = function (params) {
        if (this._terminal.prefix) return;
        this._terminal.buffer.scrollTop = (params[0] || 1) - 1;
        this._terminal.buffer.scrollBottom = (params[1] && params[1] <= this._terminal.rows ? params[1] : this._terminal.rows) - 1;
        this._terminal.buffer.x = 0;
        this._terminal.buffer.y = 0;
    };
    InputHandler.prototype.saveCursor = function (params) {
        this._terminal.buffer.savedX = this._terminal.buffer.x;
        this._terminal.buffer.savedY = this._terminal.buffer.y;
    };
    InputHandler.prototype.restoreCursor = function (params) {
        this._terminal.buffer.x = this._terminal.buffer.savedX || 0;
        this._terminal.buffer.y = this._terminal.buffer.savedY || 0;
    };
    return InputHandler;
}();
exports.InputHandler = InputHandler;
exports.wcwidth = function (opts) {
    var COMBINING_BMP = [[0x0300, 0x036F], [0x0483, 0x0486], [0x0488, 0x0489], [0x0591, 0x05BD], [0x05BF, 0x05BF], [0x05C1, 0x05C2], [0x05C4, 0x05C5], [0x05C7, 0x05C7], [0x0600, 0x0603], [0x0610, 0x0615], [0x064B, 0x065E], [0x0670, 0x0670], [0x06D6, 0x06E4], [0x06E7, 0x06E8], [0x06EA, 0x06ED], [0x070F, 0x070F], [0x0711, 0x0711], [0x0730, 0x074A], [0x07A6, 0x07B0], [0x07EB, 0x07F3], [0x0901, 0x0902], [0x093C, 0x093C], [0x0941, 0x0948], [0x094D, 0x094D], [0x0951, 0x0954], [0x0962, 0x0963], [0x0981, 0x0981], [0x09BC, 0x09BC], [0x09C1, 0x09C4], [0x09CD, 0x09CD], [0x09E2, 0x09E3], [0x0A01, 0x0A02], [0x0A3C, 0x0A3C], [0x0A41, 0x0A42], [0x0A47, 0x0A48], [0x0A4B, 0x0A4D], [0x0A70, 0x0A71], [0x0A81, 0x0A82], [0x0ABC, 0x0ABC], [0x0AC1, 0x0AC5], [0x0AC7, 0x0AC8], [0x0ACD, 0x0ACD], [0x0AE2, 0x0AE3], [0x0B01, 0x0B01], [0x0B3C, 0x0B3C], [0x0B3F, 0x0B3F], [0x0B41, 0x0B43], [0x0B4D, 0x0B4D], [0x0B56, 0x0B56], [0x0B82, 0x0B82], [0x0BC0, 0x0BC0], [0x0BCD, 0x0BCD], [0x0C3E, 0x0C40], [0x0C46, 0x0C48], [0x0C4A, 0x0C4D], [0x0C55, 0x0C56], [0x0CBC, 0x0CBC], [0x0CBF, 0x0CBF], [0x0CC6, 0x0CC6], [0x0CCC, 0x0CCD], [0x0CE2, 0x0CE3], [0x0D41, 0x0D43], [0x0D4D, 0x0D4D], [0x0DCA, 0x0DCA], [0x0DD2, 0x0DD4], [0x0DD6, 0x0DD6], [0x0E31, 0x0E31], [0x0E34, 0x0E3A], [0x0E47, 0x0E4E], [0x0EB1, 0x0EB1], [0x0EB4, 0x0EB9], [0x0EBB, 0x0EBC], [0x0EC8, 0x0ECD], [0x0F18, 0x0F19], [0x0F35, 0x0F35], [0x0F37, 0x0F37], [0x0F39, 0x0F39], [0x0F71, 0x0F7E], [0x0F80, 0x0F84], [0x0F86, 0x0F87], [0x0F90, 0x0F97], [0x0F99, 0x0FBC], [0x0FC6, 0x0FC6], [0x102D, 0x1030], [0x1032, 0x1032], [0x1036, 0x1037], [0x1039, 0x1039], [0x1058, 0x1059], [0x1160, 0x11FF], [0x135F, 0x135F], [0x1712, 0x1714], [0x1732, 0x1734], [0x1752, 0x1753], [0x1772, 0x1773], [0x17B4, 0x17B5], [0x17B7, 0x17BD], [0x17C6, 0x17C6], [0x17C9, 0x17D3], [0x17DD, 0x17DD], [0x180B, 0x180D], [0x18A9, 0x18A9], [0x1920, 0x1922], [0x1927, 0x1928], [0x1932, 0x1932], [0x1939, 0x193B], [0x1A17, 0x1A18], [0x1B00, 0x1B03], [0x1B34, 0x1B34], [0x1B36, 0x1B3A], [0x1B3C, 0x1B3C], [0x1B42, 0x1B42], [0x1B6B, 0x1B73], [0x1DC0, 0x1DCA], [0x1DFE, 0x1DFF], [0x200B, 0x200F], [0x202A, 0x202E], [0x2060, 0x2063], [0x206A, 0x206F], [0x20D0, 0x20EF], [0x302A, 0x302F], [0x3099, 0x309A], [0xA806, 0xA806], [0xA80B, 0xA80B], [0xA825, 0xA826], [0xFB1E, 0xFB1E], [0xFE00, 0xFE0F], [0xFE20, 0xFE23], [0xFEFF, 0xFEFF], [0xFFF9, 0xFFFB]];
    var COMBINING_HIGH = [[0x10A01, 0x10A03], [0x10A05, 0x10A06], [0x10A0C, 0x10A0F], [0x10A38, 0x10A3A], [0x10A3F, 0x10A3F], [0x1D167, 0x1D169], [0x1D173, 0x1D182], [0x1D185, 0x1D18B], [0x1D1AA, 0x1D1AD], [0x1D242, 0x1D244], [0xE0001, 0xE0001], [0xE0020, 0xE007F], [0xE0100, 0xE01EF]];
    function bisearch(ucs, data) {
        var min = 0;
        var max = data.length - 1;
        var mid;
        if (ucs < data[0][0] || ucs > data[max][1]) return false;
        while (max >= min) {
            mid = min + max >> 1;
            if (ucs > data[mid][1]) min = mid + 1;else if (ucs < data[mid][0]) max = mid - 1;else return true;
        }
        return false;
    }
    function wcwidthBMP(ucs) {
        if (ucs === 0) return opts.nul;
        if (ucs < 32 || ucs >= 0x7f && ucs < 0xa0) return opts.control;
        if (bisearch(ucs, COMBINING_BMP)) return 0;
        if (isWideBMP(ucs)) {
            return 2;
        }
        return 1;
    }
    function isWideBMP(ucs) {
        return ucs >= 0x1100 && (ucs <= 0x115f || ucs === 0x2329 || ucs === 0x232a || ucs >= 0x2e80 && ucs <= 0xa4cf && ucs !== 0x303f || ucs >= 0xac00 && ucs <= 0xd7a3 || ucs >= 0xf900 && ucs <= 0xfaff || ucs >= 0xfe10 && ucs <= 0xfe19 || ucs >= 0xfe30 && ucs <= 0xfe6f || ucs >= 0xff00 && ucs <= 0xff60 || ucs >= 0xffe0 && ucs <= 0xffe6);
    }
    function wcwidthHigh(ucs) {
        if (bisearch(ucs, COMBINING_HIGH)) return 0;
        if (ucs >= 0x20000 && ucs <= 0x2fffd || ucs >= 0x30000 && ucs <= 0x3fffd) {
            return 2;
        }
        return 1;
    }
    var control = opts.control | 0;
    var table = null;
    function init_table() {
        var CODEPOINTS = 65536;
        var BITWIDTH = 2;
        var ITEMSIZE = 32;
        var CONTAINERSIZE = CODEPOINTS * BITWIDTH / ITEMSIZE;
        var CODEPOINTS_PER_ITEM = ITEMSIZE / BITWIDTH;
        table = typeof Uint32Array === 'undefined' ? new Array(CONTAINERSIZE) : new Uint32Array(CONTAINERSIZE);
        for (var i = 0; i < CONTAINERSIZE; ++i) {
            var num = 0;
            var pos = CODEPOINTS_PER_ITEM;
            while (pos--) {
                num = num << 2 | wcwidthBMP(CODEPOINTS_PER_ITEM * i + pos);
            }table[i] = num;
        }
        return table;
    }
    return function (num) {
        num = num | 0;
        if (num < 32) return control | 0;
        if (num < 127) return 1;
        var t = table || init_table();
        if (num < 65536) return t[num >> 4] >> ((num & 15) << 1) & 3;
        return wcwidthHigh(num);
    };
}({ nul: 0, control: 0 });

//# sourceMappingURL=InputHandler.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var EscapeSequences_1 = __webpack_require__(3);
var Charsets_1 = __webpack_require__(7);
var normalStateHandler = {};
normalStateHandler[EscapeSequences_1.C0.BEL] = function (parser, handler) {
    return handler.bell();
};
normalStateHandler[EscapeSequences_1.C0.LF] = function (parser, handler) {
    return handler.lineFeed();
};
normalStateHandler[EscapeSequences_1.C0.VT] = normalStateHandler[EscapeSequences_1.C0.LF];
normalStateHandler[EscapeSequences_1.C0.FF] = normalStateHandler[EscapeSequences_1.C0.LF];
normalStateHandler[EscapeSequences_1.C0.CR] = function (parser, handler) {
    return handler.carriageReturn();
};
normalStateHandler[EscapeSequences_1.C0.BS] = function (parser, handler) {
    return handler.backspace();
};
normalStateHandler[EscapeSequences_1.C0.HT] = function (parser, handler) {
    return handler.tab();
};
normalStateHandler[EscapeSequences_1.C0.SO] = function (parser, handler) {
    return handler.shiftOut();
};
normalStateHandler[EscapeSequences_1.C0.SI] = function (parser, handler) {
    return handler.shiftIn();
};
normalStateHandler[EscapeSequences_1.C0.ESC] = function (parser, handler) {
    return parser.setState(ParserState.ESCAPED);
};
var escapedStateHandler = {};
escapedStateHandler['['] = function (parser, terminal) {
    terminal.params = [];
    terminal.currentParam = 0;
    parser.setState(ParserState.CSI_PARAM);
};
escapedStateHandler[']'] = function (parser, terminal) {
    terminal.params = [];
    terminal.currentParam = 0;
    parser.setState(ParserState.OSC);
};
escapedStateHandler['P'] = function (parser, terminal) {
    terminal.params = [];
    terminal.currentParam = 0;
    parser.setState(ParserState.DCS);
};
escapedStateHandler['_'] = function (parser, terminal) {
    parser.setState(ParserState.IGNORE);
};
escapedStateHandler['^'] = function (parser, terminal) {
    parser.setState(ParserState.IGNORE);
};
escapedStateHandler['c'] = function (parser, terminal) {
    terminal.reset();
};
escapedStateHandler['E'] = function (parser, terminal) {
    terminal.buffer.x = 0;
    terminal.index();
    parser.setState(ParserState.NORMAL);
};
escapedStateHandler['D'] = function (parser, terminal) {
    terminal.index();
    parser.setState(ParserState.NORMAL);
};
escapedStateHandler['M'] = function (parser, terminal) {
    terminal.reverseIndex();
    parser.setState(ParserState.NORMAL);
};
escapedStateHandler['%'] = function (parser, terminal) {
    terminal.setgLevel(0);
    terminal.setgCharset(0, Charsets_1.DEFAULT_CHARSET);
    parser.setState(ParserState.NORMAL);
    parser.skipNextChar();
};
escapedStateHandler[EscapeSequences_1.C0.CAN] = function (parser) {
    return parser.setState(ParserState.NORMAL);
};
var csiParamStateHandler = {};
csiParamStateHandler['?'] = function (parser) {
    return parser.setPrefix('?');
};
csiParamStateHandler['>'] = function (parser) {
    return parser.setPrefix('>');
};
csiParamStateHandler['!'] = function (parser) {
    return parser.setPrefix('!');
};
csiParamStateHandler['0'] = function (parser) {
    return parser.setParam(parser.getParam() * 10);
};
csiParamStateHandler['1'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 1);
};
csiParamStateHandler['2'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 2);
};
csiParamStateHandler['3'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 3);
};
csiParamStateHandler['4'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 4);
};
csiParamStateHandler['5'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 5);
};
csiParamStateHandler['6'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 6);
};
csiParamStateHandler['7'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 7);
};
csiParamStateHandler['8'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 8);
};
csiParamStateHandler['9'] = function (parser) {
    return parser.setParam(parser.getParam() * 10 + 9);
};
csiParamStateHandler['$'] = function (parser) {
    return parser.setPostfix('$');
};
csiParamStateHandler['"'] = function (parser) {
    return parser.setPostfix('"');
};
csiParamStateHandler[' '] = function (parser) {
    return parser.setPostfix(' ');
};
csiParamStateHandler['\''] = function (parser) {
    return parser.setPostfix('\'');
};
csiParamStateHandler[';'] = function (parser) {
    return parser.finalizeParam();
};
csiParamStateHandler[EscapeSequences_1.C0.CAN] = function (parser) {
    return parser.setState(ParserState.NORMAL);
};
var csiStateHandler = {};
csiStateHandler['@'] = function (handler, params, prefix) {
    return handler.insertChars(params);
};
csiStateHandler['A'] = function (handler, params, prefix) {
    return handler.cursorUp(params);
};
csiStateHandler['B'] = function (handler, params, prefix) {
    return handler.cursorDown(params);
};
csiStateHandler['C'] = function (handler, params, prefix) {
    return handler.cursorForward(params);
};
csiStateHandler['D'] = function (handler, params, prefix) {
    return handler.cursorBackward(params);
};
csiStateHandler['E'] = function (handler, params, prefix) {
    return handler.cursorNextLine(params);
};
csiStateHandler['F'] = function (handler, params, prefix) {
    return handler.cursorPrecedingLine(params);
};
csiStateHandler['G'] = function (handler, params, prefix) {
    return handler.cursorCharAbsolute(params);
};
csiStateHandler['H'] = function (handler, params, prefix) {
    return handler.cursorPosition(params);
};
csiStateHandler['I'] = function (handler, params, prefix) {
    return handler.cursorForwardTab(params);
};
csiStateHandler['J'] = function (handler, params, prefix) {
    return handler.eraseInDisplay(params);
};
csiStateHandler['K'] = function (handler, params, prefix) {
    return handler.eraseInLine(params);
};
csiStateHandler['L'] = function (handler, params, prefix) {
    return handler.insertLines(params);
};
csiStateHandler['M'] = function (handler, params, prefix) {
    return handler.deleteLines(params);
};
csiStateHandler['P'] = function (handler, params, prefix) {
    return handler.deleteChars(params);
};
csiStateHandler['S'] = function (handler, params, prefix) {
    return handler.scrollUp(params);
};
csiStateHandler['T'] = function (handler, params, prefix) {
    if (params.length < 2 && !prefix) {
        handler.scrollDown(params);
    }
};
csiStateHandler['X'] = function (handler, params, prefix) {
    return handler.eraseChars(params);
};
csiStateHandler['Z'] = function (handler, params, prefix) {
    return handler.cursorBackwardTab(params);
};
csiStateHandler['`'] = function (handler, params, prefix) {
    return handler.charPosAbsolute(params);
};
csiStateHandler['a'] = function (handler, params, prefix) {
    return handler.HPositionRelative(params);
};
csiStateHandler['b'] = function (handler, params, prefix) {
    return handler.repeatPrecedingCharacter(params);
};
csiStateHandler['c'] = function (handler, params, prefix) {
    return handler.sendDeviceAttributes(params);
};
csiStateHandler['d'] = function (handler, params, prefix) {
    return handler.linePosAbsolute(params);
};
csiStateHandler['e'] = function (handler, params, prefix) {
    return handler.VPositionRelative(params);
};
csiStateHandler['f'] = function (handler, params, prefix) {
    return handler.HVPosition(params);
};
csiStateHandler['g'] = function (handler, params, prefix) {
    return handler.tabClear(params);
};
csiStateHandler['h'] = function (handler, params, prefix) {
    return handler.setMode(params);
};
csiStateHandler['l'] = function (handler, params, prefix) {
    return handler.resetMode(params);
};
csiStateHandler['m'] = function (handler, params, prefix) {
    return handler.charAttributes(params);
};
csiStateHandler['n'] = function (handler, params, prefix) {
    return handler.deviceStatus(params);
};
csiStateHandler['p'] = function (handler, params, prefix) {
    switch (prefix) {
        case '!':
            handler.softReset(params);
            break;
    }
};
csiStateHandler['q'] = function (handler, params, prefix, postfix) {
    if (postfix === ' ') {
        handler.setCursorStyle(params);
    }
};
csiStateHandler['r'] = function (handler, params) {
    return handler.setScrollRegion(params);
};
csiStateHandler['s'] = function (handler, params) {
    return handler.saveCursor(params);
};
csiStateHandler['u'] = function (handler, params) {
    return handler.restoreCursor(params);
};
csiStateHandler[EscapeSequences_1.C0.CAN] = function (handler, params, prefix, postfix, parser) {
    return parser.setState(ParserState.NORMAL);
};
var ParserState;
(function (ParserState) {
    ParserState[ParserState["NORMAL"] = 0] = "NORMAL";
    ParserState[ParserState["ESCAPED"] = 1] = "ESCAPED";
    ParserState[ParserState["CSI_PARAM"] = 2] = "CSI_PARAM";
    ParserState[ParserState["CSI"] = 3] = "CSI";
    ParserState[ParserState["OSC"] = 4] = "OSC";
    ParserState[ParserState["CHARSET"] = 5] = "CHARSET";
    ParserState[ParserState["DCS"] = 6] = "DCS";
    ParserState[ParserState["IGNORE"] = 7] = "IGNORE";
})(ParserState || (ParserState = {}));
var Parser = function () {
    function Parser(_inputHandler, _terminal) {
        this._inputHandler = _inputHandler;
        this._terminal = _terminal;
        this._state = ParserState.NORMAL;
    }
    Parser.prototype.parse = function (data) {
        var l = data.length,
            j,
            cs,
            ch,
            code,
            low;
        if (this._terminal.debug) {
            this._terminal.log('data: ' + data);
        }
        this._position = 0;
        if (this._terminal.surrogate_high) {
            data = this._terminal.surrogate_high + data;
            this._terminal.surrogate_high = '';
        }
        for (; this._position < l; this._position++) {
            ch = data[this._position];
            code = data.charCodeAt(this._position);
            if (0xD800 <= code && code <= 0xDBFF) {
                low = data.charCodeAt(this._position + 1);
                if (isNaN(low)) {
                    this._terminal.surrogate_high = ch;
                    continue;
                }
                code = (code - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
                ch += data.charAt(this._position + 1);
            }
            if (0xDC00 <= code && code <= 0xDFFF) continue;
            switch (this._state) {
                case ParserState.NORMAL:
                    if (ch in normalStateHandler) {
                        normalStateHandler[ch](this, this._inputHandler);
                    } else {
                        this._inputHandler.addChar(ch, code);
                    }
                    break;
                case ParserState.ESCAPED:
                    if (ch in escapedStateHandler) {
                        escapedStateHandler[ch](this, this._terminal);
                        break;
                    }
                    switch (ch) {
                        case '(':
                        case ')':
                        case '*':
                        case '+':
                        case '-':
                        case '.':
                            switch (ch) {
                                case '(':
                                    this._terminal.gcharset = 0;
                                    break;
                                case ')':
                                    this._terminal.gcharset = 1;
                                    break;
                                case '*':
                                    this._terminal.gcharset = 2;
                                    break;
                                case '+':
                                    this._terminal.gcharset = 3;
                                    break;
                                case '-':
                                    this._terminal.gcharset = 1;
                                    break;
                                case '.':
                                    this._terminal.gcharset = 2;
                                    break;
                            }
                            this._state = ParserState.CHARSET;
                            break;
                        case '/':
                            this._terminal.gcharset = 3;
                            this._state = ParserState.CHARSET;
                            this._position--;
                            break;
                        case 'N':
                            break;
                        case 'O':
                            break;
                        case 'n':
                            this._terminal.setgLevel(2);
                            break;
                        case 'o':
                            this._terminal.setgLevel(3);
                            break;
                        case '|':
                            this._terminal.setgLevel(3);
                            break;
                        case '}':
                            this._terminal.setgLevel(2);
                            break;
                        case '~':
                            this._terminal.setgLevel(1);
                            break;
                        case '7':
                            this._inputHandler.saveCursor();
                            this._state = ParserState.NORMAL;
                            break;
                        case '8':
                            this._inputHandler.restoreCursor();
                            this._state = ParserState.NORMAL;
                            break;
                        case '#':
                            this._state = ParserState.NORMAL;
                            this._position++;
                            break;
                        case 'H':
                            this._terminal.tabSet();
                            this._state = ParserState.NORMAL;
                            break;
                        case '=':
                            this._terminal.log('Serial port requested application keypad.');
                            this._terminal.applicationKeypad = true;
                            this._terminal.viewport.syncScrollArea();
                            this._state = ParserState.NORMAL;
                            break;
                        case '>':
                            this._terminal.log('Switching back to normal keypad.');
                            this._terminal.applicationKeypad = false;
                            this._terminal.viewport.syncScrollArea();
                            this._state = ParserState.NORMAL;
                            break;
                        default:
                            this._state = ParserState.NORMAL;
                            this._terminal.error('Unknown ESC control: %s.', ch);
                            break;
                    }
                    break;
                case ParserState.CHARSET:
                    if (ch in Charsets_1.CHARSETS) {
                        cs = Charsets_1.CHARSETS[ch];
                        if (ch === '/') {
                            this.skipNextChar();
                        }
                    } else {
                        cs = Charsets_1.DEFAULT_CHARSET;
                    }
                    this._terminal.setgCharset(this._terminal.gcharset, cs);
                    this._terminal.gcharset = null;
                    this._state = ParserState.NORMAL;
                    break;
                case ParserState.OSC:
                    if (ch === EscapeSequences_1.C0.ESC || ch === EscapeSequences_1.C0.BEL) {
                        if (ch === EscapeSequences_1.C0.ESC) this._position++;
                        this._terminal.params.push(this._terminal.currentParam);
                        switch (this._terminal.params[0]) {
                            case 0:
                            case 1:
                            case 2:
                                if (this._terminal.params[1]) {
                                    this._terminal.title = this._terminal.params[1];
                                    this._terminal.handleTitle(this._terminal.title);
                                }
                                break;
                            case 3:
                                break;
                            case 4:
                            case 5:
                                break;
                            case 10:
                            case 11:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                            case 16:
                            case 17:
                            case 18:
                            case 19:
                                break;
                            case 46:
                                break;
                            case 50:
                                break;
                            case 51:
                                break;
                            case 52:
                                break;
                            case 104:
                            case 105:
                            case 110:
                            case 111:
                            case 112:
                            case 113:
                            case 114:
                            case 115:
                            case 116:
                            case 117:
                            case 118:
                                break;
                        }
                        this._terminal.params = [];
                        this._terminal.currentParam = 0;
                        this._state = ParserState.NORMAL;
                    } else {
                        if (!this._terminal.params.length) {
                            if (ch >= '0' && ch <= '9') {
                                this._terminal.currentParam = this._terminal.currentParam * 10 + ch.charCodeAt(0) - 48;
                            } else if (ch === ';') {
                                this._terminal.params.push(this._terminal.currentParam);
                                this._terminal.currentParam = '';
                            }
                        } else {
                            this._terminal.currentParam += ch;
                        }
                    }
                    break;
                case ParserState.CSI_PARAM:
                    if (ch in csiParamStateHandler) {
                        csiParamStateHandler[ch](this);
                        break;
                    }
                    this.finalizeParam();
                    this._state = ParserState.CSI;
                case ParserState.CSI:
                    if (ch in csiStateHandler) {
                        if (this._terminal.debug) {
                            this._terminal.log("CSI " + (this._terminal.prefix ? this._terminal.prefix : '') + " " + (this._terminal.params ? this._terminal.params.join(';') : '') + " " + (this._terminal.postfix ? this._terminal.postfix : '') + " " + ch);
                        }
                        csiStateHandler[ch](this._inputHandler, this._terminal.params, this._terminal.prefix, this._terminal.postfix, this);
                    } else {
                        this._terminal.error('Unknown CSI code: %s.', ch);
                    }
                    this._state = ParserState.NORMAL;
                    this._terminal.prefix = '';
                    this._terminal.postfix = '';
                    break;
                case ParserState.DCS:
                    if (ch === EscapeSequences_1.C0.ESC || ch === EscapeSequences_1.C0.BEL) {
                        if (ch === EscapeSequences_1.C0.ESC) this._position++;
                        var pt = void 0;
                        var valid = void 0;
                        switch (this._terminal.prefix) {
                            case '':
                                break;
                            case '$q':
                                pt = this._terminal.currentParam;
                                valid = false;
                                switch (pt) {
                                    case '"q':
                                        pt = '0"q';
                                        break;
                                    case '"p':
                                        pt = '61"p';
                                        break;
                                    case 'r':
                                        pt = '' + (this._terminal.buffer.scrollTop + 1) + ';' + (this._terminal.buffer.scrollBottom + 1) + 'r';
                                        break;
                                    case 'm':
                                        pt = '0m';
                                        break;
                                    default:
                                        this._terminal.error('Unknown DCS Pt: %s.', pt);
                                        pt = '';
                                        break;
                                }
                                this._terminal.send(EscapeSequences_1.C0.ESC + 'P' + +valid + '$r' + pt + EscapeSequences_1.C0.ESC + '\\');
                                break;
                            case '+p':
                                break;
                            case '+q':
                                pt = this._terminal.currentParam;
                                valid = false;
                                this._terminal.send(EscapeSequences_1.C0.ESC + 'P' + +valid + '+r' + pt + EscapeSequences_1.C0.ESC + '\\');
                                break;
                            default:
                                this._terminal.error('Unknown DCS prefix: %s.', this._terminal.prefix);
                                break;
                        }
                        this._terminal.currentParam = 0;
                        this._terminal.prefix = '';
                        this._state = ParserState.NORMAL;
                    } else if (!this._terminal.currentParam) {
                        if (!this._terminal.prefix && ch !== '$' && ch !== '+') {
                            this._terminal.currentParam = ch;
                        } else if (this._terminal.prefix.length === 2) {
                            this._terminal.currentParam = ch;
                        } else {
                            this._terminal.prefix += ch;
                        }
                    } else {
                        this._terminal.currentParam += ch;
                    }
                    break;
                case ParserState.IGNORE:
                    if (ch === EscapeSequences_1.C0.ESC || ch === EscapeSequences_1.C0.BEL) {
                        if (ch === EscapeSequences_1.C0.ESC) this._position++;
                        this._state = ParserState.NORMAL;
                    }
                    break;
            }
        }
        return this._state;
    };
    Parser.prototype.setState = function (state) {
        this._state = state;
    };
    Parser.prototype.setPrefix = function (prefix) {
        this._terminal.prefix = prefix;
    };
    Parser.prototype.setPostfix = function (postfix) {
        this._terminal.postfix = postfix;
    };
    Parser.prototype.setParam = function (param) {
        this._terminal.currentParam = param;
    };
    Parser.prototype.getParam = function () {
        return this._terminal.currentParam;
    };
    Parser.prototype.finalizeParam = function () {
        this._terminal.params.push(this._terminal.currentParam);
        this._terminal.currentParam = 0;
    };
    Parser.prototype.skipNextChar = function () {
        this._position++;
    };
    return Parser;
}();
exports.Parser = Parser;

//# sourceMappingURL=Parser.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var DomElementObjectPool_1 = __webpack_require__(35);
var MAX_REFRESH_FRAME_SKIP = 5;
var FLAGS;
(function (FLAGS) {
    FLAGS[FLAGS["BOLD"] = 1] = "BOLD";
    FLAGS[FLAGS["UNDERLINE"] = 2] = "UNDERLINE";
    FLAGS[FLAGS["BLINK"] = 4] = "BLINK";
    FLAGS[FLAGS["INVERSE"] = 8] = "INVERSE";
    FLAGS[FLAGS["INVISIBLE"] = 16] = "INVISIBLE";
})(FLAGS || (FLAGS = {}));
;
var brokenBold = null;
var Renderer = function () {
    function Renderer(_terminal) {
        this._terminal = _terminal;
        this._refreshRowsQueue = [];
        this._refreshFramesSkipped = 0;
        this._refreshAnimationFrame = null;
        this._spanElementObjectPool = new DomElementObjectPool_1.DomElementObjectPool('span');
        if (brokenBold === null) {
            brokenBold = checkBoldBroken(this._terminal.element);
        }
        this._spanElementObjectPool = new DomElementObjectPool_1.DomElementObjectPool('span');
    }
    Renderer.prototype.queueRefresh = function (start, end) {
        this._refreshRowsQueue.push({ start: start, end: end });
        if (!this._refreshAnimationFrame) {
            this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this));
        }
    };
    Renderer.prototype._refreshLoop = function () {
        var skipFrame = this._terminal.writeBuffer.length > 0 && this._refreshFramesSkipped++ <= MAX_REFRESH_FRAME_SKIP;
        if (skipFrame) {
            this._refreshAnimationFrame = window.requestAnimationFrame(this._refreshLoop.bind(this));
            return;
        }
        this._refreshFramesSkipped = 0;
        var start;
        var end;
        if (this._refreshRowsQueue.length > 4) {
            start = 0;
            end = this._terminal.rows - 1;
        } else {
            start = this._refreshRowsQueue[0].start;
            end = this._refreshRowsQueue[0].end;
            for (var i = 1; i < this._refreshRowsQueue.length; i++) {
                if (this._refreshRowsQueue[i].start < start) {
                    start = this._refreshRowsQueue[i].start;
                }
                if (this._refreshRowsQueue[i].end > end) {
                    end = this._refreshRowsQueue[i].end;
                }
            }
        }
        this._refreshRowsQueue = [];
        this._refreshAnimationFrame = null;
        this._refresh(start, end);
    };
    Renderer.prototype._refresh = function (start, end) {
        var parent;
        if (end - start >= this._terminal.rows / 2) {
            parent = this._terminal.element.parentNode;
            if (parent) {
                this._terminal.element.removeChild(this._terminal.rowContainer);
            }
        }
        var width = this._terminal.cols;
        var y = start;
        if (end >= this._terminal.rows) {
            this._terminal.log('`end` is too large. Most likely a bad CSR.');
            end = this._terminal.rows - 1;
        }
        for (; y <= end; y++) {
            var row = y + this._terminal.buffer.ydisp;
            var line = this._terminal.buffer.lines.get(row);
            var x = void 0;
            if (this._terminal.buffer.y === y - (this._terminal.buffer.ybase - this._terminal.buffer.ydisp) && this._terminal.cursorState && !this._terminal.cursorHidden) {
                x = this._terminal.buffer.x;
            } else {
                x = -1;
            }
            var attr = this._terminal.defAttr;
            var documentFragment = document.createDocumentFragment();
            var innerHTML = '';
            var currentElement = void 0;
            while (this._terminal.children[y].children.length) {
                var child = this._terminal.children[y].children[0];
                this._terminal.children[y].removeChild(child);
                this._spanElementObjectPool.release(child);
            }
            for (var i = 0; i < width; i++) {
                var data = line[i][0];
                var ch = line[i][1];
                var ch_width = line[i][2];
                var isCursor = i === x;
                if (!ch_width) {
                    continue;
                }
                if (data !== attr || isCursor) {
                    if (attr !== this._terminal.defAttr && !isCursor) {
                        if (innerHTML) {
                            currentElement.innerHTML = innerHTML;
                            innerHTML = '';
                        }
                        documentFragment.appendChild(currentElement);
                        currentElement = null;
                    }
                    if (data !== this._terminal.defAttr || isCursor) {
                        if (innerHTML && !currentElement) {
                            currentElement = this._spanElementObjectPool.acquire();
                        }
                        if (currentElement) {
                            if (innerHTML) {
                                currentElement.innerHTML = innerHTML;
                                innerHTML = '';
                            }
                            documentFragment.appendChild(currentElement);
                        }
                        currentElement = this._spanElementObjectPool.acquire();
                        var bg = data & 0x1ff;
                        var fg = data >> 9 & 0x1ff;
                        var flags = data >> 18;
                        if (isCursor) {
                            currentElement.classList.add('reverse-video');
                            currentElement.classList.add('terminal-cursor');
                        }
                        if (flags & FLAGS.BOLD) {
                            if (!brokenBold) {
                                currentElement.classList.add('xterm-bold');
                            }
                            if (fg < 8) {
                                fg += 8;
                            }
                        }
                        if (flags & FLAGS.UNDERLINE) {
                            currentElement.classList.add('xterm-underline');
                        }
                        if (flags & FLAGS.BLINK) {
                            currentElement.classList.add('xterm-blink');
                        }
                        if (flags & FLAGS.INVERSE) {
                            var temp = bg;
                            bg = fg;
                            fg = temp;
                            if (flags & 1 && fg < 8) {
                                fg += 8;
                            }
                        }
                        if (flags & FLAGS.INVISIBLE && !isCursor) {
                            currentElement.classList.add('xterm-hidden');
                        }
                        if (flags & FLAGS.INVERSE) {
                            if (bg === 257) {
                                bg = 15;
                            }
                            if (fg === 256) {
                                fg = 0;
                            }
                        }
                        if (bg < 256) {
                            currentElement.classList.add("xterm-bg-color-" + bg);
                        }
                        if (fg < 256) {
                            currentElement.classList.add("xterm-color-" + fg);
                        }
                    }
                }
                if (ch_width === 2) {
                    innerHTML += "<span class=\"xterm-wide-char\">" + ch + "</span>";
                } else if (ch.charCodeAt(0) > 255) {
                    innerHTML += "<span class=\"xterm-normal-char\">" + ch + "</span>";
                } else {
                    switch (ch) {
                        case '&':
                            innerHTML += '&amp;';
                            break;
                        case '<':
                            innerHTML += '&lt;';
                            break;
                        case '>':
                            innerHTML += '&gt;';
                            break;
                        default:
                            if (ch <= ' ') {
                                innerHTML += '&nbsp;';
                            } else {
                                innerHTML += ch;
                            }
                            break;
                    }
                }
                attr = isCursor ? -1 : data;
            }
            if (innerHTML && !currentElement) {
                currentElement = this._spanElementObjectPool.acquire();
            }
            if (currentElement) {
                if (innerHTML) {
                    currentElement.innerHTML = innerHTML;
                    innerHTML = '';
                }
                documentFragment.appendChild(currentElement);
                currentElement = null;
            }
            this._terminal.children[y].appendChild(documentFragment);
        }
        if (parent) {
            this._terminal.element.appendChild(this._terminal.rowContainer);
        }
        this._terminal.emit('refresh', { element: this._terminal.element, start: start, end: end });
    };
    ;
    Renderer.prototype.refreshSelection = function (start, end) {
        while (this._terminal.selectionContainer.children.length) {
            this._terminal.selectionContainer.removeChild(this._terminal.selectionContainer.children[0]);
        }
        if (!start || !end) {
            return;
        }
        var viewportStartRow = start[1] - this._terminal.buffer.ydisp;
        var viewportEndRow = end[1] - this._terminal.buffer.ydisp;
        var viewportCappedStartRow = Math.max(viewportStartRow, 0);
        var viewportCappedEndRow = Math.min(viewportEndRow, this._terminal.rows - 1);
        if (viewportCappedStartRow >= this._terminal.rows || viewportCappedEndRow < 0) {
            return;
        }
        var documentFragment = document.createDocumentFragment();
        var startCol = viewportStartRow === viewportCappedStartRow ? start[0] : 0;
        var endCol = viewportCappedStartRow === viewportCappedEndRow ? end[0] : this._terminal.cols;
        documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow, startCol, endCol));
        var middleRowsCount = viewportCappedEndRow - viewportCappedStartRow - 1;
        documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow + 1, 0, this._terminal.cols, middleRowsCount));
        if (viewportCappedStartRow !== viewportCappedEndRow) {
            var endCol_1 = viewportEndRow === viewportCappedEndRow ? end[0] : this._terminal.cols;
            documentFragment.appendChild(this._createSelectionElement(viewportCappedEndRow, 0, endCol_1));
        }
        this._terminal.selectionContainer.appendChild(documentFragment);
    };
    Renderer.prototype._createSelectionElement = function (row, colStart, colEnd, rowCount) {
        if (rowCount === void 0) {
            rowCount = 1;
        }
        var element = document.createElement('div');
        element.style.height = rowCount * this._terminal.charMeasure.height + "px";
        element.style.top = row * this._terminal.charMeasure.height + "px";
        element.style.left = colStart * this._terminal.charMeasure.width + "px";
        element.style.width = this._terminal.charMeasure.width * (colEnd - colStart) + "px";
        return element;
    };
    return Renderer;
}();
exports.Renderer = Renderer;
function checkBoldBroken(terminal) {
    var document = terminal.ownerDocument;
    var el = document.createElement('span');
    el.innerHTML = 'hello world';
    terminal.appendChild(el);
    var w1 = el.offsetWidth;
    var h1 = el.offsetHeight;
    el.style.fontWeight = 'bold';
    var w2 = el.offsetWidth;
    var h2 = el.offsetHeight;
    terminal.removeChild(el);
    return w1 !== w2 || h1 !== h2;
}

//# sourceMappingURL=Renderer.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var DomElementObjectPool = function () {
    function DomElementObjectPool(type) {
        this.type = type;
        this._type = type;
        this._pool = [];
        this._inUse = {};
    }
    DomElementObjectPool.prototype.acquire = function () {
        var element;
        if (this._pool.length === 0) {
            element = this._createNew();
        } else {
            element = this._pool.pop();
        }
        this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)] = element;
        return element;
    };
    DomElementObjectPool.prototype.release = function (element) {
        if (!this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)]) {
            throw new Error('Could not release an element not yet acquired');
        }
        delete this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)];
        this._cleanElement(element);
        this._pool.push(element);
    };
    DomElementObjectPool.prototype._createNew = function () {
        var element = document.createElement(this._type);
        var id = DomElementObjectPool._objectCount++;
        element.setAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE, id.toString(10));
        return element;
    };
    DomElementObjectPool.prototype._cleanElement = function (element) {
        element.className = '';
        element.innerHTML = '';
    };
    return DomElementObjectPool;
}();
DomElementObjectPool.OBJECT_ID_ATTRIBUTE = 'data-obj-id';
DomElementObjectPool._objectCount = 0;
exports.DomElementObjectPool = DomElementObjectPool;

//# sourceMappingURL=DomElementObjectPool.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var INVALID_LINK_CLASS = 'xterm-invalid-link';
var protocolClause = '(https?:\\/\\/)';
var domainCharacterSet = '[\\da-z\\.-]+';
var negatedDomainCharacterSet = '[^\\da-z\\.-]+';
var domainBodyClause = '(' + domainCharacterSet + ')';
var tldClause = '([a-z\\.]{2,6})';
var ipClause = '((\\d{1,3}\\.){3}\\d{1,3})';
var localHostClause = '(localhost)';
var portClause = '(:\\d{1,5})';
var hostClause = '((' + domainBodyClause + '\\.' + tldClause + ')|' + ipClause + '|' + localHostClause + ')' + portClause + '?';
var pathClause = '(\\/[\\/\\w\\.\\-%~]*)*';
var queryStringHashFragmentCharacterSet = '[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&\'*+,:;~\\=\\.\\-]*';
var queryStringClause = '(\\?' + queryStringHashFragmentCharacterSet + ')?';
var hashFragmentClause = '(#' + queryStringHashFragmentCharacterSet + ')?';
var negatedPathCharacterSet = '[^\\/\\w\\.\\-%]+';
var bodyClause = hostClause + pathClause + queryStringClause + hashFragmentClause;
var start = '(?:^|' + negatedDomainCharacterSet + ')(';
var end = ')($|' + negatedPathCharacterSet + ')';
var strictUrlRegex = new RegExp(start + protocolClause + bodyClause + end);
var HYPERTEXT_LINK_MATCHER_ID = 0;
var Linkifier = function () {
    function Linkifier() {
        this._nextLinkMatcherId = HYPERTEXT_LINK_MATCHER_ID;
        this._rowTimeoutIds = [];
        this._linkMatchers = [];
        this.registerLinkMatcher(strictUrlRegex, null, { matchIndex: 1 });
    }
    Linkifier.prototype.attachToDom = function (document, rows) {
        this._document = document;
        this._rows = rows;
    };
    Linkifier.prototype.linkifyRow = function (rowIndex) {
        if (!this._document) {
            return;
        }
        var timeoutId = this._rowTimeoutIds[rowIndex];
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        this._rowTimeoutIds[rowIndex] = setTimeout(this._linkifyRow.bind(this, rowIndex), Linkifier.TIME_BEFORE_LINKIFY);
    };
    Linkifier.prototype.setHypertextLinkHandler = function (handler) {
        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].handler = handler;
    };
    Linkifier.prototype.setHypertextValidationCallback = function (callback) {
        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].validationCallback = callback;
    };
    Linkifier.prototype.registerLinkMatcher = function (regex, handler, options) {
        if (options === void 0) {
            options = {};
        }
        if (this._nextLinkMatcherId !== HYPERTEXT_LINK_MATCHER_ID && !handler) {
            throw new Error('handler must be defined');
        }
        var matcher = {
            id: this._nextLinkMatcherId++,
            regex: regex,
            handler: handler,
            matchIndex: options.matchIndex,
            validationCallback: options.validationCallback,
            priority: options.priority || 0
        };
        this._addLinkMatcherToList(matcher);
        return matcher.id;
    };
    Linkifier.prototype._addLinkMatcherToList = function (matcher) {
        if (this._linkMatchers.length === 0) {
            this._linkMatchers.push(matcher);
            return;
        }
        for (var i = this._linkMatchers.length - 1; i >= 0; i--) {
            if (matcher.priority <= this._linkMatchers[i].priority) {
                this._linkMatchers.splice(i + 1, 0, matcher);
                return;
            }
        }
        this._linkMatchers.splice(0, 0, matcher);
    };
    Linkifier.prototype.deregisterLinkMatcher = function (matcherId) {
        for (var i = 1; i < this._linkMatchers.length; i++) {
            if (this._linkMatchers[i].id === matcherId) {
                this._linkMatchers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    Linkifier.prototype._linkifyRow = function (rowIndex) {
        var row = this._rows[rowIndex];
        if (!row) {
            return;
        }
        var text = row.textContent;
        for (var i = 0; i < this._linkMatchers.length; i++) {
            var matcher = this._linkMatchers[i];
            var linkElements = this._doLinkifyRow(row, matcher);
            if (linkElements.length > 0) {
                if (matcher.validationCallback) {
                    var _loop_1 = function _loop_1(j) {
                        var element = linkElements[j];
                        matcher.validationCallback(element.textContent, element, function (isValid) {
                            if (!isValid) {
                                element.classList.add(INVALID_LINK_CLASS);
                            }
                        });
                    };
                    for (var j = 0; j < linkElements.length; j++) {
                        _loop_1(j);
                    }
                }
                return;
            }
        }
    };
    Linkifier.prototype._doLinkifyRow = function (row, matcher) {
        var result = [];
        var isHttpLinkMatcher = matcher.id === HYPERTEXT_LINK_MATCHER_ID;
        var nodes = row.childNodes;
        var match = row.textContent.match(matcher.regex);
        if (!match || match.length === 0) {
            return result;
        }
        var uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
        var rowStartIndex = match.index + uri.length;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var searchIndex = node.textContent.indexOf(uri);
            if (searchIndex >= 0) {
                var linkElement = this._createAnchorElement(uri, matcher.handler, isHttpLinkMatcher);
                if (node.textContent.length === uri.length) {
                    if (node.nodeType === 3) {
                        this._replaceNode(node, linkElement);
                    } else {
                        var element = node;
                        if (element.nodeName === 'A') {
                            return result;
                        }
                        element.innerHTML = '';
                        element.appendChild(linkElement);
                    }
                } else if (node.childNodes.length > 1) {
                    for (var j = 0; j < node.childNodes.length; j++) {
                        var childNode = node.childNodes[j];
                        var childSearchIndex = childNode.textContent.indexOf(uri);
                        if (childSearchIndex !== -1) {
                            this._replaceNodeSubstringWithNode(childNode, linkElement, uri, childSearchIndex);
                            break;
                        }
                    }
                } else {
                    var nodesAdded = this._replaceNodeSubstringWithNode(node, linkElement, uri, searchIndex);
                    i += nodesAdded;
                }
                result.push(linkElement);
                match = row.textContent.substring(rowStartIndex).match(matcher.regex);
                if (!match || match.length === 0) {
                    return result;
                }
                uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
                rowStartIndex += match.index + uri.length;
            }
        }
        return result;
    };
    Linkifier.prototype._createAnchorElement = function (uri, handler, isHypertextLinkHandler) {
        var element = this._document.createElement('a');
        element.textContent = uri;
        element.draggable = false;
        if (isHypertextLinkHandler) {
            element.href = uri;
            element.target = '_blank';
            element.addEventListener('click', function (event) {
                if (handler) {
                    return handler(event, uri);
                }
            });
        } else {
            element.addEventListener('click', function (event) {
                if (element.classList.contains(INVALID_LINK_CLASS)) {
                    return;
                }
                return handler(event, uri);
            });
        }
        return element;
    };
    Linkifier.prototype._replaceNode = function (oldNode) {
        var newNodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            newNodes[_i - 1] = arguments[_i];
        }
        var parent = oldNode.parentNode;
        for (var i = 0; i < newNodes.length; i++) {
            parent.insertBefore(newNodes[i], oldNode);
        }
        parent.removeChild(oldNode);
    };
    Linkifier.prototype._replaceNodeSubstringWithNode = function (targetNode, newNode, substring, substringIndex) {
        if (targetNode.childNodes.length === 1) {
            targetNode = targetNode.childNodes[0];
        }
        if (targetNode.nodeType !== 3) {
            throw new Error('targetNode must be a text node or only contain a single text node');
        }
        var fullText = targetNode.textContent;
        if (substringIndex === 0) {
            var rightText_1 = fullText.substring(substring.length);
            var rightTextNode_1 = this._document.createTextNode(rightText_1);
            this._replaceNode(targetNode, newNode, rightTextNode_1);
            return 0;
        }
        if (substringIndex === targetNode.textContent.length - substring.length) {
            var leftText_1 = fullText.substring(0, substringIndex);
            var leftTextNode_1 = this._document.createTextNode(leftText_1);
            this._replaceNode(targetNode, leftTextNode_1, newNode);
            return 0;
        }
        var leftText = fullText.substring(0, substringIndex);
        var leftTextNode = this._document.createTextNode(leftText);
        var rightText = fullText.substring(substringIndex + substring.length);
        var rightTextNode = this._document.createTextNode(rightText);
        this._replaceNode(targetNode, leftTextNode, newNode, rightTextNode);
        return 1;
    };
    return Linkifier;
}();
Linkifier.TIME_BEFORE_LINKIFY = 200;
exports.Linkifier = Linkifier;

//# sourceMappingURL=Linkifier.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Mouse = __webpack_require__(8);
var Browser = __webpack_require__(9);
var EventEmitter_1 = __webpack_require__(2);
var SelectionModel_1 = __webpack_require__(39);
var BufferLine_1 = __webpack_require__(10);
var DRAG_SCROLL_MAX_THRESHOLD = 50;
var DRAG_SCROLL_MAX_SPEED = 15;
var DRAG_SCROLL_INTERVAL = 50;
var WORD_SEPARATORS = ' ()[]{}\'"';
var LINE_DATA_CHAR_INDEX = 1;
var LINE_DATA_WIDTH_INDEX = 2;
var NON_BREAKING_SPACE_CHAR = String.fromCharCode(160);
var ALL_NON_BREAKING_SPACE_REGEX = new RegExp(NON_BREAKING_SPACE_CHAR, 'g');
var SelectionMode;
(function (SelectionMode) {
    SelectionMode[SelectionMode["NORMAL"] = 0] = "NORMAL";
    SelectionMode[SelectionMode["WORD"] = 1] = "WORD";
    SelectionMode[SelectionMode["LINE"] = 2] = "LINE";
})(SelectionMode || (SelectionMode = {}));
var SelectionManager = function (_super) {
    __extends(SelectionManager, _super);
    function SelectionManager(_terminal, _buffer, _rowContainer, _charMeasure) {
        var _this = _super.call(this) || this;
        _this._terminal = _terminal;
        _this._buffer = _buffer;
        _this._rowContainer = _rowContainer;
        _this._charMeasure = _charMeasure;
        _this._enabled = true;
        _this._initListeners();
        _this.enable();
        _this._model = new SelectionModel_1.SelectionModel(_terminal);
        _this._activeSelectionMode = SelectionMode.NORMAL;
        return _this;
    }
    SelectionManager.prototype._initListeners = function () {
        var _this = this;
        this._mouseMoveListener = function (event) {
            return _this._onMouseMove(event);
        };
        this._mouseUpListener = function (event) {
            return _this._onMouseUp(event);
        };
        this._rowContainer.addEventListener('mousedown', function (event) {
            return _this._onMouseDown(event);
        });
        this._buffer.on('trim', function (amount) {
            return _this._onTrim(amount);
        });
    };
    SelectionManager.prototype.disable = function () {
        this.clearSelection();
        this._enabled = false;
    };
    SelectionManager.prototype.enable = function () {
        this._enabled = true;
    };
    SelectionManager.prototype.setBuffer = function (buffer) {
        this._buffer = buffer;
        this.clearSelection();
    };
    Object.defineProperty(SelectionManager.prototype, "selectionStart", {
        get: function get() {
            return this._model.finalSelectionStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "selectionEnd", {
        get: function get() {
            return this._model.finalSelectionEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "hasSelection", {
        get: function get() {
            var start = this._model.finalSelectionStart;
            var end = this._model.finalSelectionEnd;
            if (!start || !end) {
                return false;
            }
            return start[0] !== end[0] || start[1] !== end[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionManager.prototype, "selectionText", {
        get: function get() {
            var start = this._model.finalSelectionStart;
            var end = this._model.finalSelectionEnd;
            if (!start || !end) {
                return '';
            }
            var startRowEndCol = start[1] === end[1] ? end[0] : null;
            var result = [];
            result.push(BufferLine_1.translateBufferLineToString(this._buffer.get(start[1]), true, start[0], startRowEndCol));
            for (var i = start[1] + 1; i <= end[1] - 1; i++) {
                var bufferLine = this._buffer.get(i);
                var lineText = BufferLine_1.translateBufferLineToString(bufferLine, true);
                if (bufferLine.isWrapped) {
                    result[result.length - 1] += lineText;
                } else {
                    result.push(lineText);
                }
            }
            if (start[1] !== end[1]) {
                var bufferLine = this._buffer.get(end[1]);
                var lineText = BufferLine_1.translateBufferLineToString(bufferLine, true, 0, end[0]);
                if (bufferLine.isWrapped) {
                    result[result.length - 1] += lineText;
                } else {
                    result.push(lineText);
                }
            }
            var formattedResult = result.map(function (line) {
                return line.replace(ALL_NON_BREAKING_SPACE_REGEX, ' ');
            }).join(Browser.isMSWindows ? '\r\n' : '\n');
            return formattedResult;
        },
        enumerable: true,
        configurable: true
    });
    SelectionManager.prototype.clearSelection = function () {
        this._model.clearSelection();
        this._removeMouseDownListeners();
        this.refresh();
    };
    SelectionManager.prototype.refresh = function (isNewSelection) {
        var _this = this;
        if (!this._refreshAnimationFrame) {
            this._refreshAnimationFrame = window.requestAnimationFrame(function () {
                return _this._refresh();
            });
        }
        if (Browser.isLinux && isNewSelection) {
            var selectionText = this.selectionText;
            if (selectionText.length) {
                this.emit('newselection', this.selectionText);
            }
        }
    };
    SelectionManager.prototype._refresh = function () {
        this._refreshAnimationFrame = null;
        this.emit('refresh', { start: this._model.finalSelectionStart, end: this._model.finalSelectionEnd });
    };
    SelectionManager.prototype.selectAll = function () {
        this._model.isSelectAllActive = true;
        this.refresh();
    };
    SelectionManager.prototype._onTrim = function (amount) {
        var needsRefresh = this._model.onTrim(amount);
        if (needsRefresh) {
            this.refresh();
        }
    };
    SelectionManager.prototype._getMouseBufferCoords = function (event) {
        var coords = Mouse.getCoords(event, this._rowContainer, this._charMeasure, this._terminal.cols, this._terminal.rows, true);
        if (!coords) {
            return null;
        }
        coords[0]--;
        coords[1]--;
        coords[1] += this._terminal.buffer.ydisp;
        return coords;
    };
    SelectionManager.prototype._getMouseEventScrollAmount = function (event) {
        var offset = Mouse.getCoordsRelativeToElement(event, this._rowContainer)[1];
        var terminalHeight = this._terminal.rows * this._charMeasure.height;
        if (offset >= 0 && offset <= terminalHeight) {
            return 0;
        }
        if (offset > terminalHeight) {
            offset -= terminalHeight;
        }
        offset = Math.min(Math.max(offset, -DRAG_SCROLL_MAX_THRESHOLD), DRAG_SCROLL_MAX_THRESHOLD);
        offset /= DRAG_SCROLL_MAX_THRESHOLD;
        return offset / Math.abs(offset) + Math.round(offset * (DRAG_SCROLL_MAX_SPEED - 1));
    };
    SelectionManager.prototype._onMouseDown = function (event) {
        if (event.button === 2 && this.hasSelection) {
            event.stopPropagation();
            return;
        }
        if (event.button !== 0) {
            return;
        }
        if (!this._enabled) {
            var shouldForceSelection = Browser.isMac && event.altKey;
            if (!shouldForceSelection) {
                return;
            }
            event.stopPropagation();
        }
        event.preventDefault();
        this._dragScrollAmount = 0;
        if (this._enabled && event.shiftKey) {
            this._onIncrementalClick(event);
        } else {
            if (event.detail === 1) {
                this._onSingleClick(event);
            } else if (event.detail === 2) {
                this._onDoubleClick(event);
            } else if (event.detail === 3) {
                this._onTripleClick(event);
            }
        }
        this._addMouseDownListeners();
        this.refresh(true);
    };
    SelectionManager.prototype._addMouseDownListeners = function () {
        var _this = this;
        this._rowContainer.ownerDocument.addEventListener('mousemove', this._mouseMoveListener);
        this._rowContainer.ownerDocument.addEventListener('mouseup', this._mouseUpListener);
        this._dragScrollIntervalTimer = setInterval(function () {
            return _this._dragScroll();
        }, DRAG_SCROLL_INTERVAL);
    };
    SelectionManager.prototype._removeMouseDownListeners = function () {
        this._rowContainer.ownerDocument.removeEventListener('mousemove', this._mouseMoveListener);
        this._rowContainer.ownerDocument.removeEventListener('mouseup', this._mouseUpListener);
        clearInterval(this._dragScrollIntervalTimer);
        this._dragScrollIntervalTimer = null;
    };
    SelectionManager.prototype._onIncrementalClick = function (event) {
        if (this._model.selectionStart) {
            this._model.selectionEnd = this._getMouseBufferCoords(event);
        }
    };
    SelectionManager.prototype._onSingleClick = function (event) {
        this._model.selectionStartLength = 0;
        this._model.isSelectAllActive = false;
        this._activeSelectionMode = SelectionMode.NORMAL;
        this._model.selectionStart = this._getMouseBufferCoords(event);
        if (!this._model.selectionStart) {
            return;
        }
        this._model.selectionEnd = null;
        var line = this._buffer.get(this._model.selectionStart[1]);
        if (!line) {
            return;
        }
        var char = line[this._model.selectionStart[0]];
        if (char[LINE_DATA_WIDTH_INDEX] === 0) {
            this._model.selectionStart[0]++;
        }
    };
    SelectionManager.prototype._onDoubleClick = function (event) {
        var coords = this._getMouseBufferCoords(event);
        if (coords) {
            this._activeSelectionMode = SelectionMode.WORD;
            this._selectWordAt(coords);
        }
    };
    SelectionManager.prototype._onTripleClick = function (event) {
        var coords = this._getMouseBufferCoords(event);
        if (coords) {
            this._activeSelectionMode = SelectionMode.LINE;
            this._selectLineAt(coords[1]);
        }
    };
    SelectionManager.prototype._onMouseMove = function (event) {
        var previousSelectionEnd = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
        this._model.selectionEnd = this._getMouseBufferCoords(event);
        if (!this._model.selectionEnd) {
            this.refresh(true);
            return;
        }
        if (this._activeSelectionMode === SelectionMode.LINE) {
            if (this._model.selectionEnd[1] < this._model.selectionStart[1]) {
                this._model.selectionEnd[0] = 0;
            } else {
                this._model.selectionEnd[0] = this._terminal.cols;
            }
        } else if (this._activeSelectionMode === SelectionMode.WORD) {
            this._selectToWordAt(this._model.selectionEnd);
        }
        this._dragScrollAmount = this._getMouseEventScrollAmount(event);
        if (this._dragScrollAmount > 0) {
            this._model.selectionEnd[0] = this._terminal.cols - 1;
        } else if (this._dragScrollAmount < 0) {
            this._model.selectionEnd[0] = 0;
        }
        if (this._model.selectionEnd[1] < this._buffer.length) {
            var char = this._buffer.get(this._model.selectionEnd[1])[this._model.selectionEnd[0]];
            if (char && char[2] === 0) {
                this._model.selectionEnd[0]++;
            }
        }
        if (!previousSelectionEnd || previousSelectionEnd[0] !== this._model.selectionEnd[0] || previousSelectionEnd[1] !== this._model.selectionEnd[1]) {
            this.refresh(true);
        }
    };
    SelectionManager.prototype._dragScroll = function () {
        if (this._dragScrollAmount) {
            this._terminal.scrollDisp(this._dragScrollAmount, false);
            if (this._dragScrollAmount > 0) {
                this._model.selectionEnd = [this._terminal.cols - 1, this._terminal.buffer.ydisp + this._terminal.rows];
            } else {
                this._model.selectionEnd = [0, this._terminal.buffer.ydisp];
            }
            this.refresh();
        }
    };
    SelectionManager.prototype._onMouseUp = function (event) {
        this._removeMouseDownListeners();
    };
    SelectionManager.prototype._convertViewportColToCharacterIndex = function (bufferLine, coords) {
        var charIndex = coords[0];
        for (var i = 0; coords[0] >= i; i++) {
            var char = bufferLine[i];
            if (char[LINE_DATA_WIDTH_INDEX] === 0) {
                charIndex--;
            }
        }
        return charIndex;
    };
    SelectionManager.prototype.setSelection = function (col, row, length) {
        this._model.clearSelection();
        this._removeMouseDownListeners();
        this._model.selectionStart = [col, row];
        this._model.selectionStartLength = length;
        this.refresh();
    };
    SelectionManager.prototype._getWordAt = function (coords) {
        var bufferLine = this._buffer.get(coords[1]);
        if (!bufferLine) {
            return null;
        }
        var line = BufferLine_1.translateBufferLineToString(bufferLine, false);
        var endIndex = this._convertViewportColToCharacterIndex(bufferLine, coords);
        var startIndex = endIndex;
        var charOffset = coords[0] - startIndex;
        var leftWideCharCount = 0;
        var rightWideCharCount = 0;
        if (line.charAt(startIndex) === ' ') {
            while (startIndex > 0 && line.charAt(startIndex - 1) === ' ') {
                startIndex--;
            }
            while (endIndex < line.length && line.charAt(endIndex + 1) === ' ') {
                endIndex++;
            }
        } else {
            var startCol = coords[0];
            var endCol = coords[0];
            if (bufferLine[startCol][LINE_DATA_WIDTH_INDEX] === 0) {
                leftWideCharCount++;
                startCol--;
            }
            if (bufferLine[endCol][LINE_DATA_WIDTH_INDEX] === 2) {
                rightWideCharCount++;
                endCol++;
            }
            while (startIndex > 0 && !this._isCharWordSeparator(line.charAt(startIndex - 1))) {
                if (bufferLine[startCol - 1][LINE_DATA_WIDTH_INDEX] === 0) {
                    leftWideCharCount++;
                    startCol--;
                }
                startIndex--;
                startCol--;
            }
            while (endIndex + 1 < line.length && !this._isCharWordSeparator(line.charAt(endIndex + 1))) {
                if (bufferLine[endCol + 1][LINE_DATA_WIDTH_INDEX] === 2) {
                    rightWideCharCount++;
                    endCol++;
                }
                endIndex++;
                endCol++;
            }
        }
        var start = startIndex + charOffset - leftWideCharCount;
        var length = Math.min(endIndex - startIndex + leftWideCharCount + rightWideCharCount + 1, this._terminal.cols);
        return { start: start, length: length };
    };
    SelectionManager.prototype._selectWordAt = function (coords) {
        var wordPosition = this._getWordAt(coords);
        if (wordPosition) {
            this._model.selectionStart = [wordPosition.start, coords[1]];
            this._model.selectionStartLength = wordPosition.length;
        }
    };
    SelectionManager.prototype._selectToWordAt = function (coords) {
        var wordPosition = this._getWordAt(coords);
        if (wordPosition) {
            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? wordPosition.start : wordPosition.start + wordPosition.length, coords[1]];
        }
    };
    SelectionManager.prototype._isCharWordSeparator = function (char) {
        return WORD_SEPARATORS.indexOf(char) >= 0;
    };
    SelectionManager.prototype._selectLineAt = function (line) {
        this._model.selectionStart = [0, line];
        this._model.selectionStartLength = this._terminal.cols;
    };
    return SelectionManager;
}(EventEmitter_1.EventEmitter);
exports.SelectionManager = SelectionManager;

//# sourceMappingURL=SelectionManager.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function contains(arr, el) {
    return arr.indexOf(el) >= 0;
}
exports.contains = contains;
;

//# sourceMappingURL=Generic.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var SelectionModel = function () {
    function SelectionModel(_terminal) {
        this._terminal = _terminal;
        this.clearSelection();
    }
    SelectionModel.prototype.clearSelection = function () {
        this.selectionStart = null;
        this.selectionEnd = null;
        this.isSelectAllActive = false;
        this.selectionStartLength = 0;
    };
    Object.defineProperty(SelectionModel.prototype, "finalSelectionStart", {
        get: function get() {
            if (this.isSelectAllActive) {
                return [0, 0];
            }
            if (!this.selectionEnd || !this.selectionStart) {
                return this.selectionStart;
            }
            return this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionModel.prototype, "finalSelectionEnd", {
        get: function get() {
            if (this.isSelectAllActive) {
                return [this._terminal.cols, this._terminal.buffer.ybase + this._terminal.rows - 1];
            }
            if (!this.selectionStart) {
                return null;
            }
            if (!this.selectionEnd || this.areSelectionValuesReversed()) {
                return [this.selectionStart[0] + this.selectionStartLength, this.selectionStart[1]];
            }
            if (this.selectionStartLength) {
                if (this.selectionEnd[1] === this.selectionStart[1]) {
                    return [Math.max(this.selectionStart[0] + this.selectionStartLength, this.selectionEnd[0]), this.selectionEnd[1]];
                }
            }
            return this.selectionEnd;
        },
        enumerable: true,
        configurable: true
    });
    SelectionModel.prototype.areSelectionValuesReversed = function () {
        var start = this.selectionStart;
        var end = this.selectionEnd;
        return start[1] > end[1] || start[1] === end[1] && start[0] > end[0];
    };
    SelectionModel.prototype.onTrim = function (amount) {
        if (this.selectionStart) {
            this.selectionStart[1] -= amount;
        }
        if (this.selectionEnd) {
            this.selectionEnd[1] -= amount;
        }
        if (this.selectionEnd && this.selectionEnd[1] < 0) {
            this.clearSelection();
            return true;
        }
        if (this.selectionStart && this.selectionStart[1] < 0) {
            this.selectionStart[1] = 0;
        }
        return false;
    };
    return SelectionModel;
}();
exports.SelectionModel = SelectionModel;

//# sourceMappingURL=SelectionModel.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_js_1 = __webpack_require__(2);
var CharMeasure = function (_super) {
    __extends(CharMeasure, _super);
    function CharMeasure(document, parentElement) {
        var _this = _super.call(this) || this;
        _this._document = document;
        _this._parentElement = parentElement;
        return _this;
    }
    Object.defineProperty(CharMeasure.prototype, "width", {
        get: function get() {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharMeasure.prototype, "height", {
        get: function get() {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    CharMeasure.prototype.measure = function () {
        var _this = this;
        if (!this._measureElement) {
            this._measureElement = this._document.createElement('span');
            this._measureElement.style.position = 'absolute';
            this._measureElement.style.top = '0';
            this._measureElement.style.left = '-9999em';
            this._measureElement.textContent = 'W';
            this._measureElement.setAttribute('aria-hidden', 'true');
            this._parentElement.appendChild(this._measureElement);
            setTimeout(function () {
                return _this._doMeasure();
            }, 0);
        } else {
            this._doMeasure();
        }
    };
    CharMeasure.prototype._doMeasure = function () {
        var geometry = this._measureElement.getBoundingClientRect();
        if (geometry.width === 0 || geometry.height === 0) {
            return;
        }
        if (this._width !== geometry.width || this._height !== geometry.height) {
            this._width = geometry.width;
            this._height = geometry.height;
            this.emit('charsizechanged');
        }
    };
    return CharMeasure;
}(EventEmitter_js_1.EventEmitter);
exports.CharMeasure = CharMeasure;

//# sourceMappingURL=CharMeasure.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../css-loader/index.js!./fullscreen.css", function() {
			var newContent = require("!!../../../../css-loader/index.js!./fullscreen.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, ".xterm.fullscreen {\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    width: auto;\n    height: auto;\n    z-index: 255;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports) {



/***/ }),
/* 44 */
/***/ (function(module, exports) {



/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(46);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(47), __webpack_require__(48)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ })
/******/ ]);