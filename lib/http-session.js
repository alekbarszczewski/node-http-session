'use strict'

var request = require('request')
var Promise = require('bluebird').Promise
var clone = require('clone')

/**
 * @class
 * @classDesc Represents a HTTP session.
 * @param {object} defaults - request.js default options.
 */
var HttpSession = function (defaults) {
  defaults = defaults || {}
  this._request = request.defaults(defaults)
  this._headers = {}
  this._cookieJar = request.jar()
  this._hooks = {}
}

/**
 * @param {string|object} options - [Request][request] options
 * @returns {Promise<httpResponse>}
 */
HttpSession.prototype.request = function (options) {
  options = clone(options || {})
  var _request = this._request
  if (typeof options === 'string') { options = { url: options } }
  return Promise.bind(this)
  .then(function () {
    var headers = options.headers = options.headers || {}
    for (var key in this._headers) {
      if (this._headers.hasOwnProperty(key) && !headers.hasOwnProperty(key)) {
        headers[key] = this._headers[key]
      }
    }
    return this._runHooks('beforeRequest', options)
  })
  .then(function () {
    options.jar = this._cookieJar
    return new Promise(function (resolve, reject) {
      _request(options, function (err, res) {
        if (err) { return reject(err) }
        resolve(res)
      })
    }).bind(this)
  })
  .then(function (result) {
    return this._runHooks('afterRequest', result)
  })
}

/**
 * @param {string} name - header name
 * @param {any} value - header value
 */
HttpSession.prototype.setHeader = function (name, value) {
  if (arguments.length === 1 || value === undefined) {
    return this.unsetHeader(name)
  }
  this._headers[name] = value
}

/**
 * @param {string} name - header name
 */
HttpSession.prototype.unsetHeader = function (name) {
  delete this._headers[name]
}

/**
 * @param {function} callback - callback function
 */
HttpSession.prototype.beforeRequest = function (callback) {
  this._addHook('beforeRequest', callback)
}

/**
 * @param {function} callback - callback function
 */
HttpSession.prototype.afterRequest = function (callback) {
  this._addHook('afterRequest', callback)
}

/**
 * @returns {object} JSON representation of session state
 */
HttpSession.prototype.serialize = function () {
  return clone({
    headers: this._headers,
    cookies: this._cookieJar._jar.serializeSync()
  })
}

HttpSession.prototype.toJSON = HttpSession.prototype.serialize

/**
 * @param {object} state - session state
 */
HttpSession.prototype.deserialize = function (state) {
  state = clone(state || {})
  this._headers = state.headers || {}
  var CookieJar = this._cookieJar._jar.constructor
  this._cookieJar._jar = CookieJar.deserializeSync(state.cookies)
}

HttpSession.prototype.fromJSON = HttpSession.prototype.deserialize

HttpSession.prototype._addHook = function (event, handler) {
  this._hooks[event] = this._hooks[event] || []
  this._hooks[event].push(handler)
}

HttpSession.prototype._runHooks = function(event, payload) {
  var handlers = this._hooks[event] || []
  return Promise.reduce(handlers, function (total, handler) {
    return handler.call(this, payload)
  }.bind(this), payload)
}

module.exports = HttpSession
