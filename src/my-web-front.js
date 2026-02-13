/**
 * my-web-front v1.0.0
 * Lightweight JavaScript utility library for frontend development.
 * Provides DOM manipulation, event handling, CSS helpers, and more.
 * MIT License
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.mwf = factory());
})(this, function () {
  'use strict';

  // ──────────────────────────────────────
  // DOM Selection
  // ──────────────────────────────────────

  /**
   * Select a single element.
   * @param {string} selector - CSS selector
   * @param {Element} [ctx=document] - Context element
   * @returns {Element|null}
   */
  function qs(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  /**
   * Select multiple elements as an Array.
   * @param {string} selector - CSS selector
   * @param {Element} [ctx=document] - Context element
   * @returns {Element[]}
   */
  function qsa(selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  }

  // ──────────────────────────────────────
  // DOM Manipulation
  // ──────────────────────────────────────

  /**
   * Create an element with optional attributes and children.
   * @param {string} tag - Tag name
   * @param {Object} [attrs] - Attributes / properties
   * @param {...(string|Element)} children - Text or child elements
   * @returns {Element}
   */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'style' && typeof attrs[key] === 'object') {
          Object.assign(node.style, attrs[key]);
        } else if (key === 'class' || key === 'className') {
          node.className = attrs[key];
        } else if (key.startsWith('on') && typeof attrs[key] === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        } else {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    var children = Array.prototype.slice.call(arguments, 2);
    children.forEach(function (child) {
      if (typeof child === 'string') {
        node.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        node.appendChild(child);
      }
    });
    return node;
  }

  /**
   * Remove an element from the DOM.
   * @param {Element} node
   */
  function remove(node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  /**
   * Empty all children of an element.
   * @param {Element} node
   */
  function empty(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  // ──────────────────────────────────────
  // CSS Class Helpers
  // ──────────────────────────────────────

  /**
   * Add class(es) to an element.
   * @param {Element} node
   * @param {...string} cls - Class name(s)
   */
  function addClass(node) {
    var classes = Array.prototype.slice.call(arguments, 1);
    classes.forEach(function (c) { node.classList.add(c); });
  }

  /**
   * Remove class(es) from an element.
   * @param {Element} node
   * @param {...string} cls
   */
  function removeClass(node) {
    var classes = Array.prototype.slice.call(arguments, 1);
    classes.forEach(function (c) { node.classList.remove(c); });
  }

  /**
   * Toggle a class on an element.
   * @param {Element} node
   * @param {string} cls
   * @param {boolean} [force]
   * @returns {boolean}
   */
  function toggleClass(node, cls, force) {
    return node.classList.toggle(cls, force);
  }

  /**
   * Check if an element has a class.
   * @param {Element} node
   * @param {string} cls
   * @returns {boolean}
   */
  function hasClass(node, cls) {
    return node.classList.contains(cls);
  }

  // ──────────────────────────────────────
  // Events
  // ──────────────────────────────────────

  /**
   * Attach an event listener.
   * @param {Element} node
   * @param {string} event
   * @param {Function} handler
   * @param {Object} [opts]
   * @returns {Function} Detach function
   */
  function on(node, event, handler, opts) {
    node.addEventListener(event, handler, opts);
    return function off() {
      node.removeEventListener(event, handler, opts);
    };
  }

  /**
   * Attach a one-time event listener.
   * @param {Element} node
   * @param {string} event
   * @param {Function} handler
   */
  function once(node, event, handler) {
    node.addEventListener(event, handler, { once: true });
  }

  /**
   * Event delegation helper.
   * @param {Element} parent
   * @param {string} event
   * @param {string} selector - Child selector to match
   * @param {Function} handler
   * @returns {Function} Detach function
   */
  function delegate(parent, event, selector, handler) {
    function listener(e) {
      var target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    }
    parent.addEventListener(event, listener);
    return function off() {
      parent.removeEventListener(event, listener);
    };
  }

  /**
   * Debounce a function.
   * @param {Function} fn
   * @param {number} ms - Delay in milliseconds
   * @returns {Function}
   */
  function debounce(fn, ms) {
    var timer;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  /**
   * Throttle a function.
   * @param {Function} fn
   * @param {number} ms - Interval in milliseconds
   * @returns {Function}
   */
  function throttle(fn, ms) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  // ──────────────────────────────────────
  // Utilities
  // ──────────────────────────────────────

  /**
   * Wait for DOM ready.
   * @param {Function} fn
   */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * Get / set CSS custom property on :root.
   * @param {string} name - Variable name (with or without --)
   * @param {string} [value] - Value to set
   * @returns {string|undefined}
   */
  function cssVar(name, value) {
    var prop = name.startsWith('--') ? name : '--' + name;
    if (value !== undefined) {
      document.documentElement.style.setProperty(prop, value);
    } else {
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }
  }

  /**
   * Simple fetch wrapper that returns JSON.
   * @param {string} url
   * @param {Object} [opts]
   * @returns {Promise<any>}
   */
  function fetchJSON(url, opts) {
    return fetch(url, opts).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  // ──────────────────────────────────────
  // Public API
  // ──────────────────────────────────────

  return {
    qs: qs,
    qsa: qsa,
    el: el,
    remove: remove,
    empty: empty,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    hasClass: hasClass,
    on: on,
    once: once,
    delegate: delegate,
    debounce: debounce,
    throttle: throttle,
    ready: ready,
    cssVar: cssVar,
    fetchJSON: fetchJSON
  };
});
