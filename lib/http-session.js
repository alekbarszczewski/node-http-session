'use strict'

var request = require('request')
var Promise = require('bluebird').Promise
var clone = require('clone')
var classExtend = require('class-extend')

/**
 * @class
 * @classDesc Represents a HTTP session.
 * @param {object} options
 * @param {object} options.defaults - [Request defaults](https://github.com/request/request#requestdefaultsoptions)
 */
var HttpSession = function (options) {
  options = options || {}
  this._request = request.defaults(options.defaults || {})
  this._headers = {}
  this._cookieJar = request.jar()
  this._hooks = {}
}

/**
 * Extends HttpSession with custom instance and static methods/properties and returns new class constructor.
 * For details see [class-extend](https://github.com/SBoudrias/class-extend) library.
 * @example
 * var MyCrawler = HttpSession.extend({
 *   constructor: function () {
 *     // if you are overriding contructor remember to call super
 *     MyCrawler.__super__.constructor.apply(this, arguments)
 *     // additional initialization code here...
 *   },
 *   login: function (login, password) {
 *     return this.post({
 *       url: 'http://example.com/login',
 *       body: { login: login, password: password },
         json: true
 *     }).then(function (response) {
 *       this.setHeader('Authorization', response.body.accessToken)
 *     })
 *   }
 * }, {
 *   hello: function () { console.log('hello!') }
 * })
 *
 * var myCrawler = new MyCrawler()
 * myCrawler.login({ login: 'login', password: '*****' }).then(...)
 * MyCrawler.hello()
 * @memberof HttpSession
 * @param {object} protoProps - instance methods/properties
 * @param {object} staticProps - static methods/properties
 * @returns {function} extended class constructor
 */
HttpSession.extend = classExtend.extend

/**
 * Performs HTTP request.
 * You can pass URL or URL + options or only options.
 * Default HTTP method is GET.
 * @param {string|object} url/options - URL or [Request options](https://github.com/request/request#requestoptions-callback)
 * @param {object} options - [Request options](https://github.com/request/request#requestoptions-callback)
 * @returns {Promise<http.IncomingMessage>} [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
 */
HttpSession.prototype.request = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  var _request = this._request
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
  .then(function (response) {
    return this._runHooks('afterRequest', response, options)
  })
}

/**
 * Same as {@link HttpSession#request} with GET method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.get = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'GET'
  return this.request(options)
}

/**
 * Same as {@link HttpSession#request} with POST method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.post = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'POST'
  return this.request(options)
}

/**
 * Same as {@link HttpSession#request} with PUT method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.put = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'PUT'
  return this.request(options)
}

/**
 * Same as {@link HttpSession#request} with DELETE method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.del = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'DELETE'
  return this.request(options)
}

/**
 * Same as {@link HttpSession#request} with PATCH method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.patch = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'PATCH'
  return this.request(options)
}

/**
 * Same as {@link HttpSession#request} with HEAD method
 * @param {string} url - URL
 * @param {object} options - [Request][request] options
 * @returns {Promise<http.IncomingMessage>}
 */
HttpSession.prototype.head = function (url, options) {
  options = this._normalizeOptions.apply(this, arguments)
  options.method = 'HEAD'
  return this.request(options)
}

/**
 * Sets custom header that will be sent on each request.
 * Headers set through this method will also be serialized by {@link HttpSession#serialize} method.
 * @param {string} name - header name
 * @param {any} value - header value
 */
HttpSession.prototype.setHeader = function (name, value) {
  if (values === null || value === undefined) {
    value = ''
  }
  this._headers[name] = value
}

/**
 * Unsets custom header
 * @param {string} name - header name
 */
HttpSession.prototype.unsetHeader = function (name) {
  delete this._headers[name]
}

/**
 * Sets up beforeRequest hook
 * @param {HttpSession~beforeRequestCallback} callback - callback function
 */
HttpSession.prototype.beforeRequest = function (callback) {
  this._addHook('beforeRequest', callback)
}

/**
 * Sets up afterRequest hook
 * @param {HttpSession~afterRequestCallback} callback - callback function
 */
HttpSession.prototype.afterRequest = function (callback) {
  this._addHook('afterRequest', callback)
}

/**
 * Serializes session state to JSON.
 * It serializes cookies and custom headers.
 * @returns {object} JSON representation of session state
 */
HttpSession.prototype.serialize = function () {
  return clone({
    headers: this._headers,
    cookies: this._cookieJar._jar.serializeSync()
  })
}

/**
 * Deserializes session state from JSON
 * @param {object} state - session state
 */
HttpSession.prototype.deserialize = function (state) {
  state = clone(state || {})
  this._headers = state.headers || {}
  var CookieJar = this._cookieJar._jar.constructor
  this._cookieJar._jar = CookieJar.deserializeSync(state.cookies)
}

HttpSession.prototype._normalizeOptions = function (url, options) {
  if (typeof url !== 'string') {
    options = url || {}
  } else {
    options = options || {}
    options.url = url
  }
  options = clone(options)
  return options
}

HttpSession.prototype._addHook = function (event, handler) {
  this._hooks[event] = this._hooks[event] || []
  this._hooks[event].push(handler)
}

HttpSession.prototype._runHooks = function(event) {
  var eventArgs = Array.prototype.slice.call(arguments)
  eventArgs.shift()
  var handlers = this._hooks[event] || []
  if (!handlers.length) { return eventArgs[0] }
  return Promise.reduce(handlers, function (total, handler) {
    return handler.apply(this, eventArgs)
  }.bind(this), eventArgs)
}

/**
 * beforeRequest callback function is called before each request.
 * It receives options that will be passed to request.
 * You can modify options object.
 * You can return promise.
 * @callback HttpSession~beforeRequestCallback
 * @param {object} options - options that will be passed to request
 */

/**
* afterRequest callback function is called after each request.
* It receives http response from a request.
* You can modify HttpSession.request(...) result by returning custom data from this callback.
* You can return promise.
* @callback HttpSession~afterRequestCallback
* @param {http.IncomingMessage} response - HTTP response
* @param {object} options request options
*/

module.exports = HttpSession
