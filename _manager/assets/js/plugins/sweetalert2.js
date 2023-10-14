// /*!
//  * sweetalert2 v7.24.1
//  * Released under the MIT License.
//  */
// (function(global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//     typeof define === 'function' && define.amd ? define(factory) :
//     (global.Sweetalert2 = factory());
// }(this, (function() {
//   'use strict';
//
//   var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
//     return typeof obj;
//   } : function(obj) {
//     return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
//   };
//
//   var classCallCheck = function(instance, Constructor) {
//     if (!(instance instanceof Constructor)) {
//       throw new TypeError("Cannot call a class as a function");
//     }
//   };
//
//   var createClass = function() {
//     function defineProperties(target, props) {
//       for (var i = 0; i < props.length; i++) {
//         var descriptor = props[i];
//         descriptor.enumerable = descriptor.enumerable || false;
//         descriptor.configurable = true;
//         if ("value" in descriptor) descriptor.writable = true;
//         Object.defineProperty(target, descriptor.key, descriptor);
//       }
//     }
//
//     return function(Constructor, protoProps, staticProps) {
//       if (protoProps) defineProperties(Constructor.prototype, protoProps);
//       if (staticProps) defineProperties(Constructor, staticProps);
//       return Constructor;
//     };
//   }();
//
//   var _extends = Object.assign || function(target) {
//     for (var i = 1; i < arguments.length; i++) {
//       var source = arguments[i];
//
//       for (var key in source) {
//         if (Object.prototype.hasOwnProperty.call(source, key)) {
//           target[key] = source[key];
//         }
//       }
//     }
//
//     return target;
//   };
//
//   var get = function get(object, property, receiver) {
//     if (object === null) object = Function.prototype;
//     var desc = Object.getOwnPropertyDescriptor(object, property);
//
//     if (desc === undefined) {
//       var parent = Object.getPrototypeOf(object);
//
//       if (parent === null) {
//         return undefined;
//       } else {
//         return get(parent, property, receiver);
//       }
//     } else if ("value" in desc) {
//       return desc.value;
//     } else {
//       var getter = desc.get;
//
//       if (getter === undefined) {
//         return undefined;
//       }
//
//       return getter.call(receiver);
//     }
//   };
//
//   var inherits = function(subClass, superClass) {
//     if (typeof superClass !== "function" && superClass !== null) {
//       throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
//     }
//
//     subClass.prototype = Object.create(superClass && superClass.prototype, {
//       constructor: {
//         value: subClass,
//         enumerable: false,
//         writable: true,
//         configurable: true
//       }
//     });
//     if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
//   };
//
//
//
//
//
//
//
//
//
//
//
//   var possibleConstructorReturn = function(self, call) {
//     if (!self) {
//       throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
//     }
//
//     return call && (typeof call === "object" || typeof call === "function") ? call : self;
//   };
//
//
//
//
//
//   var slicedToArray = function() {
//     function sliceIterator(arr, i) {
//       var _arr = [];
//       var _n = true;
//       var _d = false;
//       var _e = undefined;
//
//       try {
//         for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
//           _arr.push(_s.value);
//
//           if (i && _arr.length === i) break;
//         }
//       } catch (err) {
//         _d = true;
//         _e = err;
//       } finally {
//         try {
//           if (!_n && _i["return"]) _i["return"]();
//         } finally {
//           if (_d) throw _e;
//         }
//       }
//
//       return _arr;
//     }
//
//     return function(arr, i) {
//       if (Array.isArray(arr)) {
//         return arr;
//       } else if (Symbol.iterator in Object(arr)) {
//         return sliceIterator(arr, i);
//       } else {
//         throw new TypeError("Invalid attempt to destructure non-iterable instance");
//       }
//     };
//   }();
//
//   var consolePrefix = 'SweetAlert2:';
//
//   /**
//    * Filter the unique values into a new array
//    * @param arr
//    */
//   var uniqueArray = function uniqueArray(arr) {
//     var result = [];
//     for (var i = 0; i < arr.length; i++) {
//       if (result.indexOf(arr[i]) === -1) {
//         result.push(arr[i]);
//       }
//     }
//     return result;
//   };
//
//   /**
//    * Converts `inputOptions` into an array of `[value, label]`s
//    * @param inputOptions
//    */
//   var formatInputOptions = function formatInputOptions(inputOptions) {
//     var result = [];
//     if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
//       inputOptions.forEach(function(value, key) {
//         result.push([key, value]);
//       });
//     } else {
//       Object.keys(inputOptions).forEach(function(key) {
//         result.push([key, inputOptions[key]]);
//       });
//     }
//     return result;
//   };
//
//   /**
//    * Standardise console warnings
//    * @param message
//    */
//   var warn = function warn(message) {
//     console.warn(consolePrefix + ' ' + message);
//   };
//
//   /**
//    * Standardise console errors
//    * @param message
//    */
//   var error = function error(message) {
//     console.error(consolePrefix + ' ' + message);
//   };
//
//   /**
//    * Private global state for `warnOnce`
//    * @type {Array}
//    * @private
//    */
//   var previousWarnOnceMessages = [];
//
//   /**
//    * Show a console warning, but only if it hasn't already been shown
//    * @param message
//    */
//   var warnOnce = function warnOnce(message) {
//     if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
//       previousWarnOnceMessages.push(message);
//       warn(message);
//     }
//   };
//
//   /**
//    * If `arg` is a function, call it (with no arguments or context) and return the result.
//    * Otherwise, just pass the value through
//    * @param arg
//    */
//   var callIfFunction = function callIfFunction(arg) {
//     return typeof arg === 'function' ? arg() : arg;
//   };
//
//   var isThenable = function isThenable(arg) {
//     return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.then === 'function';
//   };
//
//   var DismissReason = Object.freeze({
//     cancel: 'cancel',
//     backdrop: 'overlay',
//     close: 'close',
//     esc: 'esc',
//     timer: 'timer'
//   });
//
//   var version = "7.24.1";
//
//   var argsToParams = function argsToParams(args) {
//     var params = {};
//     switch (_typeof(args[0])) {
//       case 'string':
//         ['title', 'html', 'type'].forEach(function(name, index) {
//           switch (_typeof(args[index])) {
//             case 'string':
//               params[name] = args[index];
//               break;
//             case 'undefined':
//               break;
//             default:
//               error('Unexpected type of ' + name + '! Expected "string", got ' + _typeof(args[index]));
//           }
//         });
//         break;
//
//       case 'object':
//         _extends(params, args[0]);
//         break;
//
//       default:
//         error('Unexpected type of argument! Expected "string" or "object", got ' + _typeof(args[0]));
//         return false;
//     }
//     return params;
//   };
//
//   /**
//    * Adapt a legacy inputValidator for use with expectRejections=false
//    */
//   var adaptInputValidator = function adaptInputValidator(legacyValidator) {
//     return function adaptedInputValidator(inputValue, extraParams) {
//       return legacyValidator.call(this, inputValue, extraParams).then(function() {
//         return undefined;
//       }, function(validationError) {
//         return validationError;
//       });
//     };
//   };
//
//   var swalPrefix = 'swal2-';
//
//   var prefix = function prefix(items) {
//     var result = {};
//     for (var i in items) {
//       result[items[i]] = swalPrefix + items[i];
//     }
//     return result;
//   };
//
//   var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'toast', 'toast-shown', 'fade', 'show', 'hide', 'noanimation', 'close', 'title', 'header', 'content', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'icon-text', 'image', 'input', 'has-input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea', 'inputerror', 'validationerror', 'progresssteps', 'activeprogressstep', 'progresscircle', 'progressline', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen']);
//
//   var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);
//
//   // Remember state in cases where opening and handling a modal will fiddle with it.
//   var states = {
//     previousBodyPadding: null
//   };
//
//   var hasClass = function hasClass(elem, className) {
//     if (elem.classList) {
//       return elem.classList.contains(className);
//     }
//     return false;
//   };
//
//   var focusInput = function focusInput(input) {
//     input.focus();
//
//     // place cursor at end of text in text input
//     if (input.type !== 'file') {
//       // http://stackoverflow.com/a/2345915/1331425
//       var val = input.value;
//       input.value = '';
//       input.value = val;
//     }
//   };
//
//   var addOrRemoveClass = function addOrRemoveClass(target, classList, add) {
//     if (!target || !classList) {
//       return;
//     }
//     if (typeof classList === 'string') {
//       classList = classList.split(/\s+/).filter(Boolean);
//     }
//     classList.forEach(function(className) {
//       if (target.forEach) {
//         target.forEach(function(elem) {
//           add ? elem.classList.add(className) : elem.classList.remove(className);
//         });
//       } else {
//         add ? target.classList.add(className) : target.classList.remove(className);
//       }
//     });
//   };
//
//   var addClass = function addClass(target, classList) {
//     addOrRemoveClass(target, classList, true);
//   };
//
//   var removeClass = function removeClass(target, classList) {
//     addOrRemoveClass(target, classList, false);
//   };
//
//   var getChildByClass = function getChildByClass(elem, className) {
//     for (var i = 0; i < elem.childNodes.length; i++) {
//       if (hasClass(elem.childNodes[i], className)) {
//         return elem.childNodes[i];
//       }
//     }
//   };
//
//   var show = function show(elem) {
//     elem.style.opacity = '';
//     elem.style.display = elem.id === swalClasses.content ? 'block' : 'flex';
//   };
//
//   var hide = function hide(elem) {
//     elem.style.opacity = '';
//     elem.style.display = 'none';
//   };
//
//   var empty = function empty(elem) {
//     while (elem.firstChild) {
//       elem.removeChild(elem.firstChild);
//     }
//   };
//
//   // borrowed from jquery $(elem).is(':visible') implementation
//   var isVisible = function isVisible(elem) {
//     return elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
//   };
//
//   var removeStyleProperty = function removeStyleProperty(elem, property) {
//     if (elem.style.removeProperty) {
//       elem.style.removeProperty(property);
//     } else {
//       elem.style.removeAttribute(property);
//     }
//   };
//
//   var getContainer = function getContainer() {
//     return document.body.querySelector('.' + swalClasses.container);
//   };
//
//   var elementByClass = function elementByClass(className) {
//     var container = getContainer();
//     return container ? container.querySelector('.' + className) : null;
//   };
//
//   var getPopup = function getPopup() {
//     return elementByClass(swalClasses.popup);
//   };
//
//   var getIcons = function getIcons() {
//     var popup = getPopup();
//     return popup.querySelectorAll('.' + swalClasses.icon);
//   };
//
//   var getTitle = function getTitle() {
//     return elementByClass(swalClasses.title);
//   };
//
//   var getContent = function getContent() {
//     return elementByClass(swalClasses.content);
//   };
//
//   var getImage = function getImage() {
//     return elementByClass(swalClasses.image);
//   };
//
//   var getProgressSteps = function getProgressSteps() {
//     return elementByClass(swalClasses.progresssteps);
//   };
//
//   var getValidationError = function getValidationError() {
//     return elementByClass(swalClasses.validationerror);
//   };
//
//   var getConfirmButton = function getConfirmButton() {
//     return elementByClass(swalClasses.confirm);
//   };
//
//   var getCancelButton = function getCancelButton() {
//     return elementByClass(swalClasses.cancel);
//   };
//
//   var getButtonsWrapper = function getButtonsWrapper() {
//     warnOnce('swal.getButtonsWrapper() is deprecated and will be removed in the next major release, use swal.getActions() instead');
//     return elementByClass(swalClasses.actions);
//   };
//
//   var getActions = function getActions() {
//     return elementByClass(swalClasses.actions);
//   };
//
//   var getFooter = function getFooter() {
//     return elementByClass(swalClasses.footer);
//   };
//
//   var getCloseButton = function getCloseButton() {
//     return elementByClass(swalClasses.close);
//   };
//
//   var getFocusableElements = function getFocusableElements() {
//     var focusableElementsWithTabindex = Array.prototype.slice.call(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'))
//       // sort according to tabindex
//       .sort(function(a, b) {
//         a = parseInt(a.getAttribute('tabindex'));
//         b = parseInt(b.getAttribute('tabindex'));
//         if (a > b) {
//           return 1;
//         } else if (a < b) {
//           return -1;
//         }
//         return 0;
//       });
//
//     // https://github.com/jkup/focusable/blob/master/index.js
//     var otherFocusableElements = Array.prototype.slice.call(getPopup().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]'));
//
//     return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements));
//   };
//
//   var isModal = function isModal() {
//     return !document.body.classList.contains(swalClasses['toast-shown']);
//   };
//
//   var isToast = function isToast() {
//     return document.body.classList.contains(swalClasses['toast-shown']);
//   };
//
//   var isLoading = function isLoading() {
//     return getPopup().hasAttribute('data-loading');
//   };
//
//   // Detect Node env
//   var isNodeEnv = function isNodeEnv() {
//     return typeof window === 'undefined' || typeof document === 'undefined';
//   };
//
//   var sweetHTML = ('\n <div aria-labelledby="' + swalClasses.title + '" aria-describedby="' + swalClasses.content + '" class="' + swalClasses.popup + '" tabindex="-1">\n   <div class="' + swalClasses.header + '">\n     <ul class="' + swalClasses.progresssteps + '"></ul>\n     <div class="' + swalClasses.icon + ' ' + iconTypes.error + '">\n       <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n     </div>\n     <div class="' + swalClasses.icon + ' ' + iconTypes.question + '">\n       <span class="' + swalClasses['icon-text'] + '">?</span>\n      </div>\n     <div class="' + swalClasses.icon + ' ' + iconTypes.warning + '">\n       <span class="' + swalClasses['icon-text'] + '">!</span>\n      </div>\n     <div class="' + swalClasses.icon + ' ' + iconTypes.info + '">\n       <span class="' + swalClasses['icon-text'] + '">i</span>\n      </div>\n     <div class="' + swalClasses.icon + ' ' + iconTypes.success + '">\n       <div class="swal2-success-circular-line-left"></div>\n       <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n       <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n       <div class="swal2-success-circular-line-right"></div>\n     </div>\n     <img class="' + swalClasses.image + '" />\n     <h2 class="' + swalClasses.title + '" id="' + swalClasses.title + '"></h2>\n     <button type="button" class="' + swalClasses.close + '">\xD7</button>\n   </div>\n   <div class="' + swalClasses.content + '">\n     <div id="' + swalClasses.content + '"></div>\n     <input class="' + swalClasses.input + '" />\n     <input type="file" class="' + swalClasses.file + '" />\n     <div class="' + swalClasses.range + '">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="' + swalClasses.select + '"></select>\n     <div class="' + swalClasses.radio + '"></div>\n     <label for="' + swalClasses.checkbox + '" class="' + swalClasses.checkbox + '">\n       <input type="checkbox" />\n     </label>\n     <textarea class="' + swalClasses.textarea + '"></textarea>\n     <div class="' + swalClasses.validationerror + '" id="' + swalClasses.validationerror + '"></div>\n   </div>\n   <div class="' + swalClasses.actions + '">\n     <button type="button" class="' + swalClasses.confirm + '">OK</button>\n     <button type="button" class="' + swalClasses.cancel + '">Cancel</button>\n   </div>\n   <div class="' + swalClasses.footer + '">\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, '');
//
//   /*
//    * Add modal + backdrop to DOM
//    */
//   var init = function init(params) {
//     // Clean up the old popup if it exists
//     var c = getContainer();
//     if (c) {
//       c.parentNode.removeChild(c);
//       removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['has-input'], swalClasses['toast-shown']]);
//     }
//
//     if (isNodeEnv()) {
//       error('SweetAlert2 requires document to initialize');
//       return;
//     }
//
//     var container = document.createElement('div');
//     container.className = swalClasses.container;
//     container.innerHTML = sweetHTML;
//
//     var targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target;
//     targetElement.appendChild(container);
//
//     var popup = getPopup();
//     var content = getContent();
//     var input = getChildByClass(content, swalClasses.input);
//     var file = getChildByClass(content, swalClasses.file);
//     var range = content.querySelector('.' + swalClasses.range + ' input');
//     var rangeOutput = content.querySelector('.' + swalClasses.range + ' output');
//     var select = getChildByClass(content, swalClasses.select);
//     var checkbox = content.querySelector('.' + swalClasses.checkbox + ' input');
//     var textarea = getChildByClass(content, swalClasses.textarea);
//
//     // a11y
//     popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
//     popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
//     if (!params.toast) {
//       popup.setAttribute('aria-modal', 'true');
//     }
//
//     var oldInputVal = void 0; // IE11 workaround, see #1109 for details
//     var resetValidationError = function resetValidationError(e) {
//       if (Swal.isVisible() && oldInputVal !== e.target.value) {
//         Swal.resetValidationError();
//       }
//       oldInputVal = e.target.value;
//     };
//
//     input.oninput = resetValidationError;
//     file.onchange = resetValidationError;
//     select.onchange = resetValidationError;
//     checkbox.onchange = resetValidationError;
//     textarea.oninput = resetValidationError;
//
//     range.oninput = function(e) {
//       resetValidationError(e);
//       rangeOutput.value = range.value;
//     };
//
//     range.onchange = function(e) {
//       resetValidationError(e);
//       range.nextSibling.value = range.value;
//     };
//
//     return popup;
//   };
//
//   var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
//     if (!param) {
//       return hide(target);
//     }
//
//     if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
//       target.innerHTML = '';
//       if (0 in param) {
//         for (var i = 0; i in param; i++) {
//           target.appendChild(param[i].cloneNode(true));
//         }
//       } else {
//         target.appendChild(param.cloneNode(true));
//       }
//     } else if (param) {
//       target.innerHTML = param;
//     } else {}
//     show(target);
//   };
//
//   var animationEndEvent = function() {
//     // Prevent run in Node env
//     if (isNodeEnv()) {
//       return false;
//     }
//
//     var testEl = document.createElement('div');
//     var transEndEventNames = {
//       'WebkitAnimation': 'webkitAnimationEnd',
//       'OAnimation': 'oAnimationEnd oanimationend',
//       'animation': 'animationend'
//     };
//     for (var i in transEndEventNames) {
//       if (transEndEventNames.hasOwnProperty(i) && typeof testEl.style[i] !== 'undefined') {
//         return transEndEventNames[i];
//       }
//     }
//
//     return false;
//   }();
//
//   // Measure width of scrollbar
//   // https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
//   var measureScrollbar = function measureScrollbar() {
//     var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
//     if (supportsTouch) {
//       return 0;
//     }
//     var scrollDiv = document.createElement('div');
//     scrollDiv.style.width = '50px';
//     scrollDiv.style.height = '50px';
//     scrollDiv.style.overflow = 'scroll';
//     document.body.appendChild(scrollDiv);
//     var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
//     document.body.removeChild(scrollDiv);
//     return scrollbarWidth;
//   };
//
//   var fixScrollbar = function fixScrollbar() {
//     // for queues, do not do this more than once
//     if (states.previousBodyPadding !== null) {
//       return;
//     }
//     // if the body has overflow
//     if (document.body.scrollHeight > window.innerHeight) {
//       // add padding so the content doesn't shift after removal of scrollbar
//       states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
//       document.body.style.paddingRight = states.previousBodyPadding + measureScrollbar() + 'px';
//     }
//   };
//
//   var undoScrollbar = function undoScrollbar() {
//     if (states.previousBodyPadding !== null) {
//       document.body.style.paddingRight = states.previousBodyPadding;
//       states.previousBodyPadding = null;
//     }
//   };
//
//   // Fix iOS scrolling http://stackoverflow.com/q/39626302/1331425
//   var iOSfix = function iOSfix() {
//     var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
//     if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
//       var offset = document.body.scrollTop;
//       document.body.style.top = offset * -1 + 'px';
//       addClass(document.body, swalClasses.iosfix);
//     }
//   };
//
//   var undoIOSfix = function undoIOSfix() {
//     if (hasClass(document.body, swalClasses.iosfix)) {
//       var offset = parseInt(document.body.style.top, 10);
//       removeClass(document.body, swalClasses.iosfix);
//       document.body.style.top = '';
//       document.body.scrollTop = offset * -1;
//     }
//   };
//
//   var globalState = {};
//
//   // Restore previous active (focused) element
//   var restoreActiveElement = function restoreActiveElement() {
//     var x = window.scrollX;
//     var y = window.scrollY;
//     globalState.restoreFocusTimeout = setTimeout(function() {
//       if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
//         globalState.previousActiveElement.focus();
//         globalState.previousActiveElement = null;
//       }
//     }, 100); // issues/900
//     if (typeof x !== 'undefined' && typeof y !== 'undefined') {
//       // IE doesn't have scrollX/scrollY support
//       window.scrollTo(x, y);
//     }
//   };
//
//   /*
//    * Global function to close sweetAlert
//    */
//   var close = function close(onClose, onAfterClose) {
//     var container = getContainer();
//     var popup = getPopup();
//     if (!popup) {
//       return;
//     }
//
//     if (onClose !== null && typeof onClose === 'function') {
//       onClose(popup);
//     }
//
//     removeClass(popup, swalClasses.show);
//     addClass(popup, swalClasses.hide);
//
//     var removePopupAndResetState = function removePopupAndResetState() {
//       if (!isToast()) {
//         restoreActiveElement();
//         globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
//           capture: globalState.keydownListenerCapture
//         });
//         globalState.keydownHandlerAdded = false;
//       }
//
//       if (container.parentNode) {
//         container.parentNode.removeChild(container);
//       }
//       removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['has-input'], swalClasses['toast-shown']]);
//
//       if (isModal()) {
//         undoScrollbar();
//         undoIOSfix();
//       }
//
//       if (onAfterClose !== null && typeof onAfterClose === 'function') {
//         setTimeout(function() {
//           onAfterClose();
//         });
//       }
//     };
//
//     // If animation is supported, animate
//     if (animationEndEvent && !hasClass(popup, swalClasses.noanimation)) {
//       popup.addEventListener(animationEndEvent, function swalCloseEventFinished() {
//         popup.removeEventListener(animationEndEvent, swalCloseEventFinished);
//         if (hasClass(popup, swalClasses.hide)) {
//           removePopupAndResetState();
//         }
//       });
//     } else {
//       // Otherwise, remove immediately
//       removePopupAndResetState();
//     }
//   };
//
//   /*
//    * Global function to determine if swal2 popup is shown
//    */
//   var isVisible$1 = function isVisible() {
//     return !!getPopup();
//   };
//
//   /*
//    * Global function to click 'Confirm' button
//    */
//   var clickConfirm = function clickConfirm() {
//     return getConfirmButton().click();
//   };
//
//   /*
//    * Global function to click 'Cancel' button
//    */
//   var clickCancel = function clickCancel() {
//     return getCancelButton().click();
//   };
//
//   function fire() {
//     var Swal = this;
//
//     for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
//       args[_key] = arguments[_key];
//     }
//
//     return new(Function.prototype.bind.apply(Swal, [null].concat(args)))();
//   }
//
//   /**
//    * Extends a Swal class making it able to be instantiated without the `new` keyword (and thus without `Swal.fire`)
//    * @param ParentSwal
//    * @returns {NoNewKeywordSwal}
//    */
//   function withNoNewKeyword(ParentSwal) {
//     var NoNewKeywordSwal = function NoNewKeywordSwal() {
//       for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
//         args[_key] = arguments[_key];
//       }
//
//       if (!(this instanceof NoNewKeywordSwal)) {
//         return new(Function.prototype.bind.apply(NoNewKeywordSwal, [null].concat(args)))();
//       }
//       Object.getPrototypeOf(NoNewKeywordSwal).apply(this, args);
//     };
//     NoNewKeywordSwal.prototype = _extends(Object.create(ParentSwal.prototype), {
//       constructor: NoNewKeywordSwal
//     });
//
//     if (typeof Object.setPrototypeOf === 'function') {
//       Object.setPrototypeOf(NoNewKeywordSwal, ParentSwal);
//     } else {
//       // Android 4.4
//       // eslint-disable-next-line
//       NoNewKeywordSwal.__proto__ = ParentSwal;
//     }
//     return NoNewKeywordSwal;
//   }
//
//   var defaultParams = {
//     title: '',
//     titleText: '',
//     text: '',
//     html: '',
//     footer: '',
//     type: null,
//     toast: false,
//     customClass: '',
//     target: 'body',
//     backdrop: true,
//     animation: true,
//     heightAuto: true,
//     allowOutsideClick: true,
//     allowEscapeKey: true,
//     allowEnterKey: true,
//     stopKeydownPropagation: true,
//     keydownListenerCapture: false,
//     showConfirmButton: true,
//     showCancelButton: false,
//     preConfirm: null,
//     confirmButtonText: 'OK',
//     confirmButtonAriaLabel: '',
//     confirmButtonColor: null,
//     confirmButtonClass: null,
//     cancelButtonText: 'Cancel',
//     cancelButtonAriaLabel: '',
//     cancelButtonColor: null,
//     cancelButtonClass: null,
//     buttonsStyling: true,
//     reverseButtons: false,
//     focusConfirm: true,
//     focusCancel: false,
//     showCloseButton: false,
//     closeButtonAriaLabel: 'Close this dialog',
//     showLoaderOnConfirm: false,
//     imageUrl: null,
//     imageWidth: null,
//     imageHeight: null,
//     imageAlt: '',
//     imageClass: null,
//     timer: null,
//     width: null,
//     padding: null,
//     background: null,
//     input: null,
//     inputPlaceholder: '',
//     inputValue: '',
//     inputOptions: {},
//     inputAutoTrim: true,
//     inputClass: null,
//     inputAttributes: {},
//     inputValidator: null,
//     grow: false,
//     position: 'center',
//     progressSteps: [],
//     currentProgressStep: null,
//     progressStepsDistance: null,
//     onBeforeOpen: null,
//     onAfterClose: null,
//     onOpen: null,
//     onClose: null,
//     useRejections: false,
//     expectRejections: false
//   };
//
//   var deprecatedParams = ['useRejections', 'expectRejections'];
//
//   /**
//    * Is valid parameter
//    * @param {String} paramName
//    */
//   var isValidParameter = function isValidParameter(paramName) {
//     return defaultParams.hasOwnProperty(paramName) || paramName === 'extraParams';
//   };
//
//   /**
//    * Is deprecated parameter
//    * @param {String} paramName
//    */
//   var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
//     return deprecatedParams.indexOf(paramName) !== -1;
//   };
//
//   /**
//    * Show relevant warnings for given params
//    *
//    * @param params
//    */
//   var showWarningsForParams = function showWarningsForParams(params) {
//     for (var param in params) {
//       if (!isValidParameter(param)) {
//         warn('Unknown parameter "' + param + '"');
//       }
//       if (isDeprecatedParameter(param)) {
//         warnOnce('The parameter "' + param + '" is deprecated and will be removed in the next major release.');
//       }
//     }
//   };
//
//   var deprecationWarning = '"setDefaults" & "resetDefaults" methods are deprecated in favor of "mixin" method and will be removed in the next major release. For new projects, use "mixin". For past projects already using "setDefaults", support will be provided through an additional package.';
//   var defaults$1 = {};
//
//   function withGlobalDefaults(ParentSwal) {
//     var SwalWithGlobalDefaults = function(_ParentSwal) {
//       inherits(SwalWithGlobalDefaults, _ParentSwal);
//
//       function SwalWithGlobalDefaults() {
//         classCallCheck(this, SwalWithGlobalDefaults);
//         return possibleConstructorReturn(this, (SwalWithGlobalDefaults.__proto__ || Object.getPrototypeOf(SwalWithGlobalDefaults)).apply(this, arguments));
//       }
//
//       createClass(SwalWithGlobalDefaults, [{
//         key: '_main',
//         value: function _main(params) {
//           return get(SwalWithGlobalDefaults.prototype.__proto__ || Object.getPrototypeOf(SwalWithGlobalDefaults.prototype), '_main', this).call(this, _extends({}, defaults$1, params));
//         }
//       }], [{
//         key: 'setDefaults',
//         value: function setDefaults(params) {
//           warnOnce(deprecationWarning);
//           if (!params || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
//             throw new TypeError('SweetAlert2: The argument for setDefaults() is required and has to be a object');
//           }
//           showWarningsForParams(params);
//           // assign valid params from `params` to `defaults`
//           Object.keys(params).forEach(function(param) {
//             if (ParentSwal.isValidParameter(param)) {
//               defaults$1[param] = params[param];
//             }
//           });
//         }
//       }, {
//         key: 'resetDefaults',
//         value: function resetDefaults() {
//           warnOnce(deprecationWarning);
//           defaults$1 = {};
//         }
//       }]);
//       return SwalWithGlobalDefaults;
//     }(ParentSwal);
//
//     // Set default params if `window._swalDefaults` is an object
//
//
//     if (typeof window !== 'undefined' && _typeof(window._swalDefaults) === 'object') {
//       SwalWithGlobalDefaults.setDefaults(window._swalDefaults);
//     }
//
//     return SwalWithGlobalDefaults;
//   }
//
//   /**
//    * Returns an extended version of `Swal` containing `params` as defaults.
//    * Useful for reusing Swal configuration.
//    *
//    * For example:
//    *
//    * Before:
//    * const textPromptOptions = { input: 'text', showCancelButton: true }
//    * const {value: firstName} = await Swal({ ...textPromptOptions, title: 'What is your first name?' })
//    * const {value: lastName} = await Swal({ ...textPromptOptions, title: 'What is your last name?' })
//    *
//    * After:
//    * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
//    * const {value: firstName} = await TextPrompt('What is your first name?')
//    * const {value: lastName} = await TextPrompt('What is your last name?')
//    *
//    * @param mixinParams
//    */
//   function mixin(mixinParams) {
//     var Swal = this;
//     return withNoNewKeyword(function(_Swal) {
//       inherits(MixinSwal, _Swal);
//
//       function MixinSwal() {
//         classCallCheck(this, MixinSwal);
//         return possibleConstructorReturn(this, (MixinSwal.__proto__ || Object.getPrototypeOf(MixinSwal)).apply(this, arguments));
//       }
//
//       createClass(MixinSwal, [{
//         key: '_main',
//         value: function _main(params) {
//           return get(MixinSwal.prototype.__proto__ || Object.getPrototypeOf(MixinSwal.prototype), '_main', this).call(this, _extends({}, mixinParams, params));
//         }
//       }]);
//       return MixinSwal;
//     }(Swal));
//   }
//
//   // private global state for the queue feature
//   var currentSteps = [];
//
//   /*
//    * Global function for chaining sweetAlert popups
//    */
//   var queue = function queue(steps) {
//     var swal = this;
//     currentSteps = steps;
//     var resetQueue = function resetQueue() {
//       currentSteps = [];
//       document.body.removeAttribute('data-swal2-queue-step');
//     };
//     var queueResult = [];
//     return new Promise(function(resolve, reject) {
//       (function step(i, callback) {
//         if (i < currentSteps.length) {
//           document.body.setAttribute('data-swal2-queue-step', i);
//
//           swal(currentSteps[i]).then(function(result) {
//             if (typeof result.value !== 'undefined') {
//               queueResult.push(result.value);
//               step(i + 1, callback);
//             } else {
//               resetQueue();
//               resolve({
//                 dismiss: result.dismiss
//               });
//             }
//           });
//         } else {
//           resetQueue();
//           resolve({
//             value: queueResult
//           });
//         }
//       })(0);
//     });
//   };
//
//   /*
//    * Global function for getting the index of current popup in queue
//    */
//   var getQueueStep = function getQueueStep() {
//     return document.body.getAttribute('data-swal2-queue-step');
//   };
//
//   /*
//    * Global function for inserting a popup to the queue
//    */
//   var insertQueueStep = function insertQueueStep(step, index) {
//     if (index && index < currentSteps.length) {
//       return currentSteps.splice(index, 0, step);
//     }
//     return currentSteps.push(step);
//   };
//
//   /*
//    * Global function for deleting a popup from the queue
//    */
//   var deleteQueueStep = function deleteQueueStep(index) {
//     if (typeof currentSteps[index] !== 'undefined') {
//       currentSteps.splice(index, 1);
//     }
//   };
//
//   /**
//    * Show spinner instead of Confirm button and disable Cancel button
//    */
//   var showLoading = function showLoading() {
//     var popup = getPopup();
//     if (!popup) {
//       Swal('');
//     }
//     popup = getPopup();
//     var actions = getActions();
//     var confirmButton = getConfirmButton();
//     var cancelButton = getCancelButton();
//
//     show(actions);
//     show(confirmButton);
//     addClass([popup, actions], swalClasses.loading);
//     confirmButton.disabled = true;
//     cancelButton.disabled = true;
//
//     popup.setAttribute('data-loading', true);
//     popup.setAttribute('aria-busy', true);
//     popup.focus();
//   };
//
//   /**
//    * Show spinner instead of Confirm button and disable Cancel button
//    */
//   var getTimerLeft = function getTimerLeft() {
//     return globalState.timeout && globalState.timeout.getTimerLeft();
//   };
//
//
//
//   var staticMethods = Object.freeze({
//     isValidParameter: isValidParameter,
//     isDeprecatedParameter: isDeprecatedParameter,
//     argsToParams: argsToParams,
//     adaptInputValidator: adaptInputValidator,
//     close: close,
//     closePopup: close,
//     closeModal: close,
//     closeToast: close,
//     isVisible: isVisible$1,
//     clickConfirm: clickConfirm,
//     clickCancel: clickCancel,
//     getPopup: getPopup,
//     getTitle: getTitle,
//     getContent: getContent,
//     getImage: getImage,
//     getButtonsWrapper: getButtonsWrapper,
//     getActions: getActions,
//     getConfirmButton: getConfirmButton,
//     getCancelButton: getCancelButton,
//     getFooter: getFooter,
//     isLoading: isLoading,
//     fire: fire,
//     mixin: mixin,
//     queue: queue,
//     getQueueStep: getQueueStep,
//     insertQueueStep: insertQueueStep,
//     deleteQueueStep: deleteQueueStep,
//     showLoading: showLoading,
//     enableLoading: showLoading,
//     getTimerLeft: getTimerLeft
//   });
//
//   // https://github.com/Riim/symbol-polyfill/blob/master/index.js
//
//   var _Symbol = typeof Symbol === 'function' ? Symbol : function() {
//     var idCounter = 0;
//
//     function _Symbol(key) {
//       return '__' + key + '_' + Math.floor(Math.random() * 1e9) + '_' + ++idCounter + '__';
//     }
//     _Symbol.iterator = _Symbol('Symbol.iterator');
//     return _Symbol;
//   }();
//
//   // WeakMap polyfill, needed for Android 4.4
//   // Related issue: https://github.com/sweetalert2/sweetalert2/issues/1071
//   // http://webreflection.blogspot.fi/2015/04/a-weakmap-polyfill-in-20-lines-of-code.html
//
//   var WeakMap$1 = typeof WeakMap === 'function' ? WeakMap : function(s, dP, hOP) {
//     function WeakMap() {
//       dP(this, s, {
//         value: _Symbol('WeakMap')
//       });
//     }
//     WeakMap.prototype = {
//       'delete': function del(o) {
//         delete o[this[s]];
//       },
//       get: function get(o) {
//         return o[this[s]];
//       },
//       has: function has(o) {
//         return hOP.call(o, this[s]);
//       },
//       set: function set(o, v) {
//         dP(o, this[s], {
//           configurable: true,
//           value: v
//         });
//       }
//     };
//     return WeakMap;
//   }(_Symbol('WeakMap'), Object.defineProperty, {}.hasOwnProperty);
//
//   /**
//    * This module containts `WeakMap`s for each effectively-"private  property" that a `swal` has.
//    * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
//    * This is the approach that Babel will probably take to implement private methods/fields
//    *   https://github.com/tc39/proposal-private-methods
//    *   https://github.com/babel/babel/pull/7555
//    * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
//    *   then we can use that language feature.
//    */
//
//   var privateProps = {
//     promise: new WeakMap$1(),
//     innerParams: new WeakMap$1(),
//     domCache: new WeakMap$1()
//   };
//
//   /**
//    * Show spinner instead of Confirm button and disable Cancel button
//    */
//   function hideLoading() {
//     var innerParams = privateProps.innerParams.get(this);
//     var domCache = privateProps.domCache.get(this);
//     if (!innerParams.showConfirmButton) {
//       hide(domCache.confirmButton);
//       if (!innerParams.showCancelButton) {
//         hide(domCache.actions);
//       }
//     }
//     removeClass([domCache.popup, domCache.actions], swalClasses.loading);
//     domCache.popup.removeAttribute('aria-busy');
//     domCache.popup.removeAttribute('data-loading');
//     domCache.confirmButton.disabled = false;
//     domCache.cancelButton.disabled = false;
//   }
//
//   // Get input element by specified type or, if type isn't specified, by params.input
//   function getInput(inputType) {
//     var innerParams = privateProps.innerParams.get(this);
//     var domCache = privateProps.domCache.get(this);
//     inputType = inputType || innerParams.input;
//     if (!inputType) {
//       return null;
//     }
//     switch (inputType) {
//       case 'select':
//       case 'textarea':
//       case 'file':
//         return getChildByClass(domCache.content, swalClasses[inputType]);
//       case 'checkbox':
//         return domCache.popup.querySelector('.' + swalClasses.checkbox + ' input');
//       case 'radio':
//         return domCache.popup.querySelector('.' + swalClasses.radio + ' input:checked') || domCache.popup.querySelector('.' + swalClasses.radio + ' input:first-child');
//       case 'range':
//         return domCache.popup.querySelector('.' + swalClasses.range + ' input');
//       default:
//         return getChildByClass(domCache.content, swalClasses.input);
//     }
//   }
//
//   function enableButtons() {
//     var domCache = privateProps.domCache.get(this);
//     domCache.confirmButton.disabled = false;
//     domCache.cancelButton.disabled = false;
//   }
//
//   function disableButtons() {
//     var domCache = privateProps.domCache.get(this);
//     domCache.confirmButton.disabled = true;
//     domCache.cancelButton.disabled = true;
//   }
//
//   function enableConfirmButton() {
//     var domCache = privateProps.domCache.get(this);
//     domCache.confirmButton.disabled = false;
//   }
//
//   function disableConfirmButton() {
//     var domCache = privateProps.domCache.get(this);
//     domCache.confirmButton.disabled = true;
//   }
//
//   function enableInput() {
//     var input = this.getInput();
//     if (!input) {
//       return false;
//     }
//     if (input.type === 'radio') {
//       var radiosContainer = input.parentNode.parentNode;
//       var radios = radiosContainer.querySelectorAll('input');
//       for (var i = 0; i < radios.length; i++) {
//         radios[i].disabled = false;
//       }
//     } else {
//       input.disabled = false;
//     }
//   }
//
//   function disableInput() {
//     var input = this.getInput();
//     if (!input) {
//       return false;
//     }
//     if (input && input.type === 'radio') {
//       var radiosContainer = input.parentNode.parentNode;
//       var radios = radiosContainer.querySelectorAll('input');
//       for (var i = 0; i < radios.length; i++) {
//         radios[i].disabled = true;
//       }
//     } else {
//       input.disabled = true;
//     }
//   }
//
//   // Show block with validation error
//   function showValidationError(error) {
//     var domCache = privateProps.domCache.get(this);
//     domCache.validationError.innerHTML = error;
//     var popupComputedStyle = window.getComputedStyle(domCache.popup);
//     domCache.validationError.style.marginLeft = '-' + popupComputedStyle.getPropertyValue('padding-left');
//     domCache.validationError.style.marginRight = '-' + popupComputedStyle.getPropertyValue('padding-right');
//     show(domCache.validationError);
//
//     var input = this.getInput();
//     if (input) {
//       input.setAttribute('aria-invalid', true);
//       input.setAttribute('aria-describedBy', swalClasses.validationerror);
//       focusInput(input);
//       addClass(input, swalClasses.inputerror);
//     }
//   }
//
//   // Hide block with validation error
//   function resetValidationError() {
//     var domCache = privateProps.domCache.get(this);
//     if (domCache.validationError) {
//       hide(domCache.validationError);
//     }
//
//     var input = this.getInput();
//     if (input) {
//       input.removeAttribute('aria-invalid');
//       input.removeAttribute('aria-describedBy');
//       removeClass(input, swalClasses.inputerror);
//     }
//   }
//
//   var Timer = function Timer(callback, delay) {
//     classCallCheck(this, Timer);
//
//     var id, started, running;
//     var remaining = delay;
//     this.start = function() {
//       running = true;
//       started = new Date();
//       id = setTimeout(callback, remaining);
//     };
//     this.stop = function() {
//       running = false;
//       clearTimeout(id);
//       remaining -= new Date() - started;
//     };
//     this.getTimerLeft = function() {
//       if (running) {
//         this.stop();
//         this.start();
//       }
//       return remaining;
//     };
//     this.getStateRunning = function() {
//       return running;
//     };
//     this.start();
//   };
//
//   var defaultInputValidators = {
//     email: function email(string, extraParams) {
//       return (/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.reject(extraParams && extraParams.validationMessage ? extraParams.validationMessage : 'Invalid email address'));
//     },
//     url: function url(string, extraParams) {
//       // taken from https://stackoverflow.com/a/3809435/1331425
//       return (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(string) ? Promise.resolve() : Promise.reject(extraParams && extraParams.validationMessage ? extraParams.validationMessage : 'Invalid URL'));
//     }
//   };
//
//   /**
//    * Set type, text and actions on popup
//    *
//    * @param params
//    * @returns {boolean}
//    */
//   function setParameters(params) {
//     // Use default `inputValidator` for supported input types if not provided
//     if (!params.inputValidator) {
//       Object.keys(defaultInputValidators).forEach(function(key) {
//         if (params.input === key) {
//           params.inputValidator = params.expectRejections ? defaultInputValidators[key] : Swal.adaptInputValidator(defaultInputValidators[key]);
//         }
//       });
//     }
//
//     // Determine if the custom target element is valid
//     if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
//       warn('Target parameter is not valid, defaulting to "body"');
//       params.target = 'body';
//     }
//
//     var popup = void 0;
//     var oldPopup = getPopup();
//     var targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target;
//     // If the model target has changed, refresh the popup
//     if (oldPopup && targetElement && oldPopup.parentNode !== targetElement.parentNode) {
//       popup = init(params);
//     } else {
//       popup = oldPopup || init(params);
//     }
//
//     // Set popup width
//     if (params.width) {
//       popup.style.width = typeof params.width === 'number' ? params.width + 'px' : params.width;
//     }
//
//     // Set popup padding
//     if (params.padding) {
//       popup.style.padding = typeof params.padding === 'number' ? params.padding + 'px' : params.padding;
//     }
//
//     // Set popup background
//     if (params.background) {
//       popup.style.background = params.background;
//     }
//     var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
//     var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
//     for (var i = 0; i < successIconParts.length; i++) {
//       successIconParts[i].style.backgroundColor = popupBackgroundColor;
//     }
//
//     var container = getContainer();
//     var title = getTitle();
//     var content = getContent().querySelector('#' + swalClasses.content);
//     var actions = getActions();
//     var confirmButton = getConfirmButton();
//     var cancelButton = getCancelButton();
//     var closeButton = getCloseButton();
//     var footer = getFooter();
//
//     // Title
//     if (params.titleText) {
//       title.innerText = params.titleText;
//     } else if (params.title) {
//       title.innerHTML = params.title.split('\n').join('<br />');
//     }
//
//     if (typeof params.backdrop === 'string') {
//       getContainer().style.background = params.backdrop;
//     } else if (!params.backdrop) {
//       addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
//     }
//
//     // Content as HTML
//     if (params.html) {
//       parseHtmlToContainer(params.html, content);
//
//       // Content as plain text
//     } else if (params.text) {
//       content.textContent = params.text;
//       show(content);
//     } else {
//       hide(content);
//     }
//
//     // Position
//     if (params.position in swalClasses) {
//       addClass(container, swalClasses[params.position]);
//     } else {
//       warn('The "position" parameter is not valid, defaulting to "center"');
//       addClass(container, swalClasses.center);
//     }
//
//     // Grow
//     if (params.grow && typeof params.grow === 'string') {
//       var growClass = 'grow-' + params.grow;
//       if (growClass in swalClasses) {
//         addClass(container, swalClasses[growClass]);
//       }
//     }
//
//     // Animation
//     if (typeof params.animation === 'function') {
//       params.animation = params.animation.call();
//     }
//
//     // Close button
//     if (params.showCloseButton) {
//       closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
//       show(closeButton);
//     } else {
//       hide(closeButton);
//     }
//
//     // Default Class
//     popup.className = swalClasses.popup;
//     if (params.toast) {
//       addClass([document.documentElement, document.body], swalClasses['toast-shown']);
//       addClass(popup, swalClasses.toast);
//     } else {
//       addClass(popup, swalClasses.modal);
//     }
//
//     // Custom Class
//     if (params.customClass) {
//       addClass(popup, params.customClass);
//     }
//
//     // Progress steps
//     var progressStepsContainer = getProgressSteps();
//     var currentProgressStep = parseInt(params.currentProgressStep === null ? Swal.getQueueStep() : params.currentProgressStep, 10);
//     if (params.progressSteps && params.progressSteps.length) {
//       show(progressStepsContainer);
//       empty(progressStepsContainer);
//       if (currentProgressStep >= params.progressSteps.length) {
//         warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
//       }
//       params.progressSteps.forEach(function(step, index) {
//         var circle = document.createElement('li');
//         addClass(circle, swalClasses.progresscircle);
//         circle.innerHTML = step;
//         if (index === currentProgressStep) {
//           addClass(circle, swalClasses.activeprogressstep);
//         }
//         progressStepsContainer.appendChild(circle);
//         if (index !== params.progressSteps.length - 1) {
//           var line = document.createElement('li');
//           addClass(line, swalClasses.progressline);
//           if (params.progressStepsDistance) {
//             line.style.width = params.progressStepsDistance;
//           }
//           progressStepsContainer.appendChild(line);
//         }
//       });
//     } else {
//       hide(progressStepsContainer);
//     }
//
//     // Icon
//     var icons = getIcons();
//     for (var _i = 0; _i < icons.length; _i++) {
//       hide(icons[_i]);
//     }
//     if (params.type) {
//       var validType = false;
//       for (var iconType in iconTypes) {
//         if (params.type === iconType) {
//           validType = true;
//           break;
//         }
//       }
//       if (!validType) {
//         error('Unknown alert type: ' + params.type);
//         return false;
//       }
//       var icon = popup.querySelector('.' + swalClasses.icon + '.' + iconTypes[params.type]);
//       show(icon);
//
//       // Animate icon
//       if (params.animation) {
//         addClass(icon, 'swal2-animate-' + params.type + '-icon');
//       }
//     }
//
//     // Custom image
//     var image = getImage();
//     if (params.imageUrl) {
//       image.setAttribute('src', params.imageUrl);
//       image.setAttribute('alt', params.imageAlt);
//       show(image);
//
//       if (params.imageWidth) {
//         image.setAttribute('width', params.imageWidth);
//       } else {
//         image.removeAttribute('width');
//       }
//
//       if (params.imageHeight) {
//         image.setAttribute('height', params.imageHeight);
//       } else {
//         image.removeAttribute('height');
//       }
//
//       image.className = swalClasses.image;
//       if (params.imageClass) {
//         addClass(image, params.imageClass);
//       }
//     } else {
//       hide(image);
//     }
//
//     // Cancel button
//     if (params.showCancelButton) {
//       cancelButton.style.display = 'inline-block';
//     } else {
//       hide(cancelButton);
//     }
//
//     // Confirm button
//     if (params.showConfirmButton) {
//       removeStyleProperty(confirmButton, 'display');
//     } else {
//       hide(confirmButton);
//     }
//
//     // Actions (buttons) wrapper
//     if (!params.showConfirmButton && !params.showCancelButton) {
//       hide(actions);
//     } else {
//       show(actions);
//     }
//
//     // Edit text on confirm and cancel buttons
//     confirmButton.innerHTML = params.confirmButtonText;
//     cancelButton.innerHTML = params.cancelButtonText;
//
//     // ARIA labels for confirm and cancel buttons
//     confirmButton.setAttribute('aria-label', params.confirmButtonAriaLabel);
//     cancelButton.setAttribute('aria-label', params.cancelButtonAriaLabel);
//
//     // Add buttons custom classes
//     confirmButton.className = swalClasses.confirm;
//     addClass(confirmButton, params.confirmButtonClass);
//     cancelButton.className = swalClasses.cancel;
//     addClass(cancelButton, params.cancelButtonClass);
//
//     // Buttons styling
//     if (params.buttonsStyling) {
//       addClass([confirmButton, cancelButton], swalClasses.styled);
//
//       // Buttons background colors
//       if (params.confirmButtonColor) {
//         confirmButton.style.backgroundColor = params.confirmButtonColor;
//       }
//       if (params.cancelButtonColor) {
//         cancelButton.style.backgroundColor = params.cancelButtonColor;
//       }
//
//       // Loading state
//       var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
//       confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
//       confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
//     } else {
//       removeClass([confirmButton, cancelButton], swalClasses.styled);
//
//       confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
//       cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
//     }
//
//     // Footer
//     parseHtmlToContainer(params.footer, footer);
//
//     // CSS animation
//     if (params.animation === true) {
//       removeClass(popup, swalClasses.noanimation);
//     } else {
//       addClass(popup, swalClasses.noanimation);
//     }
//
//     // showLoaderOnConfirm && preConfirm
//     if (params.showLoaderOnConfirm && !params.preConfirm) {
//       warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
//     }
//   }
//
//   /**
//    * Open popup, add necessary classes and styles, fix scrollbar
//    *
//    * @param {Array} params
//    */
//   var openPopup = function openPopup(params) {
//     var container = getContainer();
//     var popup = getPopup();
//
//     if (params.onBeforeOpen !== null && typeof params.onBeforeOpen === 'function') {
//       params.onBeforeOpen(popup);
//     }
//
//     if (params.animation) {
//       addClass(popup, swalClasses.show);
//       addClass(container, swalClasses.fade);
//       removeClass(popup, swalClasses.hide);
//     } else {
//       removeClass(popup, swalClasses.fade);
//     }
//     show(popup);
//
//     // scrolling is 'hidden' until animation is done, after that 'auto'
//     container.style.overflowY = 'hidden';
//     if (animationEndEvent && !hasClass(popup, swalClasses.noanimation)) {
//       popup.addEventListener(animationEndEvent, function swalCloseEventFinished() {
//         popup.removeEventListener(animationEndEvent, swalCloseEventFinished);
//         container.style.overflowY = 'auto';
//       });
//     } else {
//       container.style.overflowY = 'auto';
//     }
//
//     addClass([document.documentElement, document.body, container], swalClasses.shown);
//     if (params.heightAuto && params.backdrop && !params.toast) {
//       addClass([document.documentElement, document.body], swalClasses['height-auto']);
//     }
//
//     if (isModal()) {
//       fixScrollbar();
//       iOSfix();
//     }
//     if (!globalState.previousActiveElement) {
//       globalState.previousActiveElement = document.activeElement;
//     }
//     if (params.onOpen !== null && typeof params.onOpen === 'function') {
//       setTimeout(function() {
//         params.onOpen(popup);
//       });
//     }
//   };
//
//   function _main(userParams) {
//     var _this = this;
//
//     showWarningsForParams(userParams);
//
//     var innerParams = _extends({}, defaultParams, userParams);
//     setParameters(innerParams);
//     Object.freeze(innerParams);
//     privateProps.innerParams.set(this, innerParams);
//
//     // clear the previous timer
//     if (globalState.timeout) {
//       globalState.timeout.stop();
//       delete globalState.timeout;
//     }
//
//     // clear the restore focus timeout
//     clearTimeout(globalState.restoreFocusTimeout);
//
//     var domCache = {
//       popup: getPopup(),
//       container: getContainer(),
//       content: getContent(),
//       actions: getActions(),
//       confirmButton: getConfirmButton(),
//       cancelButton: getCancelButton(),
//       closeButton: getCloseButton(),
//       validationError: getValidationError(),
//       progressSteps: getProgressSteps()
//     };
//     privateProps.domCache.set(this, domCache);
//
//     var constructor = this.constructor;
//
//     return new Promise(function(resolve, reject) {
//       // functions to handle all resolving/rejecting/settling
//       var succeedWith = function succeedWith(value) {
//         constructor.closePopup(innerParams.onClose, innerParams.onAfterClose); // TODO: make closePopup an *instance* method
//         if (innerParams.useRejections) {
//           resolve(value);
//         } else {
//           resolve({
//             value: value
//           });
//         }
//       };
//       var dismissWith = function dismissWith(dismiss) {
//         constructor.closePopup(innerParams.onClose, innerParams.onAfterClose);
//         if (innerParams.useRejections) {
//           reject(dismiss);
//         } else {
//           resolve({
//             dismiss: dismiss
//           });
//         }
//       };
//       var errorWith = function errorWith(error$$1) {
//         constructor.closePopup(innerParams.onClose, innerParams.onAfterClose);
//         reject(error$$1);
//       };
//
//       // Close on timer
//       if (innerParams.timer) {
//         globalState.timeout = new Timer(function() {
//           dismissWith('timer');
//           delete globalState.timeout;
//         }, innerParams.timer);
//       }
//
//       // Get the value of the popup input
//       var getInputValue = function getInputValue() {
//         var input = _this.getInput();
//         if (!input) {
//           return null;
//         }
//         switch (innerParams.input) {
//           case 'checkbox':
//             return input.checked ? 1 : 0;
//           case 'radio':
//             return input.checked ? input.value : null;
//           case 'file':
//             return input.files.length ? input.files[0] : null;
//           default:
//             return innerParams.inputAutoTrim ? input.value.trim() : input.value;
//         }
//       };
//
//       // input autofocus
//       if (innerParams.input) {
//         setTimeout(function() {
//           var input = _this.getInput();
//           if (input) {
//             focusInput(input);
//           }
//         }, 0);
//       }
//
//       var confirm = function confirm(value) {
//         if (innerParams.showLoaderOnConfirm) {
//           constructor.showLoading(); // TODO: make showLoading an *instance* method
//         }
//
//         if (innerParams.preConfirm) {
//           _this.resetValidationError();
//           var preConfirmPromise = Promise.resolve().then(function() {
//             return innerParams.preConfirm(value, innerParams.extraParams);
//           });
//           if (innerParams.expectRejections) {
//             preConfirmPromise.then(function(preConfirmValue) {
//               return succeedWith(preConfirmValue || value);
//             }, function(validationError) {
//               _this.hideLoading();
//               if (validationError) {
//                 _this.showValidationError(validationError);
//               }
//             });
//           } else {
//             preConfirmPromise.then(function(preConfirmValue) {
//               if (isVisible(domCache.validationError) || preConfirmValue === false) {
//                 _this.hideLoading();
//               } else {
//                 succeedWith(preConfirmValue || value);
//               }
//             }, function(error$$1) {
//               return errorWith(error$$1);
//             });
//           }
//         } else {
//           succeedWith(value);
//         }
//       };
//
//       // Mouse interactions
//       var onButtonEvent = function onButtonEvent(event) {
//         var e = event || window.event;
//         var target = e.target || e.srcElement;
//         var confirmButton = domCache.confirmButton,
//           cancelButton = domCache.cancelButton;
//
//         var targetedConfirm = confirmButton && (confirmButton === target || confirmButton.contains(target));
//         var targetedCancel = cancelButton && (cancelButton === target || cancelButton.contains(target));
//
//         switch (e.type) {
//           case 'click':
//             // Clicked 'confirm'
//             if (targetedConfirm && constructor.isVisible()) {
//               _this.disableButtons();
//               if (innerParams.input) {
//                 var inputValue = getInputValue();
//
//                 if (innerParams.inputValidator) {
//                   _this.disableInput();
//                   var validationPromise = Promise.resolve().then(function() {
//                     return innerParams.inputValidator(inputValue, innerParams.extraParams);
//                   });
//                   if (innerParams.expectRejections) {
//                     validationPromise.then(function() {
//                       _this.enableButtons();
//                       _this.enableInput();
//                       confirm(inputValue);
//                     }, function(validationError) {
//                       _this.enableButtons();
//                       _this.enableInput();
//                       if (validationError) {
//                         _this.showValidationError(validationError);
//                       }
//                     });
//                   } else {
//                     validationPromise.then(function(validationError) {
//                       _this.enableButtons();
//                       _this.enableInput();
//                       if (validationError) {
//                         _this.showValidationError(validationError);
//                       } else {
//                         confirm(inputValue);
//                       }
//                     }, function(error$$1) {
//                       return errorWith(error$$1);
//                     });
//                   }
//                 } else {
//                   confirm(inputValue);
//                 }
//               } else {
//                 confirm(true);
//               }
//
//               // Clicked 'cancel'
//             } else if (targetedCancel && constructor.isVisible()) {
//               _this.disableButtons();
//               dismissWith(constructor.DismissReason.cancel);
//             }
//             break;
//           default:
//         }
//       };
//
//       var buttons = domCache.popup.querySelectorAll('button');
//       for (var i = 0; i < buttons.length; i++) {
//         buttons[i].onclick = onButtonEvent;
//         buttons[i].onmouseover = onButtonEvent;
//         buttons[i].onmouseout = onButtonEvent;
//         buttons[i].onmousedown = onButtonEvent;
//       }
//
//       // Closing popup by close button
//       domCache.closeButton.onclick = function() {
//         dismissWith(constructor.DismissReason.close);
//       };
//
//       if (innerParams.toast) {
//         // Closing popup by internal click
//         domCache.popup.onclick = function(e) {
//           if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
//             return;
//           }
//           constructor.closePopup(innerParams.onClose, innerParams.onAfterClose);
//           dismissWith(constructor.DismissReason.close);
//         };
//       } else {
//         var ignoreOutsideClick = false;
//
//         // Ignore click events that had mousedown on the popup but mouseup on the container
//         // This can happen when the user drags a slider
//         domCache.popup.onmousedown = function() {
//           domCache.container.onmouseup = function(e) {
//             domCache.container.onmouseup = undefined;
//             // We only check if the mouseup target is the container because usually it doesn't
//             // have any other direct children aside of the popup
//             if (e.target === domCache.container) {
//               ignoreOutsideClick = true;
//             }
//           };
//         };
//
//         // Ignore click events that had mousedown on the container but mouseup on the popup
//         domCache.container.onmousedown = function() {
//           domCache.popup.onmouseup = function(e) {
//             domCache.popup.onmouseup = undefined;
//             // We also need to check if the mouseup target is a child of the popup
//             if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
//               ignoreOutsideClick = true;
//             }
//           };
//         };
//
//         domCache.container.onclick = function(e) {
//           if (ignoreOutsideClick) {
//             ignoreOutsideClick = false;
//             return;
//           }
//           if (e.target !== domCache.container) {
//             return;
//           }
//           if (callIfFunction(innerParams.allowOutsideClick)) {
//             dismissWith(constructor.DismissReason.backdrop);
//           }
//         };
//       }
//
//       // Reverse buttons (Confirm on the right side)
//       if (innerParams.reverseButtons) {
//         domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton);
//       } else {
//         domCache.confirmButton.parentNode.insertBefore(domCache.confirmButton, domCache.cancelButton);
//       }
//
//       // Focus handling
//       var setFocus = function setFocus(index, increment) {
//         var focusableElements = getFocusableElements(innerParams.focusCancel);
//         // search for visible elements and select the next possible match
//         for (var _i = 0; _i < focusableElements.length; _i++) {
//           index = index + increment;
//
//           // rollover to first item
//           if (index === focusableElements.length) {
//             index = 0;
//
//             // go to last item
//           } else if (index === -1) {
//             index = focusableElements.length - 1;
//           }
//
//           // determine if element is visible
//           var el = focusableElements[index];
//           if (isVisible(el)) {
//             return el.focus();
//           }
//         }
//         // no visible focusable elements, focus the popup
//         domCache.popup.focus();
//       };
//
//       var keydownHandler = function keydownHandler(e, innerParams) {
//         if (innerParams.stopKeydownPropagation) {
//           e.stopPropagation();
//         }
//
//         var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
//         ];
//
//         if (e.key === 'Enter' && !e.isComposing) {
//           if (e.target && _this.getInput() && e.target.outerHTML === _this.getInput().outerHTML) {
//             if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
//               return; // do not submit
//             }
//
//             constructor.clickConfirm();
//             e.preventDefault();
//           }
//
//           // TAB
//         } else if (e.key === 'Tab') {
//           var targetElement = e.target || e.srcElement;
//
//           var focusableElements = getFocusableElements(innerParams.focusCancel);
//           var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
//           for (var _i2 = 0; _i2 < focusableElements.length; _i2++) {
//             if (targetElement === focusableElements[_i2]) {
//               btnIndex = _i2;
//               break;
//             }
//           }
//
//           if (!e.shiftKey) {
//             // Cycle to the next button
//             setFocus(btnIndex, 1);
//           } else {
//             // Cycle to the prev button
//             setFocus(btnIndex, -1);
//           }
//           e.stopPropagation();
//           e.preventDefault();
//
//           // ARROWS - switch focus between buttons
//         } else if (arrowKeys.indexOf(e.key) !== -1) {
//           // focus Cancel button if Confirm button is currently focused
//           if (document.activeElement === domCache.confirmButton && isVisible(domCache.cancelButton)) {
//             domCache.cancelButton.focus();
//             // and vice versa
//           } else if (document.activeElement === domCache.cancelButton && isVisible(domCache.confirmButton)) {
//             domCache.confirmButton.focus();
//           }
//
//           // ESC
//         } else if ((e.key === 'Escape' || e.key === 'Esc') && callIfFunction(innerParams.allowEscapeKey) === true) {
//           dismissWith(constructor.DismissReason.esc);
//         }
//       };
//
//       if (globalState.keydownHandlerAdded) {
//         globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
//           capture: globalState.keydownListenerCapture
//         });
//         globalState.keydownHandlerAdded = false;
//       }
//
//       if (!innerParams.toast) {
//         globalState.keydownHandler = function(e) {
//           return keydownHandler(e, innerParams);
//         };
//         globalState.keydownTarget = innerParams.keydownListenerCapture ? window : domCache.popup;
//         globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
//         globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
//           capture: globalState.keydownListenerCapture
//         });
//         globalState.keydownHandlerAdded = true;
//       }
//
//       _this.enableButtons();
//       _this.hideLoading();
//       _this.resetValidationError();
//
//       if (innerParams.input) {
//         addClass(document.body, swalClasses['has-input']);
//       }
//
//       // inputs
//       var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
//       var input = void 0;
//       for (var _i3 = 0; _i3 < inputTypes.length; _i3++) {
//         var inputClass = swalClasses[inputTypes[_i3]];
//         var inputContainer = getChildByClass(domCache.content, inputClass);
//         input = _this.getInput(inputTypes[_i3]);
//
//         // set attributes
//         if (input) {
//           for (var j in input.attributes) {
//             if (input.attributes.hasOwnProperty(j)) {
//               var attrName = input.attributes[j].name;
//               if (attrName !== 'type' && attrName !== 'value') {
//                 input.removeAttribute(attrName);
//               }
//             }
//           }
//           for (var attr in innerParams.inputAttributes) {
//             input.setAttribute(attr, innerParams.inputAttributes[attr]);
//           }
//         }
//
//         // set class
//         inputContainer.className = inputClass;
//         if (innerParams.inputClass) {
//           addClass(inputContainer, innerParams.inputClass);
//         }
//
//         hide(inputContainer);
//       }
//
//       var populateInputOptions = void 0;
//       switch (innerParams.input) {
//         case 'text':
//         case 'email':
//         case 'password':
//         case 'number':
//         case 'tel':
//         case 'url':
//           input = getChildByClass(domCache.content, swalClasses.input);
//           input.value = innerParams.inputValue;
//           input.placeholder = innerParams.inputPlaceholder;
//           input.type = innerParams.input;
//           show(input);
//           break;
//         case 'file':
//           input = getChildByClass(domCache.content, swalClasses.file);
//           input.placeholder = innerParams.inputPlaceholder;
//           input.type = innerParams.input;
//           show(input);
//           break;
//         case 'range':
//           var range = getChildByClass(domCache.content, swalClasses.range);
//           var rangeInput = range.querySelector('input');
//           var rangeOutput = range.querySelector('output');
//           rangeInput.value = innerParams.inputValue;
//           rangeInput.type = innerParams.input;
//           rangeOutput.value = innerParams.inputValue;
//           show(range);
//           break;
//         case 'select':
//           var select = getChildByClass(domCache.content, swalClasses.select);
//           select.innerHTML = '';
//           if (innerParams.inputPlaceholder) {
//             var placeholder = document.createElement('option');
//             placeholder.innerHTML = innerParams.inputPlaceholder;
//             placeholder.value = '';
//             placeholder.disabled = true;
//             placeholder.selected = true;
//             select.appendChild(placeholder);
//           }
//           populateInputOptions = function populateInputOptions(inputOptions) {
//             inputOptions.forEach(function(_ref) {
//               var _ref2 = slicedToArray(_ref, 2),
//                 optionValue = _ref2[0],
//                 optionLabel = _ref2[1];
//
//               var option = document.createElement('option');
//               option.value = optionValue;
//               option.innerHTML = optionLabel;
//               if (innerParams.inputValue.toString() === optionValue.toString()) {
//                 option.selected = true;
//               }
//               select.appendChild(option);
//             });
//             show(select);
//             select.focus();
//           };
//           break;
//         case 'radio':
//           var radio = getChildByClass(domCache.content, swalClasses.radio);
//           radio.innerHTML = '';
//           populateInputOptions = function populateInputOptions(inputOptions) {
//             inputOptions.forEach(function(_ref3) {
//               var _ref4 = slicedToArray(_ref3, 2),
//                 radioValue = _ref4[0],
//                 radioLabel = _ref4[1];
//
//               var radioInput = document.createElement('input');
//               var radioLabelElement = document.createElement('label');
//               radioInput.type = 'radio';
//               radioInput.name = swalClasses.radio;
//               radioInput.value = radioValue;
//               if (innerParams.inputValue.toString() === radioValue.toString()) {
//                 radioInput.checked = true;
//               }
//               radioLabelElement.innerHTML = radioLabel;
//               radioLabelElement.insertBefore(radioInput, radioLabelElement.firstChild);
//               radio.appendChild(radioLabelElement);
//             });
//             show(radio);
//             var radios = radio.querySelectorAll('input');
//             if (radios.length) {
//               radios[0].focus();
//             }
//           };
//           break;
//         case 'checkbox':
//           var checkbox = getChildByClass(domCache.content, swalClasses.checkbox);
//           var checkboxInput = _this.getInput('checkbox');
//           checkboxInput.type = 'checkbox';
//           checkboxInput.value = 1;
//           checkboxInput.id = swalClasses.checkbox;
//           checkboxInput.checked = Boolean(innerParams.inputValue);
//           var label = checkbox.getElementsByTagName('span');
//           if (label.length) {
//             checkbox.removeChild(label[0]);
//           }
//           label = document.createElement('span');
//           label.innerHTML = innerParams.inputPlaceholder;
//           checkbox.appendChild(label);
//           show(checkbox);
//           break;
//         case 'textarea':
//           var textarea = getChildByClass(domCache.content, swalClasses.textarea);
//           textarea.value = innerParams.inputValue;
//           textarea.placeholder = innerParams.inputPlaceholder;
//           show(textarea);
//           break;
//         case null:
//           break;
//         default:
//           error('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' + innerParams.input + '"');
//           break;
//       }
//
//       if (innerParams.input === 'select' || innerParams.input === 'radio') {
//         var processInputOptions = function processInputOptions(inputOptions) {
//           return populateInputOptions(formatInputOptions(inputOptions));
//         };
//         if (isThenable(innerParams.inputOptions)) {
//           constructor.showLoading();
//           innerParams.inputOptions.then(function(inputOptions) {
//             _this.hideLoading();
//             processInputOptions(inputOptions);
//           });
//         } else if (_typeof(innerParams.inputOptions) === 'object') {
//           processInputOptions(innerParams.inputOptions);
//         } else {
//           error('Unexpected type of inputOptions! Expected object, Map or Promise, got ' + _typeof(innerParams.inputOptions));
//         }
//       } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(innerParams.input) !== -1 && isThenable(innerParams.inputValue)) {
//         constructor.showLoading();
//         hide(input);
//         innerParams.inputValue.then(function(inputValue) {
//           input.value = innerParams.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + '';
//           show(input);
//           _this.hideLoading();
//         }).catch(function(err) {
//           error('Error in inputValue promise: ' + err);
//           input.value = '';
//           show(input);
//           _this.hideLoading();
//         });
//       }
//
//       openPopup(innerParams);
//
//       if (!innerParams.toast) {
//         if (!callIfFunction(innerParams.allowEnterKey)) {
//           if (document.activeElement) {
//             document.activeElement.blur();
//           }
//         } else if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
//           domCache.cancelButton.focus();
//         } else if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
//           domCache.confirmButton.focus();
//         } else {
//           setFocus(-1, 1);
//         }
//       }
//
//       // fix scroll
//       domCache.container.scrollTop = 0;
//     });
//   }
//
//
//
//   var instanceMethods = Object.freeze({
//     hideLoading: hideLoading,
//     disableLoading: hideLoading,
//     getInput: getInput,
//     enableButtons: enableButtons,
//     disableButtons: disableButtons,
//     enableConfirmButton: enableConfirmButton,
//     disableConfirmButton: disableConfirmButton,
//     enableInput: enableInput,
//     disableInput: disableInput,
//     showValidationError: showValidationError,
//     resetValidationError: resetValidationError,
//     _main: _main
//   });
//
//   var currentInstance = void 0;
//
//   // SweetAlert constructor
//   function SweetAlert() {
//     // Prevent run in Node env
//     if (typeof window === 'undefined') {
//       return;
//     }
//
//     // Check for the existence of Promise
//     if (typeof Promise === 'undefined') {
//       error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
//     }
//
//     for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
//       args[_key] = arguments[_key];
//     }
//
//     if (typeof args[0] === 'undefined') {
//       error('SweetAlert2 expects at least 1 attribute!');
//       return false;
//     }
//
//     currentInstance = this;
//
//     var outerParams = Object.freeze(this.constructor.argsToParams(args));
//
//     Object.defineProperties(this, {
//       params: {
//         value: outerParams,
//         writable: false,
//         enumerable: true
//       }
//     });
//
//     var promise = this._main(this.params);
//     privateProps.promise.set(this, promise);
//   }
//
//   // `catch` cannot be the name of a module export, so we define our thenable methods here instead
//   SweetAlert.prototype.then = function(onFulfilled, onRejected) {
//     var promise = privateProps.promise.get(this);
//     return promise.then(onFulfilled, onRejected);
//   };
//   SweetAlert.prototype.catch = function(onRejected) {
//     var promise = privateProps.promise.get(this);
//     return promise.catch(onRejected);
//   };
//   SweetAlert.prototype.finally = function(onFinally) {
//     var promise = privateProps.promise.get(this);
//     return promise.finally(onFinally);
//   };
//
//   // Assign instance methods from src/instanceMethods/*.js to prototype
//   _extends(SweetAlert.prototype, instanceMethods);
//
//   // Assign static methods from src/staticMethods/*.js to constructor
//   _extends(SweetAlert, staticMethods);
//
//   // Proxy to instance methods to constructor, for now, for backwards compatibility
//   Object.keys(instanceMethods).forEach(function(key) {
//     SweetAlert[key] = function() {
//       if (currentInstance) {
//         var _currentInstance;
//
//         return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
//       }
//     };
//   });
//
//   SweetAlert.DismissReason = DismissReason;
//
//   SweetAlert.noop = function() {};
//
//   SweetAlert.version = version;
//
//   var Swal = withNoNewKeyword(withGlobalDefaults(SweetAlert));
//   Swal.default = Swal;
//
//   return Swal;
//
// })));
// if (typeof window !== 'undefined' && window.Sweetalert2) {
//   window.swal = window.sweetAlert = window.Swal = window.SweetAlert = window.Sweetalert2
// }
//
// "undefined" != typeof document && function(e, t) {
//   var n = e.createElement("style");
//   if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t);
//   else try {
//     n.innerHTML = t
//   } catch (e) {
//     n.innerText = t
//   }
// }(document, "@-webkit-keyframes swal2-show {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: scale(0.7);\n" +
//   "            transform: scale(0.7); }\n" +
//   "  45% {\n" +
//   "    -webkit-transform: scale(1.05);\n" +
//   "            transform: scale(1.05); }\n" +
//   "  80% {\n" +
//   "    -webkit-transform: scale(0.95);\n" +
//   "            transform: scale(0.95); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1); } }\n" +
//   "\n" +
//   "@keyframes swal2-show {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: scale(0.7);\n" +
//   "            transform: scale(0.7); }\n" +
//   "  45% {\n" +
//   "    -webkit-transform: scale(1.05);\n" +
//   "            transform: scale(1.05); }\n" +
//   "  80% {\n" +
//   "    -webkit-transform: scale(0.95);\n" +
//   "            transform: scale(0.95); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1); } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-hide {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1);\n" +
//   "    opacity: 1; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: scale(0.5);\n" +
//   "            transform: scale(0.5);\n" +
//   "    opacity: 0; } }\n" +
//   "\n" +
//   "@keyframes swal2-hide {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1);\n" +
//   "    opacity: 1; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: scale(0.5);\n" +
//   "            transform: scale(0.5);\n" +
//   "    opacity: 0; } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-animate-success-line-tip {\n" +
//   "  0% {\n" +
//   "    top: 1.1875em;\n" +
//   "    left: .0625em;\n" +
//   "    width: 0; }\n" +
//   "  54% {\n" +
//   "    top: 1.0625em;\n" +
//   "    left: .125em;\n" +
//   "    width: 0; }\n" +
//   "  70% {\n" +
//   "    top: 2.1875em;\n" +
//   "    left: -.375em;\n" +
//   "    width: 3.125em; }\n" +
//   "  84% {\n" +
//   "    top: 3em;\n" +
//   "    left: 1.3125em;\n" +
//   "    width: 1.0625em; }\n" +
//   "  100% {\n" +
//   "    top: 2.8125em;\n" +
//   "    left: .875em;\n" +
//   "    width: 1.5625em; } }\n" +
//   "\n" +
//   "@keyframes swal2-animate-success-line-tip {\n" +
//   "  0% {\n" +
//   "    top: 1.1875em;\n" +
//   "    left: .0625em;\n" +
//   "    width: 0; }\n" +
//   "  54% {\n" +
//   "    top: 1.0625em;\n" +
//   "    left: .125em;\n" +
//   "    width: 0; }\n" +
//   "  70% {\n" +
//   "    top: 2.1875em;\n" +
//   "    left: -.375em;\n" +
//   "    width: 3.125em; }\n" +
//   "  84% {\n" +
//   "    top: 3em;\n" +
//   "    left: 1.3125em;\n" +
//   "    width: 1.0625em; }\n" +
//   "  100% {\n" +
//   "    top: 2.8125em;\n" +
//   "    left: .875em;\n" +
//   "    width: 1.5625em; } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-animate-success-line-long {\n" +
//   "  0% {\n" +
//   "    top: 3.375em;\n" +
//   "    right: 2.875em;\n" +
//   "    width: 0; }\n" +
//   "  65% {\n" +
//   "    top: 3.375em;\n" +
//   "    right: 2.875em;\n" +
//   "    width: 0; }\n" +
//   "  84% {\n" +
//   "    top: 2.1875em;\n" +
//   "    right: 0;\n" +
//   "    width: 3.4375em; }\n" +
//   "  100% {\n" +
//   "    top: 2.375em;\n" +
//   "    right: .5em;\n" +
//   "    width: 2.9375em; } }\n" +
//   "\n" +
//   "@keyframes swal2-animate-success-line-long {\n" +
//   "  0% {\n" +
//   "    top: 3.375em;\n" +
//   "    right: 2.875em;\n" +
//   "    width: 0; }\n" +
//   "  65% {\n" +
//   "    top: 3.375em;\n" +
//   "    right: 2.875em;\n" +
//   "    width: 0; }\n" +
//   "  84% {\n" +
//   "    top: 2.1875em;\n" +
//   "    right: 0;\n" +
//   "    width: 3.4375em; }\n" +
//   "  100% {\n" +
//   "    top: 2.375em;\n" +
//   "    right: .5em;\n" +
//   "    width: 2.9375em; } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-rotate-success-circular-line {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotate(-45deg);\n" +
//   "            transform: rotate(-45deg); }\n" +
//   "  5% {\n" +
//   "    -webkit-transform: rotate(-45deg);\n" +
//   "            transform: rotate(-45deg); }\n" +
//   "  12% {\n" +
//   "    -webkit-transform: rotate(-405deg);\n" +
//   "            transform: rotate(-405deg); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotate(-405deg);\n" +
//   "            transform: rotate(-405deg); } }\n" +
//   "\n" +
//   "@keyframes swal2-rotate-success-circular-line {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotate(-45deg);\n" +
//   "            transform: rotate(-45deg); }\n" +
//   "  5% {\n" +
//   "    -webkit-transform: rotate(-45deg);\n" +
//   "            transform: rotate(-45deg); }\n" +
//   "  12% {\n" +
//   "    -webkit-transform: rotate(-405deg);\n" +
//   "            transform: rotate(-405deg); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotate(-405deg);\n" +
//   "            transform: rotate(-405deg); } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-animate-error-x-mark {\n" +
//   "  0% {\n" +
//   "    margin-top: 1.625em;\n" +
//   "    -webkit-transform: scale(0.4);\n" +
//   "            transform: scale(0.4);\n" +
//   "    opacity: 0; }\n" +
//   "  50% {\n" +
//   "    margin-top: 1.625em;\n" +
//   "    -webkit-transform: scale(0.4);\n" +
//   "            transform: scale(0.4);\n" +
//   "    opacity: 0; }\n" +
//   "  80% {\n" +
//   "    margin-top: -.375em;\n" +
//   "    -webkit-transform: scale(1.15);\n" +
//   "            transform: scale(1.15); }\n" +
//   "  100% {\n" +
//   "    margin-top: 0;\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "@keyframes swal2-animate-error-x-mark {\n" +
//   "  0% {\n" +
//   "    margin-top: 1.625em;\n" +
//   "    -webkit-transform: scale(0.4);\n" +
//   "            transform: scale(0.4);\n" +
//   "    opacity: 0; }\n" +
//   "  50% {\n" +
//   "    margin-top: 1.625em;\n" +
//   "    -webkit-transform: scale(0.4);\n" +
//   "            transform: scale(0.4);\n" +
//   "    opacity: 0; }\n" +
//   "  80% {\n" +
//   "    margin-top: -.375em;\n" +
//   "    -webkit-transform: scale(1.15);\n" +
//   "            transform: scale(1.15); }\n" +
//   "  100% {\n" +
//   "    margin-top: 0;\n" +
//   "    -webkit-transform: scale(1);\n" +
//   "            transform: scale(1);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-animate-error-icon {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotateX(100deg);\n" +
//   "            transform: rotateX(100deg);\n" +
//   "    opacity: 0; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotateX(0deg);\n" +
//   "            transform: rotateX(0deg);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "@keyframes swal2-animate-error-icon {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotateX(100deg);\n" +
//   "            transform: rotateX(100deg);\n" +
//   "    opacity: 0; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotateX(0deg);\n" +
//   "            transform: rotateX(0deg);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "body.swal2-toast-shown.swal2-has-input > .swal2-container > .swal2-toast {\n" +
//   "  flex-direction: column;\n" +
//   "  align-items: stretch; }\n" +
//   "  body.swal2-toast-shown.swal2-has-input > .swal2-container > .swal2-toast .swal2-actions {\n" +
//   "    flex: 1;\n" +
//   "    align-self: stretch;\n" +
//   "    justify-content: flex-end;\n" +
//   "    height: 2.2em; }\n" +
//   "  body.swal2-toast-shown.swal2-has-input > .swal2-container > .swal2-toast .swal2-loading {\n" +
//   "    justify-content: center; }\n" +
//   "  body.swal2-toast-shown.swal2-has-input > .swal2-container > .swal2-toast .swal2-input {\n" +
//   "    height: 2em;\n" +
//   "    margin: .3125em auto;\n" +
//   "    font-size: 1em; }\n" +
//   "  body.swal2-toast-shown.swal2-has-input > .swal2-container > .swal2-toast .swal2-validationerror {\n" +
//   "    font-size: 1em; }\n" +
//   "\n" +
//   "body.swal2-toast-shown > .swal2-container {\n" +
//   "  position: fixed;\n" +
//   "  background-color: transparent; }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-shown {\n" +
//   "    background-color: transparent; }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-top {\n" +
//   "    top: 0;\n" +
//   "    right: auto;\n" +
//   "    bottom: auto;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translateX(-50%);\n" +
//   "            transform: translateX(-50%); }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-top-end, body.swal2-toast-shown > .swal2-container.swal2-top-right {\n" +
//   "    top: 0;\n" +
//   "    right: 0;\n" +
//   "    bottom: auto;\n" +
//   "    left: auto; }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-top-start, body.swal2-toast-shown > .swal2-container.swal2-top-left {\n" +
//   "    top: 0;\n" +
//   "    right: auto;\n" +
//   "    bottom: auto;\n" +
//   "    left: 0; }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-center-start, body.swal2-toast-shown > .swal2-container.swal2-center-left {\n" +
//   "    top: 50%;\n" +
//   "    right: auto;\n" +
//   "    bottom: auto;\n" +
//   "    left: 0;\n" +
//   "    -webkit-transform: translateY(-50%);\n" +
//   "            transform: translateY(-50%); }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-center {\n" +
//   "    top: 50%;\n" +
//   "    right: auto;\n" +
//   "    bottom: auto;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translate(-50%, -50%);\n" +
//   "            transform: translate(-50%, -50%); }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-center-end, body.swal2-toast-shown > .swal2-container.swal2-center-right {\n" +
//   "    top: 50%;\n" +
//   "    right: 0;\n" +
//   "    bottom: auto;\n" +
//   "    left: auto;\n" +
//   "    -webkit-transform: translateY(-50%);\n" +
//   "            transform: translateY(-50%); }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-bottom-start, body.swal2-toast-shown > .swal2-container.swal2-bottom-left {\n" +
//   "    top: auto;\n" +
//   "    right: auto;\n" +
//   "    bottom: 0;\n" +
//   "    left: 0; }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-bottom {\n" +
//   "    top: auto;\n" +
//   "    right: auto;\n" +
//   "    bottom: 0;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translateX(-50%);\n" +
//   "            transform: translateX(-50%); }\n" +
//   "  body.swal2-toast-shown > .swal2-container.swal2-bottom-end, body.swal2-toast-shown > .swal2-container.swal2-bottom-right {\n" +
//   "    top: auto;\n" +
//   "    right: 0;\n" +
//   "    bottom: 0;\n" +
//   "    left: auto; }\n" +
//   "\n" +
//   ".swal2-popup.swal2-toast {\n" +
//   "  flex-direction: row;\n" +
//   "  align-items: center;\n" +
//   "  width: auto;\n" +
//   "  padding: 0.625em;\n" +
//   "  box-shadow: 0 0 0.625em #d9d9d9;\n" +
//   "  overflow-y: hidden; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-header {\n" +
//   "    flex-direction: row; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-title {\n" +
//   "    justify-content: flex-start;\n" +
//   "    margin: 0 .6em;\n" +
//   "    font-size: 1em; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-close {\n" +
//   "    position: initial; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-content {\n" +
//   "    justify-content: flex-start;\n" +
//   "    font-size: 1em; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-icon {\n" +
//   "    width: 2em;\n" +
//   "    min-width: 2em;\n" +
//   "    height: 2em;\n" +
//   "    margin: 0; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-icon-text {\n" +
//   "      font-size: 2em;\n" +
//   "      font-weight: bold;\n" +
//   "      line-height: 1em; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring {\n" +
//   "      width: 2em;\n" +
//   "      height: 2em; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {\n" +
//   "      top: .875em;\n" +
//   "      width: 1.375em; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-icon.swal2-error [class^='swal2-x-mark-line'][class$='left'] {\n" +
//   "        left: .3125em; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-icon.swal2-error [class^='swal2-x-mark-line'][class$='right'] {\n" +
//   "        right: .3125em; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-actions {\n" +
//   "    height: auto;\n" +
//   "    margin: 0 .3125em; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-styled {\n" +
//   "    margin: 0 .3125em;\n" +
//   "    padding: .3125em .625em;\n" +
//   "    font-size: 1em; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-styled:focus {\n" +
//   "      box-shadow: 0 0 0 0.0625em #fff, 0 0 0 0.125em rgba(50, 100, 150, 0.4); }\n" +
//   "  .swal2-popup.swal2-toast .swal2-success {\n" +
//   "    border-color: #a5dc86; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-circular-line'] {\n" +
//   "      position: absolute;\n" +
//   "      width: 2em;\n" +
//   "      height: 2.8125em;\n" +
//   "      -webkit-transform: rotate(45deg);\n" +
//   "              transform: rotate(45deg);\n" +
//   "      border-radius: 50%; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-circular-line'][class$='left'] {\n" +
//   "        top: -.25em;\n" +
//   "        left: -.9375em;\n" +
//   "        -webkit-transform: rotate(-45deg);\n" +
//   "                transform: rotate(-45deg);\n" +
//   "        -webkit-transform-origin: 2em 2em;\n" +
//   "                transform-origin: 2em 2em;\n" +
//   "        border-radius: 4em 0 0 4em; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-circular-line'][class$='right'] {\n" +
//   "        top: -.25em;\n" +
//   "        left: .9375em;\n" +
//   "        -webkit-transform-origin: 0 2em;\n" +
//   "                transform-origin: 0 2em;\n" +
//   "        border-radius: 0 4em 4em 0; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-success .swal2-success-ring {\n" +
//   "      width: 2em;\n" +
//   "      height: 2em; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-success .swal2-success-fix {\n" +
//   "      top: 0;\n" +
//   "      left: .4375em;\n" +
//   "      width: .4375em;\n" +
//   "      height: 2.6875em; }\n" +
//   "    .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-line'] {\n" +
//   "      height: .3125em; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-line'][class$='tip'] {\n" +
//   "        top: 1.125em;\n" +
//   "        left: .1875em;\n" +
//   "        width: .75em; }\n" +
//   "      .swal2-popup.swal2-toast .swal2-success [class^='swal2-success-line'][class$='long'] {\n" +
//   "        top: .9375em;\n" +
//   "        right: .1875em;\n" +
//   "        width: 1.375em; }\n" +
//   "  .swal2-popup.swal2-toast.swal2-show {\n" +
//   "    -webkit-animation: showSweetToast .5s;\n" +
//   "            animation: showSweetToast .5s; }\n" +
//   "  .swal2-popup.swal2-toast.swal2-hide {\n" +
//   "    -webkit-animation: hideSweetToast .2s forwards;\n" +
//   "            animation: hideSweetToast .2s forwards; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-tip {\n" +
//   "    -webkit-animation: animate-toast-success-tip .75s;\n" +
//   "            animation: animate-toast-success-tip .75s; }\n" +
//   "  .swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-long {\n" +
//   "    -webkit-animation: animate-toast-success-long .75s;\n" +
//   "            animation: animate-toast-success-long .75s; }\n" +
//   "\n" +
//   "@-webkit-keyframes showSweetToast {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: translateY(-0.625em) rotateZ(2deg);\n" +
//   "            transform: translateY(-0.625em) rotateZ(2deg);\n" +
//   "    opacity: 0; }\n" +
//   "  33% {\n" +
//   "    -webkit-transform: translateY(0) rotateZ(-2deg);\n" +
//   "            transform: translateY(0) rotateZ(-2deg);\n" +
//   "    opacity: .5; }\n" +
//   "  66% {\n" +
//   "    -webkit-transform: translateY(0.3125em) rotateZ(2deg);\n" +
//   "            transform: translateY(0.3125em) rotateZ(2deg);\n" +
//   "    opacity: .7; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: translateY(0) rotateZ(0);\n" +
//   "            transform: translateY(0) rotateZ(0);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "@keyframes showSweetToast {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: translateY(-0.625em) rotateZ(2deg);\n" +
//   "            transform: translateY(-0.625em) rotateZ(2deg);\n" +
//   "    opacity: 0; }\n" +
//   "  33% {\n" +
//   "    -webkit-transform: translateY(0) rotateZ(-2deg);\n" +
//   "            transform: translateY(0) rotateZ(-2deg);\n" +
//   "    opacity: .5; }\n" +
//   "  66% {\n" +
//   "    -webkit-transform: translateY(0.3125em) rotateZ(2deg);\n" +
//   "            transform: translateY(0.3125em) rotateZ(2deg);\n" +
//   "    opacity: .7; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: translateY(0) rotateZ(0);\n" +
//   "            transform: translateY(0) rotateZ(0);\n" +
//   "    opacity: 1; } }\n" +
//   "\n" +
//   "@-webkit-keyframes hideSweetToast {\n" +
//   "  0% {\n" +
//   "    opacity: 1; }\n" +
//   "  33% {\n" +
//   "    opacity: .5; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotateZ(1deg);\n" +
//   "            transform: rotateZ(1deg);\n" +
//   "    opacity: 0; } }\n" +
//   "\n" +
//   "@keyframes hideSweetToast {\n" +
//   "  0% {\n" +
//   "    opacity: 1; }\n" +
//   "  33% {\n" +
//   "    opacity: .5; }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotateZ(1deg);\n" +
//   "            transform: rotateZ(1deg);\n" +
//   "    opacity: 0; } }\n" +
//   "\n" +
//   "@-webkit-keyframes animate-toast-success-tip {\n" +
//   "  0% {\n" +
//   "    top: .5625em;\n" +
//   "    left: .0625em;\n" +
//   "    width: 0; }\n" +
//   "  54% {\n" +
//   "    top: .125em;\n" +
//   "    left: .125em;\n" +
//   "    width: 0; }\n" +
//   "  70% {\n" +
//   "    top: .625em;\n" +
//   "    left: -.25em;\n" +
//   "    width: 1.625em; }\n" +
//   "  84% {\n" +
//   "    top: 1.0625em;\n" +
//   "    left: .75em;\n" +
//   "    width: .5em; }\n" +
//   "  100% {\n" +
//   "    top: 1.125em;\n" +
//   "    left: .1875em;\n" +
//   "    width: .75em; } }\n" +
//   "\n" +
//   "@keyframes animate-toast-success-tip {\n" +
//   "  0% {\n" +
//   "    top: .5625em;\n" +
//   "    left: .0625em;\n" +
//   "    width: 0; }\n" +
//   "  54% {\n" +
//   "    top: .125em;\n" +
//   "    left: .125em;\n" +
//   "    width: 0; }\n" +
//   "  70% {\n" +
//   "    top: .625em;\n" +
//   "    left: -.25em;\n" +
//   "    width: 1.625em; }\n" +
//   "  84% {\n" +
//   "    top: 1.0625em;\n" +
//   "    left: .75em;\n" +
//   "    width: .5em; }\n" +
//   "  100% {\n" +
//   "    top: 1.125em;\n" +
//   "    left: .1875em;\n" +
//   "    width: .75em; } }\n" +
//   "\n" +
//   "@-webkit-keyframes animate-toast-success-long {\n" +
//   "  0% {\n" +
//   "    top: 1.625em;\n" +
//   "    right: 1.375em;\n" +
//   "    width: 0; }\n" +
//   "  65% {\n" +
//   "    top: 1.25em;\n" +
//   "    right: .9375em;\n" +
//   "    width: 0; }\n" +
//   "  84% {\n" +
//   "    top: .9375em;\n" +
//   "    right: 0;\n" +
//   "    width: 1.125em; }\n" +
//   "  100% {\n" +
//   "    top: .9375em;\n" +
//   "    right: .1875em;\n" +
//   "    width: 1.375em; } }\n" +
//   "\n" +
//   "@keyframes animate-toast-success-long {\n" +
//   "  0% {\n" +
//   "    top: 1.625em;\n" +
//   "    right: 1.375em;\n" +
//   "    width: 0; }\n" +
//   "  65% {\n" +
//   "    top: 1.25em;\n" +
//   "    right: .9375em;\n" +
//   "    width: 0; }\n" +
//   "  84% {\n" +
//   "    top: .9375em;\n" +
//   "    right: 0;\n" +
//   "    width: 1.125em; }\n" +
//   "  100% {\n" +
//   "    top: .9375em;\n" +
//   "    right: .1875em;\n" +
//   "    width: 1.375em; } }\n" +
//   "\n" +
//   "body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) {\n" +
//   "  overflow-y: hidden; }\n" +
//   "\n" +
//   "body.swal2-height-auto {\n" +
//   "  height: auto !important; }\n" +
//   "\n" +
//   "body.swal2-no-backdrop .swal2-shown {\n" +
//   "  top: auto;\n" +
//   "  right: auto;\n" +
//   "  bottom: auto;\n" +
//   "  left: auto;\n" +
//   "  background-color: transparent; }\n" +
//   "  body.swal2-no-backdrop .swal2-shown > .swal2-modal {\n" +
//   "    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-top {\n" +
//   "    top: 0;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translateX(-50%);\n" +
//   "            transform: translateX(-50%); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-top-start, body.swal2-no-backdrop .swal2-shown.swal2-top-left {\n" +
//   "    top: 0;\n" +
//   "    left: 0; }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-top-end, body.swal2-no-backdrop .swal2-shown.swal2-top-right {\n" +
//   "    top: 0;\n" +
//   "    right: 0; }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-center {\n" +
//   "    top: 50%;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translate(-50%, -50%);\n" +
//   "            transform: translate(-50%, -50%); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-center-start, body.swal2-no-backdrop .swal2-shown.swal2-center-left {\n" +
//   "    top: 50%;\n" +
//   "    left: 0;\n" +
//   "    -webkit-transform: translateY(-50%);\n" +
//   "            transform: translateY(-50%); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-center-end, body.swal2-no-backdrop .swal2-shown.swal2-center-right {\n" +
//   "    top: 50%;\n" +
//   "    right: 0;\n" +
//   "    -webkit-transform: translateY(-50%);\n" +
//   "            transform: translateY(-50%); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-bottom {\n" +
//   "    bottom: 0;\n" +
//   "    left: 50%;\n" +
//   "    -webkit-transform: translateX(-50%);\n" +
//   "            transform: translateX(-50%); }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-bottom-start, body.swal2-no-backdrop .swal2-shown.swal2-bottom-left {\n" +
//   "    bottom: 0;\n" +
//   "    left: 0; }\n" +
//   "  body.swal2-no-backdrop .swal2-shown.swal2-bottom-end, body.swal2-no-backdrop .swal2-shown.swal2-bottom-right {\n" +
//   "    right: 0;\n" +
//   "    bottom: 0; }\n" +
//   "\n" +
//   ".swal2-container {\n" +
//   "  display: flex;\n" +
//   "  position: fixed;\n" +
//   "  top: 0;\n" +
//   "  right: 0;\n" +
//   "  bottom: 0;\n" +
//   "  left: 0;\n" +
//   "  flex-direction: row;\n" +
//   "  align-items: center;\n" +
//   "  justify-content: center;\n" +
//   "  padding: 10px;\n" +
//   "  background-color: transparent;\n" +
//   "  z-index: 1060;\n" +
//   "  overflow-x: hidden;\n" +
//   "  -webkit-overflow-scrolling: touch; }\n" +
//   "  .swal2-container.swal2-top {\n" +
//   "    align-items: flex-start; }\n" +
//   "  .swal2-container.swal2-top-start, .swal2-container.swal2-top-left {\n" +
//   "    align-items: flex-start;\n" +
//   "    justify-content: flex-start; }\n" +
//   "  .swal2-container.swal2-top-end, .swal2-container.swal2-top-right {\n" +
//   "    align-items: flex-start;\n" +
//   "    justify-content: flex-end; }\n" +
//   "  .swal2-container.swal2-center {\n" +
//   "    align-items: center; }\n" +
//   "  .swal2-container.swal2-center-start, .swal2-container.swal2-center-left {\n" +
//   "    align-items: center;\n" +
//   "    justify-content: flex-start; }\n" +
//   "  .swal2-container.swal2-center-end, .swal2-container.swal2-center-right {\n" +
//   "    align-items: center;\n" +
//   "    justify-content: flex-end; }\n" +
//   "  .swal2-container.swal2-bottom {\n" +
//   "    align-items: flex-end; }\n" +
//   "  .swal2-container.swal2-bottom-start, .swal2-container.swal2-bottom-left {\n" +
//   "    align-items: flex-end;\n" +
//   "    justify-content: flex-start; }\n" +
//   "  .swal2-container.swal2-bottom-end, .swal2-container.swal2-bottom-right {\n" +
//   "    align-items: flex-end;\n" +
//   "    justify-content: flex-end; }\n" +
//   "  .swal2-container.swal2-grow-fullscreen > .swal2-modal {\n" +
//   "    display: flex !important;\n" +
//   "    flex: 1;\n" +
//   "    align-self: stretch;\n" +
//   "    justify-content: center; }\n" +
//   "  .swal2-container.swal2-grow-row > .swal2-modal {\n" +
//   "    display: flex !important;\n" +
//   "    flex: 1;\n" +
//   "    align-content: center;\n" +
//   "    justify-content: center; }\n" +
//   "  .swal2-container.swal2-grow-column {\n" +
//   "    flex: 1;\n" +
//   "    flex-direction: column; }\n" +
//   "    .swal2-container.swal2-grow-column.swal2-top, .swal2-container.swal2-grow-column.swal2-center, .swal2-container.swal2-grow-column.swal2-bottom {\n" +
//   "      align-items: center; }\n" +
//   "    .swal2-container.swal2-grow-column.swal2-top-start, .swal2-container.swal2-grow-column.swal2-center-start, .swal2-container.swal2-grow-column.swal2-bottom-start, .swal2-container.swal2-grow-column.swal2-top-left, .swal2-container.swal2-grow-column.swal2-center-left, .swal2-container.swal2-grow-column.swal2-bottom-left {\n" +
//   "      align-items: flex-start; }\n" +
//   "    .swal2-container.swal2-grow-column.swal2-top-end, .swal2-container.swal2-grow-column.swal2-center-end, .swal2-container.swal2-grow-column.swal2-bottom-end, .swal2-container.swal2-grow-column.swal2-top-right, .swal2-container.swal2-grow-column.swal2-center-right, .swal2-container.swal2-grow-column.swal2-bottom-right {\n" +
//   "      align-items: flex-end; }\n" +
//   "    .swal2-container.swal2-grow-column > .swal2-modal {\n" +
//   "      display: flex !important;\n" +
//   "      flex: 1;\n" +
//   "      align-content: center;\n" +
//   "      justify-content: center; }\n" +
//   "  .swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right) > .swal2-modal {\n" +
//   "    margin: auto; }\n" +
//   "  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n" +
//   "    .swal2-container .swal2-modal {\n" +
//   "      margin: 0 !important; } }\n" +
//   "  .swal2-container.swal2-fade {\n" +
//   "    transition: background-color .1s; }\n" +
//   "  .swal2-container.swal2-shown {\n" +
//   "    background-color: rgba(0, 0, 0, 0.4); }\n" +
//   "\n" +
//   ".swal2-popup {\n" +
//   "  display: none;\n" +
//   "  position: relative;\n" +
//   "  flex-direction: column;\n" +
//   "  justify-content: center;\n" +
//   "  width: 32em;\n" +
//   "  max-width: 100%;\n" +
//   "  padding: 1.25em;\n" +
//   "  border-radius: 0.3125em;\n" +
//   "  background: #fff;\n" +
//   "  font-family: inherit;\n" +
//   "  font-size: 1rem;\n" +
//   "  box-sizing: border-box; }\n" +
//   "  .swal2-popup:focus {\n" +
//   "    outline: none; }\n" +
//   "  .swal2-popup.swal2-loading {\n" +
//   "    overflow-y: hidden; }\n" +
//   "  .swal2-popup .swal2-header {\n" +
//   "    display: flex;\n" +
//   "    flex-direction: column;\n" +
//   "    align-items: center; }\n" +
//   "  .swal2-popup .swal2-title {\n" +
//   "    display: block;\n" +
//   "    position: relative;\n" +
//   "    max-width: 100%;\n" +
//   "    margin: 0 0 0.4em;\n" +
//   "    padding: 0;\n" +
//   "    color: #595959;\n" +
//   "    font-size: 1.875em;\n" +
//   "    font-weight: 600;\n" +
//   "    text-align: center;\n" +
//   "    text-transform: none;\n" +
//   "    word-wrap: break-word; }\n" +
//   "  .swal2-popup .swal2-actions {\n" +
//   "    align-items: center;\n" +
//   "    justify-content: center;\n" +
//   "    margin: 1.25em auto 0; }\n" +
//   "    .swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled[disabled] {\n" +
//   "      opacity: .4; }\n" +
//   "    .swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled:hover {\n" +
//   "      background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)); }\n" +
//   "    .swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled:active {\n" +
//   "      background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)); }\n" +
//   "    .swal2-popup .swal2-actions.swal2-loading .swal2-styled.swal2-confirm {\n" +
//   "      width: 2.5em;\n" +
//   "      height: 2.5em;\n" +
//   "      margin: .46875em;\n" +
//   "      padding: 0;\n" +
//   "      border: .25em solid transparent;\n" +
//   "      border-radius: 100%;\n" +
//   "      border-color: transparent;\n" +
//   "      background-color: transparent !important;\n" +
//   "      color: transparent;\n" +
//   "      cursor: default;\n" +
//   "      box-sizing: border-box;\n" +
//   "      -webkit-animation: swal2-rotate-loading 1.5s linear 0s infinite normal;\n" +
//   "              animation: swal2-rotate-loading 1.5s linear 0s infinite normal;\n" +
//   "      -webkit-user-select: none;\n" +
//   "         -moz-user-select: none;\n" +
//   "          -ms-user-select: none;\n" +
//   "              user-select: none; }\n" +
//   "    .swal2-popup .swal2-actions.swal2-loading .swal2-styled.swal2-cancel {\n" +
//   "      margin-right: 30px;\n" +
//   "      margin-left: 30px; }\n" +
//   "    .swal2-popup .swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after {\n" +
//   "      display: inline-block;\n" +
//   "      width: 15px;\n" +
//   "      height: 15px;\n" +
//   "      margin-left: 5px;\n" +
//   "      border: 3px solid #999999;\n" +
//   "      border-radius: 50%;\n" +
//   "      border-right-color: transparent;\n" +
//   "      box-shadow: 1px 1px 1px #fff;\n" +
//   "      content: '';\n" +
//   "      -webkit-animation: swal2-rotate-loading 1.5s linear 0s infinite normal;\n" +
//   "              animation: swal2-rotate-loading 1.5s linear 0s infinite normal; }\n" +
//   "  .swal2-popup .swal2-styled {\n" +
//   "    margin: 0 .3125em;\n" +
//   "    padding: .625em 2em;\n" +
//   "    font-weight: 500;\n" +
//   "    box-shadow: none; }\n" +
//   "    .swal2-popup .swal2-styled:not([disabled]) {\n" +
//   "      cursor: pointer; }\n" +
//   "    .swal2-popup .swal2-styled.swal2-confirm {\n" +
//   "      border: 0;\n" +
//   "      border-radius: 0.25em;\n" +
//   "      background: initial;\n" +
//   "      background-color: #3085d6;\n" +
//   "      color: #fff;\n" +
//   "      font-size: 1.0625em; }\n" +
//   "    .swal2-popup .swal2-styled.swal2-cancel {\n" +
//   "      border: 0;\n" +
//   "      border-radius: 0.25em;\n" +
//   "      background: initial;\n" +
//   "      background-color: #aaa;\n" +
//   "      color: #fff;\n" +
//   "      font-size: 1.0625em; }\n" +
//   "    .swal2-popup .swal2-styled:focus {\n" +
//   "      outline: none;\n" +
//   "      box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(50, 100, 150, 0.4); }\n" +
//   "    .swal2-popup .swal2-styled::-moz-focus-inner {\n" +
//   "      border: 0; }\n" +
//   "  .swal2-popup .swal2-footer {\n" +
//   "    justify-content: center;\n" +
//   "    margin: 1.25em 0 0;\n" +
//   "    padding-top: 1em;\n" +
//   "    border-top: 1px solid #eee;\n" +
//   "    color: #545454;\n" +
//   "    font-size: 1em; }\n" +
//   "  .swal2-popup .swal2-image {\n" +
//   "    max-width: 100%;\n" +
//   "    margin: 1.25em auto; }\n" +
//   "  .swal2-popup .swal2-close {\n" +
//   "    position: absolute;\n" +
//   "    top: 0;\n" +
//   "    right: 0;\n" +
//   "    justify-content: center;\n" +
//   "    width: 1.2em;\n" +
//   "    height: 1.2em;\n" +
//   "    padding: 0;\n" +
//   "    transition: color 0.1s ease-out;\n" +
//   "    border: none;\n" +
//   "    border-radius: 0;\n" +
//   "    background: transparent;\n" +
//   "    color: #cccccc;\n" +
//   "    font-family: serif;\n" +
//   "    font-size: 2.5em;\n" +
//   "    line-height: 1.2;\n" +
//   "    cursor: pointer;\n" +
//   "    overflow: hidden; }\n" +
//   "    .swal2-popup .swal2-close:hover {\n" +
//   "      -webkit-transform: none;\n" +
//   "              transform: none;\n" +
//   "      color: #f27474; }\n" +
//   "  .swal2-popup > .swal2-input,\n" +
//   "  .swal2-popup > .swal2-file,\n" +
//   "  .swal2-popup > .swal2-textarea,\n" +
//   "  .swal2-popup > .swal2-select,\n" +
//   "  .swal2-popup > .swal2-radio,\n" +
//   "  .swal2-popup > .swal2-checkbox {\n" +
//   "    display: none; }\n" +
//   "  .swal2-popup .swal2-content {\n" +
//   "    justify-content: center;\n" +
//   "    margin: 0;\n" +
//   "    padding: 0;\n" +
//   "    color: #545454;\n" +
//   "    font-size: 1.125em;\n" +
//   "    font-weight: 300;\n" +
//   "    line-height: normal;\n" +
//   "    word-wrap: break-word; }\n" +
//   "  .swal2-popup #swal2-content {\n" +
//   "    text-align: center; }\n" +
//   "  .swal2-popup .swal2-input,\n" +
//   "  .swal2-popup .swal2-file,\n" +
//   "  .swal2-popup .swal2-textarea,\n" +
//   "  .swal2-popup .swal2-select,\n" +
//   "  .swal2-popup .swal2-radio,\n" +
//   "  .swal2-popup .swal2-checkbox {\n" +
//   "    margin: 1em auto; }\n" +
//   "  .swal2-popup .swal2-input,\n" +
//   "  .swal2-popup .swal2-file,\n" +
//   "  .swal2-popup .swal2-textarea {\n" +
//   "    width: 100%;\n" +
//   "    transition: border-color .3s, box-shadow .3s;\n" +
//   "    border: 1px solid #d9d9d9;\n" +
//   "    border-radius: 0.1875em;\n" +
//   "    font-size: 1.125em;\n" +
//   "    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06);\n" +
//   "    box-sizing: border-box; }\n" +
//   "    .swal2-popup .swal2-input.swal2-inputerror,\n" +
//   "    .swal2-popup .swal2-file.swal2-inputerror,\n" +
//   "    .swal2-popup .swal2-textarea.swal2-inputerror {\n" +
//   "      border-color: #f27474 !important;\n" +
//   "      box-shadow: 0 0 2px #f27474 !important; }\n" +
//   "    .swal2-popup .swal2-input:focus,\n" +
//   "    .swal2-popup .swal2-file:focus,\n" +
//   "    .swal2-popup .swal2-textarea:focus {\n" +
//   "      border: 1px solid #b4dbed;\n" +
//   "      outline: none;\n" +
//   "      box-shadow: 0 0 3px #c4e6f5; }\n" +
//   "    .swal2-popup .swal2-input::-webkit-input-placeholder,\n" +
//   "    .swal2-popup .swal2-file::-webkit-input-placeholder,\n" +
//   "    .swal2-popup .swal2-textarea::-webkit-input-placeholder {\n" +
//   "      color: #cccccc; }\n" +
//   "    .swal2-popup .swal2-input:-ms-input-placeholder,\n" +
//   "    .swal2-popup .swal2-file:-ms-input-placeholder,\n" +
//   "    .swal2-popup .swal2-textarea:-ms-input-placeholder {\n" +
//   "      color: #cccccc; }\n" +
//   "    .swal2-popup .swal2-input::-ms-input-placeholder,\n" +
//   "    .swal2-popup .swal2-file::-ms-input-placeholder,\n" +
//   "    .swal2-popup .swal2-textarea::-ms-input-placeholder {\n" +
//   "      color: #cccccc; }\n" +
//   "    .swal2-popup .swal2-input::placeholder,\n" +
//   "    .swal2-popup .swal2-file::placeholder,\n" +
//   "    .swal2-popup .swal2-textarea::placeholder {\n" +
//   "      color: #cccccc; }\n" +
//   "  .swal2-popup .swal2-range input {\n" +
//   "    width: 80%; }\n" +
//   "  .swal2-popup .swal2-range output {\n" +
//   "    width: 20%;\n" +
//   "    font-weight: 600;\n" +
//   "    text-align: center; }\n" +
//   "  .swal2-popup .swal2-range input,\n" +
//   "  .swal2-popup .swal2-range output {\n" +
//   "    height: 2.625em;\n" +
//   "    margin: 1em auto;\n" +
//   "    padding: 0;\n" +
//   "    font-size: 1.125em;\n" +
//   "    line-height: 2.625em; }\n" +
//   "  .swal2-popup .swal2-input {\n" +
//   "    height: 2.625em;\n" +
//   "    padding: 0.75em; }\n" +
//   "    .swal2-popup .swal2-input[type='number'] {\n" +
//   "      max-width: 10em; }\n" +
//   "  .swal2-popup .swal2-file {\n" +
//   "    font-size: 1.125em; }\n" +
//   "  .swal2-popup .swal2-textarea {\n" +
//   "    height: 6.75em;\n" +
//   "    padding: 0.75em; }\n" +
//   "  .swal2-popup .swal2-select {\n" +
//   "    min-width: 50%;\n" +
//   "    max-width: 100%;\n" +
//   "    padding: .375em .625em;\n" +
//   "    color: #545454;\n" +
//   "    font-size: 1.125em; }\n" +
//   "  .swal2-popup .swal2-radio,\n" +
//   "  .swal2-popup .swal2-checkbox {\n" +
//   "    align-items: center;\n" +
//   "    justify-content: center; }\n" +
//   "    .swal2-popup .swal2-radio label,\n" +
//   "    .swal2-popup .swal2-checkbox label {\n" +
//   "      margin: 0 .6em;\n" +
//   "      font-size: 1.125em; }\n" +
//   "    .swal2-popup .swal2-radio input,\n" +
//   "    .swal2-popup .swal2-checkbox input {\n" +
//   "      margin: 0 .4em; }\n" +
//   "  .swal2-popup .swal2-validationerror {\n" +
//   "    display: none;\n" +
//   "    align-items: center;\n" +
//   "    justify-content: center;\n" +
//   "    padding: 0.625em;\n" +
//   "    background: #f0f0f0;\n" +
//   "    color: #666666;\n" +
//   "    font-size: 1em;\n" +
//   "    font-weight: 300;\n" +
//   "    overflow: hidden; }\n" +
//   "    .swal2-popup .swal2-validationerror::before {\n" +
//   "      display: inline-block;\n" +
//   "      width: 1.5em;\n" +
//   "      min-width: 1.5em;\n" +
//   "      height: 1.5em;\n" +
//   "      margin: 0 .625em;\n" +
//   "      border-radius: 50%;\n" +
//   "      background-color: #f27474;\n" +
//   "      color: #fff;\n" +
//   "      font-weight: 600;\n" +
//   "      line-height: 1.5em;\n" +
//   "      text-align: center;\n" +
//   "      content: '!';\n" +
//   "      zoom: normal; }\n" +
//   "\n" +
//   "@supports (-ms-accelerator: true) {\n" +
//   "  .swal2-range input {\n" +
//   "    width: 100% !important; }\n" +
//   "  .swal2-range output {\n" +
//   "    display: none; } }\n" +
//   "\n" +
//   "@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n" +
//   "  .swal2-range input {\n" +
//   "    width: 100% !important; }\n" +
//   "  .swal2-range output {\n" +
//   "    display: none; } }\n" +
//   "\n" +
//   "@-moz-document url-prefix() {\n" +
//   "  .swal2-close:focus {\n" +
//   "    outline: 2px solid rgba(50, 100, 150, 0.4); } }\n" +
//   "\n" +
//   ".swal2-icon {\n" +
//   "  position: relative;\n" +
//   "  justify-content: center;\n" +
//   "  width: 5em;\n" +
//   "  height: 5em;\n" +
//   "  margin: 1.25em auto 1.875em;\n" +
//   "  border: .25em solid transparent;\n" +
//   "  border-radius: 50%;\n" +
//   "  line-height: 5em;\n" +
//   "  cursor: default;\n" +
//   "  box-sizing: content-box;\n" +
//   "  -webkit-user-select: none;\n" +
//   "     -moz-user-select: none;\n" +
//   "      -ms-user-select: none;\n" +
//   "          user-select: none;\n" +
//   "  zoom: normal; }\n" +
//   "  .swal2-icon-text {\n" +
//   "    font-size: 3.75em; }\n" +
//   "  .swal2-icon.swal2-error {\n" +
//   "    border-color: #f27474; }\n" +
//   "    .swal2-icon.swal2-error .swal2-x-mark {\n" +
//   "      position: relative;\n" +
//   "      flex-grow: 1; }\n" +
//   "    .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {\n" +
//   "      display: block;\n" +
//   "      position: absolute;\n" +
//   "      top: 2.3125em;\n" +
//   "      width: 2.9375em;\n" +
//   "      height: .3125em;\n" +
//   "      border-radius: .125em;\n" +
//   "      background-color: #f27474; }\n" +
//   "      .swal2-icon.swal2-error [class^='swal2-x-mark-line'][class$='left'] {\n" +
//   "        left: 1.0625em;\n" +
//   "        -webkit-transform: rotate(45deg);\n" +
//   "                transform: rotate(45deg); }\n" +
//   "      .swal2-icon.swal2-error [class^='swal2-x-mark-line'][class$='right'] {\n" +
//   "        right: 1em;\n" +
//   "        -webkit-transform: rotate(-45deg);\n" +
//   "                transform: rotate(-45deg); }\n" +
//   "  .swal2-icon.swal2-warning {\n" +
//   "    border-color: #facea8;\n" +
//   "    color: #f8bb86; }\n" +
//   "  .swal2-icon.swal2-info {\n" +
//   "    border-color: #9de0f6;\n" +
//   "    color: #3fc3ee; }\n" +
//   "  .swal2-icon.swal2-question {\n" +
//   "    border-color: #c9dae1;\n" +
//   "    color: #87adbd; }\n" +
//   "  .swal2-icon.swal2-success {\n" +
//   "    border-color: #a5dc86; }\n" +
//   "    .swal2-icon.swal2-success [class^='swal2-success-circular-line'] {\n" +
//   "      position: absolute;\n" +
//   "      width: 3.75em;\n" +
//   "      height: 7.5em;\n" +
//   "      -webkit-transform: rotate(45deg);\n" +
//   "              transform: rotate(45deg);\n" +
//   "      border-radius: 50%; }\n" +
//   "      .swal2-icon.swal2-success [class^='swal2-success-circular-line'][class$='left'] {\n" +
//   "        top: -.4375em;\n" +
//   "        left: -2.0635em;\n" +
//   "        -webkit-transform: rotate(-45deg);\n" +
//   "                transform: rotate(-45deg);\n" +
//   "        -webkit-transform-origin: 3.75em 3.75em;\n" +
//   "                transform-origin: 3.75em 3.75em;\n" +
//   "        border-radius: 7.5em 0 0 7.5em; }\n" +
//   "      .swal2-icon.swal2-success [class^='swal2-success-circular-line'][class$='right'] {\n" +
//   "        top: -.6875em;\n" +
//   "        left: 1.875em;\n" +
//   "        -webkit-transform: rotate(-45deg);\n" +
//   "                transform: rotate(-45deg);\n" +
//   "        -webkit-transform-origin: 0 3.75em;\n" +
//   "                transform-origin: 0 3.75em;\n" +
//   "        border-radius: 0 7.5em 7.5em 0; }\n" +
//   "    .swal2-icon.swal2-success .swal2-success-ring {\n" +
//   "      position: absolute;\n" +
//   "      top: -.25em;\n" +
//   "      left: -.25em;\n" +
//   "      width: 100%;\n" +
//   "      height: 100%;\n" +
//   "      border: 0.25em solid rgba(165, 220, 134, 0.3);\n" +
//   "      border-radius: 50%;\n" +
//   "      z-index: 2;\n" +
//   "      box-sizing: content-box; }\n" +
//   "    .swal2-icon.swal2-success .swal2-success-fix {\n" +
//   "      position: absolute;\n" +
//   "      top: .5em;\n" +
//   "      left: 1.625em;\n" +
//   "      width: .4375em;\n" +
//   "      height: 5.625em;\n" +
//   "      -webkit-transform: rotate(-45deg);\n" +
//   "              transform: rotate(-45deg);\n" +
//   "      z-index: 1; }\n" +
//   "    .swal2-icon.swal2-success [class^='swal2-success-line'] {\n" +
//   "      display: block;\n" +
//   "      position: absolute;\n" +
//   "      height: .3125em;\n" +
//   "      border-radius: .125em;\n" +
//   "      background-color: #a5dc86;\n" +
//   "      z-index: 2; }\n" +
//   "      .swal2-icon.swal2-success [class^='swal2-success-line'][class$='tip'] {\n" +
//   "        top: 2.875em;\n" +
//   "        left: .875em;\n" +
//   "        width: 1.5625em;\n" +
//   "        -webkit-transform: rotate(45deg);\n" +
//   "                transform: rotate(45deg); }\n" +
//   "      .swal2-icon.swal2-success [class^='swal2-success-line'][class$='long'] {\n" +
//   "        top: 2.375em;\n" +
//   "        right: .5em;\n" +
//   "        width: 2.9375em;\n" +
//   "        -webkit-transform: rotate(-45deg);\n" +
//   "                transform: rotate(-45deg); }\n" +
//   "\n" +
//   ".swal2-progresssteps {\n" +
//   "  align-items: center;\n" +
//   "  margin: 0 0 1.25em;\n" +
//   "  padding: 0;\n" +
//   "  font-weight: 600; }\n" +
//   "  .swal2-progresssteps li {\n" +
//   "    display: inline-block;\n" +
//   "    position: relative; }\n" +
//   "  .swal2-progresssteps .swal2-progresscircle {\n" +
//   "    width: 2em;\n" +
//   "    height: 2em;\n" +
//   "    border-radius: 2em;\n" +
//   "    background: #3085d6;\n" +
//   "    color: #fff;\n" +
//   "    line-height: 2em;\n" +
//   "    text-align: center;\n" +
//   "    z-index: 20; }\n" +
//   "    .swal2-progresssteps .swal2-progresscircle:first-child {\n" +
//   "      margin-left: 0; }\n" +
//   "    .swal2-progresssteps .swal2-progresscircle:last-child {\n" +
//   "      margin-right: 0; }\n" +
//   "    .swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep {\n" +
//   "      background: #3085d6; }\n" +
//   "      .swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep ~ .swal2-progresscircle {\n" +
//   "        background: #add8e6; }\n" +
//   "      .swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep ~ .swal2-progressline {\n" +
//   "        background: #add8e6; }\n" +
//   "  .swal2-progresssteps .swal2-progressline {\n" +
//   "    width: 2.5em;\n" +
//   "    height: .4em;\n" +
//   "    margin: 0 -1px;\n" +
//   "    background: #3085d6;\n" +
//   "    z-index: 10; }\n" +
//   "\n" +
//   "[class^='swal2'] {\n" +
//   "  -webkit-tap-highlight-color: transparent; }\n" +
//   "\n" +
//   ".swal2-show {\n" +
//   "  -webkit-animation: swal2-show 0.3s;\n" +
//   "          animation: swal2-show 0.3s; }\n" +
//   "  .swal2-show.swal2-noanimation {\n" +
//   "    -webkit-animation: none;\n" +
//   "            animation: none; }\n" +
//   "\n" +
//   ".swal2-hide {\n" +
//   "  -webkit-animation: swal2-hide 0.15s forwards;\n" +
//   "          animation: swal2-hide 0.15s forwards; }\n" +
//   "  .swal2-hide.swal2-noanimation {\n" +
//   "    -webkit-animation: none;\n" +
//   "            animation: none; }\n" +
//   "\n" +
//   "[dir='rtl'] .swal2-close {\n" +
//   "  right: auto;\n" +
//   "  left: 0; }\n" +
//   "\n" +
//   ".swal2-animate-success-icon .swal2-success-line-tip {\n" +
//   "  -webkit-animation: swal2-animate-success-line-tip 0.75s;\n" +
//   "          animation: swal2-animate-success-line-tip 0.75s; }\n" +
//   "\n" +
//   ".swal2-animate-success-icon .swal2-success-line-long {\n" +
//   "  -webkit-animation: swal2-animate-success-line-long 0.75s;\n" +
//   "          animation: swal2-animate-success-line-long 0.75s; }\n" +
//   "\n" +
//   ".swal2-animate-success-icon .swal2-success-circular-line-right {\n" +
//   "  -webkit-animation: swal2-rotate-success-circular-line 4.25s ease-in;\n" +
//   "          animation: swal2-rotate-success-circular-line 4.25s ease-in; }\n" +
//   "\n" +
//   ".swal2-animate-error-icon {\n" +
//   "  -webkit-animation: swal2-animate-error-icon 0.5s;\n" +
//   "          animation: swal2-animate-error-icon 0.5s; }\n" +
//   "  .swal2-animate-error-icon .swal2-x-mark {\n" +
//   "    -webkit-animation: swal2-animate-error-x-mark 0.5s;\n" +
//   "            animation: swal2-animate-error-x-mark 0.5s; }\n" +
//   "\n" +
//   "@-webkit-keyframes swal2-rotate-loading {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotate(0deg);\n" +
//   "            transform: rotate(0deg); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotate(360deg);\n" +
//   "            transform: rotate(360deg); } }\n" +
//   "\n" +
//   "@keyframes swal2-rotate-loading {\n" +
//   "  0% {\n" +
//   "    -webkit-transform: rotate(0deg);\n" +
//   "            transform: rotate(0deg); }\n" +
//   "  100% {\n" +
//   "    -webkit-transform: rotate(360deg);\n" +
//   "            transform: rotate(360deg); } }");

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Sweetalert2=e()}(this,function(){"use strict";function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function r(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t,e,n){return(c=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct:function(t,e,n){var o=[null];o.push.apply(o,e);var i=new(Function.bind.apply(t,o));return n&&u(i,n.prototype),i}).apply(null,arguments)}function l(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function d(t,e,n){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var o=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=s(t)););return t}(t,e);if(o){var i=Object.getOwnPropertyDescriptor(o,e);return i.get?i.get.call(n):i.value}})(t,e,n||t)}function p(e){return Object.keys(e).map(function(t){return e[t]})}function m(t){return Array.prototype.slice.call(t)}function g(t){console.error("".concat(e," ").concat(t))}function h(t,e){!function(t){-1===n.indexOf(t)&&(n.push(t),y(t))}('"'.concat(t,'" is deprecated and will be removed in the next major release. Please use "').concat(e,'" instead.'))}function v(t){return t&&Promise.resolve(t)===t}function t(t){var e={};for(var n in t)e[t[n]]="swal2-"+t[n];return e}function b(e,t,n){m(e.classList).forEach(function(t){-1===p(k).indexOf(t)&&-1===p(B).indexOf(t)&&e.classList.remove(t)}),t&&t[n]&&nt(e,t[n])}var e="SweetAlert2:",y=function(t){console.warn("".concat(e," ").concat(t))},n=[],w=function(t){return"function"==typeof t?t():t},C=Object.freeze({cancel:"cancel",backdrop:"backdrop",close:"close",esc:"esc",timer:"timer"}),k=t(["container","shown","height-auto","iosfix","popup","modal","no-backdrop","toast","toast-shown","toast-column","fade","show","hide","noanimation","close","title","header","content","actions","confirm","cancel","footer","icon","image","input","file","range","select","radio","checkbox","label","textarea","inputerror","validation-message","progress-steps","active-progress-step","progress-step","progress-step-line","loading","styled","top","top-start","top-end","top-left","top-right","center","center-start","center-end","center-left","center-right","bottom","bottom-start","bottom-end","bottom-left","bottom-right","grow-row","grow-column","grow-fullscreen","rtl"]),B=t(["success","warning","info","question","error"]),x={previousBodyPadding:null},S=function(t,e){return t.classList.contains(e)};function P(t,e){if(!e)return null;switch(e){case"select":case"textarea":case"file":return it(t,k[e]);case"checkbox":return t.querySelector(".".concat(k.checkbox," input"));case"radio":return t.querySelector(".".concat(k.radio," input:checked"))||t.querySelector(".".concat(k.radio," input:first-child"));case"range":return t.querySelector(".".concat(k.range," input"));default:return it(t,k.input)}}function A(t){if(t.focus(),"file"!==t.type){var e=t.value;t.value="",t.value=e}}function L(t,e,n){t&&e&&("string"==typeof e&&(e=e.split(/\s+/).filter(Boolean)),e.forEach(function(e){t.forEach?t.forEach(function(t){n?t.classList.add(e):t.classList.remove(e)}):n?t.classList.add(e):t.classList.remove(e)}))}function E(t,e,n){n||0===parseInt(n)?t.style[e]="number"==typeof n?n+"px":n:t.style.removeProperty(e)}function O(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"flex";t.style.opacity="",t.style.display=e}function T(t){t.style.opacity="",t.style.display="none"}function M(t,e,n){e?O(t,n):T(t)}function V(t){return!(!t||!(t.offsetWidth||t.offsetHeight||t.getClientRects().length))}function j(t){var e=window.getComputedStyle(t),n=parseFloat(e.getPropertyValue("animation-duration")||"0"),o=parseFloat(e.getPropertyValue("transition-duration")||"0");return 0<n||0<o}function q(){return document.body.querySelector("."+k.container)}function H(t){var e=q();return e?e.querySelector(t):null}function I(t){return H("."+t)}function R(){var t=rt();return m(t.querySelectorAll("."+k.icon))}function D(){var t=R().filter(function(t){return V(t)});return t.length?t[0]:null}function N(){return I(k.title)}function U(){return I(k.content)}function _(){return I(k.image)}function z(){return I(k["progress-steps"])}function W(){return I(k["validation-message"])}function K(){return H("."+k.actions+" ."+k.confirm)}function F(){return H("."+k.actions+" ."+k.cancel)}function Z(){return I(k.actions)}function Q(){return I(k.header)}function Y(){return I(k.footer)}function $(){return I(k.close)}function J(){var t=m(rt().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort(function(t,e){return t=parseInt(t.getAttribute("tabindex")),(e=parseInt(e.getAttribute("tabindex")))<t?1:t<e?-1:0}),e=m(rt().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]')).filter(function(t){return"-1"!==t.getAttribute("tabindex")});return function(t){for(var e=[],n=0;n<t.length;n++)-1===e.indexOf(t[n])&&e.push(t[n]);return e}(t.concat(e)).filter(function(t){return V(t)})}function X(){return"undefined"==typeof window||"undefined"==typeof document}function G(t){ce.isVisible()&&et!==t.target.value&&ce.resetValidationMessage(),et=t.target.value}function tt(t,e){t instanceof HTMLElement?e.appendChild(t):"object"===f(t)?lt(e,t):t&&(e.innerHTML=t)}var et,nt=function(t,e){L(t,e,!0)},ot=function(t,e){L(t,e,!1)},it=function(t,e){for(var n=0;n<t.childNodes.length;n++)if(S(t.childNodes[n],e))return t.childNodes[n]},rt=function(){return I(k.popup)},at=function(){return!st()&&!document.body.classList.contains(k["no-backdrop"])},st=function(){return document.body.classList.contains(k["toast-shown"])},ut='\n <div aria-labelledby="'.concat(k.title,'" aria-describedby="').concat(k.content,'" class="').concat(k.popup,'" tabindex="-1">\n   <div class="').concat(k.header,'">\n     <ul class="').concat(k["progress-steps"],'"></ul>\n     <div class="').concat(k.icon," ").concat(B.error,'">\n       <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n     </div>\n     <div class="').concat(k.icon," ").concat(B.question,'"></div>\n     <div class="').concat(k.icon," ").concat(B.warning,'"></div>\n     <div class="').concat(k.icon," ").concat(B.info,'"></div>\n     <div class="').concat(k.icon," ").concat(B.success,'">\n       <div class="swal2-success-circular-line-left"></div>\n       <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n       <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n       <div class="swal2-success-circular-line-right"></div>\n     </div>\n     <img class="').concat(k.image,'" />\n     <h2 class="').concat(k.title,'" id="').concat(k.title,'"></h2>\n     <button type="button" class="').concat(k.close,'">&times;</button>\n   </div>\n   <div class="').concat(k.content,'">\n     <div id="').concat(k.content,'"></div>\n     <input class="').concat(k.input,'" />\n     <input type="file" class="').concat(k.file,'" />\n     <div class="').concat(k.range,'">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="').concat(k.select,'"></select>\n     <div class="').concat(k.radio,'"></div>\n     <label for="').concat(k.checkbox,'" class="').concat(k.checkbox,'">\n       <input type="checkbox" />\n       <span class="').concat(k.label,'"></span>\n     </label>\n     <textarea class="').concat(k.textarea,'"></textarea>\n     <div class="').concat(k["validation-message"],'" id="').concat(k["validation-message"],'"></div>\n   </div>\n   <div class="').concat(k.actions,'">\n     <button type="button" class="').concat(k.confirm,'">OK</button>\n     <button type="button" class="').concat(k.cancel,'">Cancel</button>\n   </div>\n   <div class="').concat(k.footer,'">\n   </div>\n </div>\n').replace(/(^|\n)\s*/g,""),ct=function(t){if(function(){var t=q();t&&(t.parentNode.removeChild(t),ot([document.documentElement,document.body],[k["no-backdrop"],k["toast-shown"],k["has-column"]]))}(),X())g("SweetAlert2 requires document to initialize");else{var e=document.createElement("div");e.className=k.container,e.innerHTML=ut;var n=function(t){return"string"==typeof t?document.querySelector(t):t}(t.target);n.appendChild(e),function(t){var e=rt();e.setAttribute("role",t.toast?"alert":"dialog"),e.setAttribute("aria-live",t.toast?"polite":"assertive"),t.toast||e.setAttribute("aria-modal","true")}(t),function(t){"rtl"===window.getComputedStyle(t).direction&&nt(q(),k.rtl)}(n),function(){var t=U(),e=it(t,k.input),n=it(t,k.file),o=t.querySelector(".".concat(k.range," input")),i=t.querySelector(".".concat(k.range," output")),r=it(t,k.select),a=t.querySelector(".".concat(k.checkbox," input")),s=it(t,k.textarea);e.oninput=G,n.onchange=G,r.onchange=G,a.onchange=G,s.oninput=G,o.oninput=function(t){G(t),i.value=o.value},o.onchange=function(t){G(t),o.nextSibling.value=o.value}}()}},lt=function(t,e){if(t.innerHTML="",0 in e)for(var n=0;n in e;n++)t.appendChild(e[n].cloneNode(!0));else t.appendChild(e.cloneNode(!0))},dt=function(){if(X())return!1;var t=document.createElement("div"),e={WebkitAnimation:"webkitAnimationEnd",OAnimation:"oAnimationEnd oanimationend",animation:"animationend"};for(var n in e)if(e.hasOwnProperty(n)&&void 0!==t.style[n])return e[n];return!1}();function pt(t,e,n){M(t,n["showC"+e.substring(1)+"Button"],"inline-block"),t.innerHTML=n[e+"ButtonText"],t.setAttribute("aria-label",n[e+"ButtonAriaLabel"]),t.className=k[e],b(t,n.customClass,e+"Button"),nt(t,n[e+"ButtonClass"])}function ft(t,e){var n=Z(),o=K(),i=F();e.showConfirmButton||e.showCancelButton?O(n):T(n),b(n,e.customClass,"actions"),pt(o,"confirm",e),pt(i,"cancel",e),e.buttonsStyling?function(t,e,n){nt([t,e],k.styled),n.confirmButtonColor&&(t.style.backgroundColor=n.confirmButtonColor),n.cancelButtonColor&&(e.style.backgroundColor=n.cancelButtonColor);var o=window.getComputedStyle(t).getPropertyValue("background-color");t.style.borderLeftColor=o,t.style.borderRightColor=o}(o,i,e):(ot([o,i],k.styled),o.style.backgroundColor=o.style.borderLeftColor=o.style.borderRightColor="",i.style.backgroundColor=i.style.borderLeftColor=i.style.borderRightColor="")}function mt(t,e){var n=q();n&&(function(t,e){"string"==typeof e?t.style.background=e:e||nt([document.documentElement,document.body],k["no-backdrop"])}(n,e.backdrop),!e.backdrop&&e.allowOutsideClick&&y('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),function(t,e){e in k?nt(t,k[e]):(y('The "position" parameter is not valid, defaulting to "center"'),nt(t,k.center))}(n,e.position),function(t,e){if(e&&"string"==typeof e){var n="grow-"+e;n in k&&nt(t,k[n])}}(n,e.grow),b(n,e.customClass,"container"),e.customContainerClass&&nt(n,e.customContainerClass))}function gt(t,e){t.placeholder&&!e.inputPlaceholder||(t.placeholder=e.inputPlaceholder)}var ht={promise:new WeakMap,innerParams:new WeakMap,domCache:new WeakMap},vt=function(t,e){var n=P(U(),t);if(n)for(var o in function(t){for(var e=0;e<t.attributes.length;e++){var n=t.attributes[e].name;-1===["type","value","style"].indexOf(n)&&t.removeAttribute(n)}}(n),e)"range"===t&&"placeholder"===o||n.setAttribute(o,e[o])},bt=function(t,e,n){t.className=e,n.inputClass&&nt(t,n.inputClass),n.customClass&&nt(t,n.customClass.input)},yt={};yt.text=yt.email=yt.password=yt.number=yt.tel=yt.url=function(t){var e=it(U(),k.input);return"string"==typeof t.inputValue||"number"==typeof t.inputValue?e.value=t.inputValue:v(t.inputValue)||y('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(f(t.inputValue),'"')),gt(e,t),e.type=t.input,e},yt.file=function(t){var e=it(U(),k.file);return gt(e,t),e.type=t.input,e},yt.range=function(t){var e=it(U(),k.range),n=e.querySelector("input"),o=e.querySelector("output");return n.value=t.inputValue,n.type=t.input,o.value=t.inputValue,e},yt.select=function(t){var e=it(U(),k.select);if(e.innerHTML="",t.inputPlaceholder){var n=document.createElement("option");n.innerHTML=t.inputPlaceholder,n.value="",n.disabled=!0,n.selected=!0,e.appendChild(n)}return e},yt.radio=function(){var t=it(U(),k.radio);return t.innerHTML="",t},yt.checkbox=function(t){var e=it(U(),k.checkbox),n=P(U(),"checkbox");return n.type="checkbox",n.value=1,n.id=k.checkbox,n.checked=Boolean(t.inputValue),e.querySelector("span").innerHTML=t.inputPlaceholder,e},yt.textarea=function(t){var e=it(U(),k.textarea);return e.value=t.inputValue,gt(e,t),e};function wt(t,e){var n=U().querySelector("#"+k.content);e.html?(tt(e.html,n),O(n,"block")):e.text?(n.textContent=e.text,O(n,"block")):T(n),function(t,e){for(var n=ht.innerParams.get(t),o=!n||e.input!==n.input,i=U(),r=["input","file","range","select","radio","checkbox","textarea"],a=0;a<r.length;a++){var s=k[r[a]],u=it(i,s);vt(r[a],e.inputAttributes),bt(u,s,e),o&&T(u)}if(e.input){if(!yt[e.input])return g('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(e.input,'"'));if(o){var c=yt[e.input](e);O(c)}}}(t,e),b(U(),e.customClass,"content")}function Ct(t,i){var r=z();if(!i.progressSteps||0===i.progressSteps.length)return T(r);O(r),r.innerHTML="";var a=parseInt(null===i.currentProgressStep?ce.getQueueStep():i.currentProgressStep);a>=i.progressSteps.length&&y("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),i.progressSteps.forEach(function(t,e){var n=function(t){var e=document.createElement("li");return nt(e,k["progress-step"]),e.innerHTML=t,e}(t);if(r.appendChild(n),e===a&&nt(n,k["active-progress-step"]),e!==i.progressSteps.length-1){var o=function(t){var e=document.createElement("li");return nt(e,k["progress-step-line"]),t.progressStepsDistance&&(e.style.width=t.progressStepsDistance),e}(t);r.appendChild(o)}})}function kt(t,e){var n=Q();b(n,e.customClass,"header"),Ct(0,e),function(t,e){var n=ht.innerParams.get(t);if(n&&e.type===n.type&&D())b(D(),e.customClass,"icon");else if(xt(),e.type)if(St(),-1!==Object.keys(B).indexOf(e.type)){var o=H(".".concat(k.icon,".").concat(B[e.type]));O(o),b(o,e.customClass,"icon"),L(o,"swal2-animate-".concat(e.type,"-icon"),e.animation)}else g('Unknown type! Expected "success", "error", "warning", "info" or "question", got "'.concat(e.type,'"'))}(t,e),function(t,e){var n=_();if(!e.imageUrl)return T(n);O(n),n.setAttribute("src",e.imageUrl),n.setAttribute("alt",e.imageAlt),E(n,"width",e.imageWidth),E(n,"height",e.imageHeight),n.className=k.image,b(n,e.customClass,"image"),e.imageClass&&nt(n,e.imageClass)}(0,e),function(t,e){var n=N();M(n,e.title||e.titleText),e.title&&tt(e.title,n),e.titleText&&(n.innerText=e.titleText),b(n,e.customClass,"title")}(0,e),function(t,e){var n=$();b(n,e.customClass,"closeButton"),M(n,e.showCloseButton),n.setAttribute("aria-label",e.closeButtonAriaLabel)}(0,e)}function Bt(t,e){!function(t,e){var n=rt();E(n,"width",e.width),E(n,"padding",e.padding),e.background&&(n.style.background=e.background),n.className=k.popup,e.toast?(nt([document.documentElement,document.body],k["toast-shown"]),nt(n,k.toast)):nt(n,k.modal),b(n,e.customClass,"popup"),"string"==typeof e.customClass&&nt(n,e.customClass),L(n,k.noanimation,!e.animation)}(0,e),mt(0,e),kt(t,e),wt(t,e),ft(0,e),function(t,e){var n=Y();M(n,e.footer),e.footer&&tt(e.footer,n),b(n,e.customClass,"footer")}(0,e)}var xt=function(){for(var t=R(),e=0;e<t.length;e++)T(t[e])},St=function(){for(var t=rt(),e=window.getComputedStyle(t).getPropertyValue("background-color"),n=t.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"),o=0;o<n.length;o++)n[o].style.backgroundColor=e};function Pt(){var t=rt();t||ce.fire(""),t=rt();var e=Z(),n=K(),o=F();O(e),O(n),nt([t,e],k.loading),n.disabled=!0,o.disabled=!0,t.setAttribute("data-loading",!0),t.setAttribute("aria-busy",!0),t.focus()}function At(t){return Mt.hasOwnProperty(t)}function Lt(t){return jt[t]}var Et=[],Ot={},Tt=function(){return new Promise(function(t){var e=window.scrollX,n=window.scrollY;Ot.restoreFocusTimeout=setTimeout(function(){Ot.previousActiveElement&&Ot.previousActiveElement.focus?(Ot.previousActiveElement.focus(),Ot.previousActiveElement=null):document.body&&document.body.focus(),t()},100),void 0!==e&&void 0!==n&&window.scrollTo(e,n)})},Mt={title:"",titleText:"",text:"",html:"",footer:"",type:null,toast:!1,customClass:"",customContainerClass:"",target:"body",backdrop:!0,animation:!0,heightAuto:!0,allowOutsideClick:!0,allowEscapeKey:!0,allowEnterKey:!0,stopKeydownPropagation:!0,keydownListenerCapture:!1,showConfirmButton:!0,showCancelButton:!1,preConfirm:null,confirmButtonText:"OK",confirmButtonAriaLabel:"",confirmButtonColor:null,confirmButtonClass:"",cancelButtonText:"Cancel",cancelButtonAriaLabel:"",cancelButtonColor:null,cancelButtonClass:"",buttonsStyling:!0,reverseButtons:!1,focusConfirm:!0,focusCancel:!1,showCloseButton:!1,closeButtonAriaLabel:"Close this dialog",showLoaderOnConfirm:!1,imageUrl:null,imageWidth:null,imageHeight:null,imageAlt:"",imageClass:"",timer:null,width:null,padding:null,background:null,input:null,inputPlaceholder:"",inputValue:"",inputOptions:{},inputAutoTrim:!0,inputClass:"",inputAttributes:{},inputValidator:null,validationMessage:null,grow:!1,position:"center",progressSteps:[],currentProgressStep:null,progressStepsDistance:null,onBeforeOpen:null,onAfterClose:null,onOpen:null,onClose:null,scrollbarPadding:!0},Vt=["title","titleText","text","html","type","customClass","showConfirmButton","showCancelButton","confirmButtonText","confirmButtonAriaLabel","confirmButtonColor","confirmButtonClass","cancelButtonText","cancelButtonAriaLabel","cancelButtonColor","cancelButtonClass","buttonsStyling","reverseButtons","imageUrl","imageWidth","imageHeigth","imageAlt","imageClass","progressSteps","currentProgressStep"],jt={customContainerClass:"customClass",confirmButtonClass:"customClass",cancelButtonClass:"customClass",imageClass:"customClass",inputClass:"customClass"},qt=["allowOutsideClick","allowEnterKey","backdrop","focusConfirm","focusCancel","heightAuto","keydownListenerCapture"],Ht=Object.freeze({isValidParameter:At,isUpdatableParameter:function(t){return-1!==Vt.indexOf(t)},isDeprecatedParameter:Lt,argsToParams:function(n){var o={};switch(f(n[0])){case"object":a(o,n[0]);break;default:["title","html","type"].forEach(function(t,e){switch(f(n[e])){case"string":o[t]=n[e];break;case"undefined":break;default:g("Unexpected type of ".concat(t,'! Expected "string", got ').concat(f(n[e])))}})}return o},isVisible:function(){return V(rt())},clickConfirm:function(){return K()&&K().click()},clickCancel:function(){return F()&&F().click()},getContainer:q,getPopup:rt,getTitle:N,getContent:U,getImage:_,getIcon:D,getIcons:R,getCloseButton:$,getActions:Z,getConfirmButton:K,getCancelButton:F,getHeader:Q,getFooter:Y,getFocusableElements:J,getValidationMessage:W,isLoading:function(){return rt().hasAttribute("data-loading")},fire:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return c(this,e)},mixin:function(n){return function(t){function e(){return o(this,e),l(this,s(e).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,t),r(e,[{key:"_main",value:function(t){return d(s(e.prototype),"_main",this).call(this,a({},n,t))}}]),e}(this)},queue:function(t){var r=this;Et=t;function a(t,e){Et=[],document.body.removeAttribute("data-swal2-queue-step"),t(e)}var s=[];return new Promise(function(i){!function e(n,o){n<Et.length?(document.body.setAttribute("data-swal2-queue-step",n),r.fire(Et[n]).then(function(t){void 0!==t.value?(s.push(t.value),e(n+1,o)):a(i,{dismiss:t.dismiss})})):a(i,{value:s})}(0)})},getQueueStep:function(){return document.body.getAttribute("data-swal2-queue-step")},insertQueueStep:function(t,e){return e&&e<Et.length?Et.splice(e,0,t):Et.push(t)},deleteQueueStep:function(t){void 0!==Et[t]&&Et.splice(t,1)},showLoading:Pt,enableLoading:Pt,getTimerLeft:function(){return Ot.timeout&&Ot.timeout.getTimerLeft()},stopTimer:function(){return Ot.timeout&&Ot.timeout.stop()},resumeTimer:function(){return Ot.timeout&&Ot.timeout.start()},toggleTimer:function(){var t=Ot.timeout;return t&&(t.running?t.stop():t.start())},increaseTimer:function(t){return Ot.timeout&&Ot.timeout.increase(t)},isTimerRunning:function(){return Ot.timeout&&Ot.timeout.isRunning()}});function It(){var t=ht.innerParams.get(this),e=ht.domCache.get(this);t.showConfirmButton||(T(e.confirmButton),t.showCancelButton||T(e.actions)),ot([e.popup,e.actions],k.loading),e.popup.removeAttribute("aria-busy"),e.popup.removeAttribute("data-loading"),e.confirmButton.disabled=!1,e.cancelButton.disabled=!1}function Rt(){null===x.previousBodyPadding&&document.body.scrollHeight>window.innerHeight&&(x.previousBodyPadding=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")),document.body.style.paddingRight=x.previousBodyPadding+function(){if("ontouchstart"in window||navigator.msMaxTouchPoints)return 0;var t=document.createElement("div");t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",document.body.appendChild(t);var e=t.offsetWidth-t.clientWidth;return document.body.removeChild(t),e}()+"px")}function Dt(){return!!window.MSInputMethodContext&&!!document.documentMode}function Nt(){var t=q(),e=rt();t.style.removeProperty("align-items"),e.offsetTop<0&&(t.style.alignItems="flex-start")}var Ut=function(){null!==x.previousBodyPadding&&(document.body.style.paddingRight=x.previousBodyPadding+"px",x.previousBodyPadding=null)},_t=function(){if(S(document.body,k.iosfix)){var t=parseInt(document.body.style.top,10);ot(document.body,k.iosfix),document.body.style.top="",document.body.scrollTop=-1*t}},zt=function(){"undefined"!=typeof window&&Dt()&&window.removeEventListener("resize",Nt)},Wt=function(){m(document.body.children).forEach(function(t){t.hasAttribute("data-previous-aria-hidden")?(t.setAttribute("aria-hidden",t.getAttribute("data-previous-aria-hidden")),t.removeAttribute("data-previous-aria-hidden")):t.removeAttribute("aria-hidden")})},Kt={swalPromiseResolve:new WeakMap};function Ft(t,e,n){e?$t(n):(Tt().then(function(){return $t(n)}),Ot.keydownTarget.removeEventListener("keydown",Ot.keydownHandler,{capture:Ot.keydownListenerCapture}),Ot.keydownHandlerAdded=!1),delete Ot.keydownHandler,delete Ot.keydownTarget,t.parentNode&&t.parentNode.removeChild(t),ot([document.documentElement,document.body],[k.shown,k["height-auto"],k["no-backdrop"],k["toast-shown"],k["toast-column"]]),at()&&(Ut(),_t(),zt(),Wt())}function Zt(t,e,n,o){t.removeEventListener(dt,Zt),S(t,k.hide)&&Ft(e,n,o),Yt(ht),Yt(Kt)}function Qt(t){var e=q(),n=rt();if(n&&!S(n,k.hide)){var o=ht.innerParams.get(this),i=Kt.swalPromiseResolve.get(this),r=o.onClose,a=o.onAfterClose;ot(n,k.show),nt(n,k.hide),dt&&j(n)?n.addEventListener(dt,Zt.bind(null,n,e,st(),a)):Ft(e,st(),a),null!==r&&"function"==typeof r&&r(n),i(t||{}),delete this.params}}var Yt=function(t){for(var e in t)t[e]=new WeakMap},$t=function(t){null!==t&&"function"==typeof t&&setTimeout(function(){t()})};function Jt(t,e,n){var o=ht.domCache.get(t);e.forEach(function(t){o[t].disabled=n})}function Xt(t,e){if(!t)return!1;if("radio"===t.type)for(var n=t.parentNode.parentNode.querySelectorAll("input"),o=0;o<n.length;o++)n[o].disabled=e;else t.disabled=e}var Gt=function(){function n(t,e){o(this,n),this.callback=t,this.remaining=e,this.running=!1,this.start()}return r(n,[{key:"start",value:function(){return this.running||(this.running=!0,this.started=new Date,this.id=setTimeout(this.callback,this.remaining)),this.remaining}},{key:"stop",value:function(){return this.running&&(this.running=!1,clearTimeout(this.id),this.remaining-=new Date-this.started),this.remaining}},{key:"increase",value:function(t){var e=this.running;return e&&this.stop(),this.remaining+=t,e&&this.start(),this.remaining}},{key:"getTimerLeft",value:function(){return this.running&&(this.stop(),this.start()),this.remaining}},{key:"isRunning",value:function(){return this.running}}]),n}(),te={email:function(t,e){return/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(t)?Promise.resolve():Promise.resolve(e||"Invalid email address")},url:function(t,e){return/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(t)?Promise.resolve():Promise.resolve(e||"Invalid URL")}};function ee(t,e){t.removeEventListener(dt,ee),e.style.overflowY="auto"}function ne(t){var e=q(),n=rt();null!==t.onBeforeOpen&&"function"==typeof t.onBeforeOpen&&t.onBeforeOpen(n),t.animation&&(nt(n,k.show),nt(e,k.fade)),O(n),dt&&j(n)?(e.style.overflowY="hidden",n.addEventListener(dt,ee.bind(null,n,e))):e.style.overflowY="auto",nt([document.documentElement,document.body,e],k.shown),t.heightAuto&&t.backdrop&&!t.toast&&nt([document.documentElement,document.body],k["height-auto"]),at()&&(t.scrollbarPadding&&Rt(),function(){if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!S(document.body,k.iosfix)){var t=document.body.scrollTop;document.body.style.top=-1*t+"px",nt(document.body,k.iosfix)}}(),"undefined"!=typeof window&&Dt()&&(Nt(),window.addEventListener("resize",Nt)),m(document.body.children).forEach(function(t){t===q()||function(t,e){if("function"==typeof t.contains)return t.contains(e)}(t,q())||(t.hasAttribute("aria-hidden")&&t.setAttribute("data-previous-aria-hidden",t.getAttribute("aria-hidden")),t.setAttribute("aria-hidden","true"))}),setTimeout(function(){e.scrollTop=0})),st()||Ot.previousActiveElement||(Ot.previousActiveElement=document.activeElement),null!==t.onOpen&&"function"==typeof t.onOpen&&setTimeout(function(){t.onOpen(n)})}var oe=void 0,ie={select:function(t,e,i){var r=it(t,k.select);e.forEach(function(t){var e=t[0],n=t[1],o=document.createElement("option");o.value=e,o.innerHTML=n,i.inputValue.toString()===e.toString()&&(o.selected=!0),r.appendChild(o)}),r.focus()},radio:function(t,e,a){var s=it(t,k.radio);e.forEach(function(t){var e=t[0],n=t[1],o=document.createElement("input"),i=document.createElement("label");o.type="radio",o.name=k.radio,o.value=e,a.inputValue.toString()===e.toString()&&(o.checked=!0);var r=document.createElement("span");r.innerHTML=n,r.className=k.label,i.appendChild(o),i.appendChild(r),s.appendChild(i)});var n=s.querySelectorAll("input");n.length&&n[0].focus()}},re=function(e){var n=[];return"undefined"!=typeof Map&&e instanceof Map?e.forEach(function(t,e){n.push([e,t])}):Object.keys(e).forEach(function(t){n.push([t,e[t]])}),n};var ae,se=Object.freeze({hideLoading:It,disableLoading:It,getInput:function(t){var e=ht.innerParams.get(t||this);return P(ht.domCache.get(t||this).content,e.input)},close:Qt,closePopup:Qt,closeModal:Qt,closeToast:Qt,enableButtons:function(){Jt(this,["confirmButton","cancelButton"],!1)},disableButtons:function(){Jt(this,["confirmButton","cancelButton"],!0)},enableConfirmButton:function(){h("Swal.disableConfirmButton()","Swal.getConfirmButton().removeAttribute('disabled')"),Jt(this,["confirmButton"],!1)},disableConfirmButton:function(){h("Swal.enableConfirmButton()","Swal.getConfirmButton().setAttribute('disabled', '')"),Jt(this,["confirmButton"],!0)},enableInput:function(){return Xt(this.getInput(),!1)},disableInput:function(){return Xt(this.getInput(),!0)},showValidationMessage:function(t){var e=ht.domCache.get(this);e.validationMessage.innerHTML=t;var n=window.getComputedStyle(e.popup);e.validationMessage.style.marginLeft="-".concat(n.getPropertyValue("padding-left")),e.validationMessage.style.marginRight="-".concat(n.getPropertyValue("padding-right")),O(e.validationMessage);var o=this.getInput();o&&(o.setAttribute("aria-invalid",!0),o.setAttribute("aria-describedBy",k["validation-message"]),A(o),nt(o,k.inputerror))},resetValidationMessage:function(){var t=ht.domCache.get(this);t.validationMessage&&T(t.validationMessage);var e=this.getInput();e&&(e.removeAttribute("aria-invalid"),e.removeAttribute("aria-describedBy"),ot(e,k.inputerror))},getProgressSteps:function(){return h("Swal.getProgressSteps()","const swalInstance = Swal.fire({progressSteps: ['1', '2', '3']}); const progressSteps = swalInstance.params.progressSteps"),ht.innerParams.get(this).progressSteps},setProgressSteps:function(t){h("Swal.setProgressSteps()","Swal.update()");var e=a({},ht.innerParams.get(this),{progressSteps:t});Ct(0,e),ht.innerParams.set(this,e)},showProgressSteps:function(){var t=ht.domCache.get(this);O(t.progressSteps)},hideProgressSteps:function(){var t=ht.domCache.get(this);T(t.progressSteps)},_main:function(t){var c=this;!function(t){for(var e in t)At(i=e)||y('Unknown parameter "'.concat(i,'"')),t.toast&&(o=e,-1!==qt.indexOf(o)&&y('The parameter "'.concat(o,'" is incompatible with toasts'))),Lt(n=void 0)&&h(n,Lt(n));var n,o,i}(t);var l=a({},Mt,t);!function(e){e.inputValidator||Object.keys(te).forEach(function(t){e.input===t&&(e.inputValidator=te[t])}),e.showLoaderOnConfirm&&!e.preConfirm&&y("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"),e.animation=w(e.animation),e.target&&("string"!=typeof e.target||document.querySelector(e.target))&&("string"==typeof e.target||e.target.appendChild)||(y('Target parameter is not valid, defaulting to "body"'),e.target="body"),"string"==typeof e.title&&(e.title=e.title.split("\n").join("<br />"));var t=rt(),n="string"==typeof e.target?document.querySelector(e.target):e.target;(!t||t&&n&&t.parentNode!==n.parentNode)&&ct(e)}(l),Object.freeze(l),Ot.timeout&&(Ot.timeout.stop(),delete Ot.timeout),clearTimeout(Ot.restoreFocusTimeout);var d={popup:rt(),container:q(),content:U(),actions:Z(),confirmButton:K(),cancelButton:F(),closeButton:$(),validationMessage:W(),progressSteps:z()};ht.domCache.set(this,d),Bt(this,l),ht.innerParams.set(this,l);var p=this.constructor;return new Promise(function(t){function n(t){c.closePopup({value:t})}function s(t){c.closePopup({dismiss:t})}Kt.swalPromiseResolve.set(c,t),l.timer&&(Ot.timeout=new Gt(function(){s("timer"),delete Ot.timeout},l.timer)),l.input&&setTimeout(function(){var t=c.getInput();t&&A(t)},0);for(var u=function(e){l.showLoaderOnConfirm&&p.showLoading(),l.preConfirm?(c.resetValidationMessage(),Promise.resolve().then(function(){return l.preConfirm(e,l.validationMessage)}).then(function(t){V(d.validationMessage)||!1===t?c.hideLoading():n(void 0===t?e:t)})):n(e)},e=function(t){var e=t.target,n=d.confirmButton,o=d.cancelButton,i=n&&(n===e||n.contains(e)),r=o&&(o===e||o.contains(e));switch(t.type){case"click":if(i)if(c.disableButtons(),l.input){var a=function(){var t=c.getInput();if(!t)return null;switch(l.input){case"checkbox":return t.checked?1:0;case"radio":return t.checked?t.value:null;case"file":return t.files.length?t.files[0]:null;default:return l.inputAutoTrim?t.value.trim():t.value}}();l.inputValidator?(c.disableInput(),Promise.resolve().then(function(){return l.inputValidator(a,l.validationMessage)}).then(function(t){c.enableButtons(),c.enableInput(),t?c.showValidationMessage(t):u(a)})):c.getInput().checkValidity()?u(a):(c.enableButtons(),c.showValidationMessage(l.validationMessage))}else u(!0);else r&&(c.disableButtons(),s(p.DismissReason.cancel))}},o=d.popup.querySelectorAll("button"),i=0;i<o.length;i++)o[i].onclick=e,o[i].onmouseover=e,o[i].onmouseout=e,o[i].onmousedown=e;if(d.closeButton.onclick=function(){s(p.DismissReason.close)},l.toast)d.popup.onclick=function(){l.showConfirmButton||l.showCancelButton||l.showCloseButton||l.input||s(p.DismissReason.close)};else{var r=!1;d.popup.onmousedown=function(){d.container.onmouseup=function(t){d.container.onmouseup=void 0,t.target===d.container&&(r=!0)}},d.container.onmousedown=function(){d.popup.onmouseup=function(t){d.popup.onmouseup=void 0,t.target!==d.popup&&!d.popup.contains(t.target)||(r=!0)}},d.container.onclick=function(t){r?r=!1:t.target===d.container&&w(l.allowOutsideClick)&&s(p.DismissReason.backdrop)}}function a(t,e){for(var n=J(l.focusCancel),o=0;o<n.length;o++)return(t+=e)===n.length?t=0:-1===t&&(t=n.length-1),n[t].focus();d.popup.focus()}l.reverseButtons?d.confirmButton.parentNode.insertBefore(d.cancelButton,d.confirmButton):d.confirmButton.parentNode.insertBefore(d.confirmButton,d.cancelButton),Ot.keydownTarget&&Ot.keydownHandlerAdded&&(Ot.keydownTarget.removeEventListener("keydown",Ot.keydownHandler,{capture:Ot.keydownListenerCapture}),Ot.keydownHandlerAdded=!1),l.toast||(Ot.keydownHandler=function(t){return function(t,e){if(e.stopKeydownPropagation&&t.stopPropagation(),"Enter"!==t.key||t.isComposing)if("Tab"===t.key){for(var n=t.target,o=J(e.focusCancel),i=-1,r=0;r<o.length;r++)if(n===o[r]){i=r;break}t.shiftKey?a(i,-1):a(i,1),t.stopPropagation(),t.preventDefault()}else-1!==["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Left","Right","Up","Down"].indexOf(t.key)?document.activeElement===d.confirmButton&&V(d.cancelButton)?d.cancelButton.focus():document.activeElement===d.cancelButton&&V(d.confirmButton)&&d.confirmButton.focus():"Escape"!==t.key&&"Esc"!==t.key||!0!==w(e.allowEscapeKey)||(t.preventDefault(),s(p.DismissReason.esc));else if(t.target&&c.getInput()&&t.target.outerHTML===c.getInput().outerHTML){if(-1!==["textarea","file"].indexOf(e.input))return;p.clickConfirm(),t.preventDefault()}}(t,l)},Ot.keydownTarget=l.keydownListenerCapture?window:d.popup,Ot.keydownListenerCapture=l.keydownListenerCapture,Ot.keydownTarget.addEventListener("keydown",Ot.keydownHandler,{capture:Ot.keydownListenerCapture}),Ot.keydownHandlerAdded=!0),c.enableButtons(),c.hideLoading(),c.resetValidationMessage(),l.toast&&(l.input||l.footer||l.showCloseButton)?nt(document.body,k["toast-column"]):ot(document.body,k["toast-column"]),"select"===l.input||"radio"===l.input?function(e,n){function o(t){return ie[n.input](i,re(t),n)}var i=U();v(n.inputOptions)?(Pt(),n.inputOptions.then(function(t){e.hideLoading(),o(t)})):"object"===f(n.inputOptions)?o(n.inputOptions):g("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(f(n.inputOptions)))}(c,l):-1!==["text","email","number","tel","textarea"].indexOf(l.input)&&v(l.inputValue)&&function(e,n){var o=e.getInput();T(o),n.inputValue.then(function(t){o.value="number"===n.input?parseFloat(t)||0:t+"",O(o),o.focus(),e.hideLoading()}).catch(function(t){g("Error in inputValue promise: "+t),o.value="",O(o),o.focus(),oe.hideLoading()})}(c,l),ne(l),l.toast||(w(l.allowEnterKey)?l.focusCancel&&V(d.cancelButton)?d.cancelButton.focus():l.focusConfirm&&V(d.confirmButton)?d.confirmButton.focus():a(-1,1):document.activeElement&&"function"==typeof document.activeElement.blur&&document.activeElement.blur()),d.container.scrollTop=0})},update:function(e){var n={};Object.keys(e).forEach(function(t){ce.isUpdatableParameter(t)?n[t]=e[t]:y('Invalid parameter to update: "'.concat(t,'". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js'))});var t=a({},ht.innerParams.get(this),n);Bt(this,t),ht.innerParams.set(this,t),Object.defineProperties(this,{params:{value:a({},this.params,e),writable:!1,enumerable:!0}})}});function ue(){if("undefined"!=typeof window){"undefined"==typeof Promise&&g("This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)"),ae=this;for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var o=Object.freeze(this.constructor.argsToParams(e));Object.defineProperties(this,{params:{value:o,writable:!1,enumerable:!0,configurable:!0}});var i=this._main(this.params);ht.promise.set(this,i)}}ue.prototype.then=function(t){return ht.promise.get(this).then(t)},ue.prototype.finally=function(t){return ht.promise.get(this).finally(t)},a(ue.prototype,se),a(ue,Ht),Object.keys(se).forEach(function(e){ue[e]=function(){var t;if(ae)return(t=ae)[e].apply(t,arguments)}}),ue.DismissReason=C,ue.version="8.11.1";var ce=ue;return ce.default=ce}),"undefined"!=typeof window&&window.Sweetalert2&&(window.swal=window.sweetAlert=window.Swal=window.SweetAlert=window.Sweetalert2);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"@charset \"UTF-8\";@-webkit-keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-shown{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:initial;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon::before{display:flex;align-items:center;font-size:2em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon::before{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 .0625em #fff,0 0 0 .125em rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:2em 2em;transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;-webkit-transform-origin:0 1.5em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}@-webkit-keyframes swal2-toast-show{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg)}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg)}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg)}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg)}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg)}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg)}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-shown{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent}body.swal2-no-backdrop .swal2-shown>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-shown.swal2-top{top:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-top-left,body.swal2-no-backdrop .swal2-shown.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-top-end,body.swal2-no-backdrop .swal2-shown.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-shown.swal2-center{top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-left,body.swal2-no-backdrop .swal2-shown.swal2-center-start{top:50%;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-end,body.swal2-no-backdrop .swal2-shown.swal2-center-right{top:50%;right:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom{bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom-left,body.swal2-no-backdrop .swal2-shown.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-bottom-end,body.swal2-no-backdrop .swal2-shown.swal2-bottom-right{right:0;bottom:0}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;background-color:transparent;-webkit-overflow-scrolling:touch}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-container.swal2-fade{transition:background-color .1s}.swal2-container.swal2-shown{background-color:rgba(0,0,0,.4)}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{z-index:1;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-actions.swal2-loading .swal2-styled.swal2-confirm{box-sizing:border-box;width:2.5em;height:2.5em;margin:.46875em;padding:0;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{content:\"\";display:inline-block;width:15px;height:15px;margin-left:5px;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff}.swal2-styled{margin:.3125em;padding:.625em 2em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 2px #fff,0 0 0 4px rgba(50,100,150,.4)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;top:0;right:0;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:0;outline:initial;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{-webkit-transform:none;transform:none;background:0 0;color:#f27474}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0;color:#545454;font-size:1.125em;font-weight:300;line-height:normal;word-wrap:break-word}#swal2-content{text-align:center}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-file::-webkit-input-placeholder,.swal2-input::-webkit-input-placeholder,.swal2-textarea::-webkit-input-placeholder{color:#ccc}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::-ms-input-placeholder,.swal2-input::-ms-input-placeholder,.swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:inherit}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:inherit;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;zoom:normal;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;zoom:normal;border:.25em solid transparent;border-radius:50%;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon::before{display:flex;align-items:center;height:92%;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning::before{content:\"!\"}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info::before{content:\"i\"}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question::before{content:\"?\"}.swal2-icon.swal2-question.swal2-arabic-question-mark::before{content:\"؟\"}.swal2-icon.swal2-success{border-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:3.75em 3.75em;transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 3.75em;transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.875em;width:1.5625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-progress-steps{align-items:center;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#3085d6}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;width:2.5em;height:.4em;margin:0 -1px;background:#3085d6}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-show.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-hide.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-animate-success-icon .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-animate-error-icon{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-animate-error-icon .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}@-webkit-keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:initial!important}}");