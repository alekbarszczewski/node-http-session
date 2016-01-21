
# http-session

Simple HTTP client that perists session between subsequent requests.
Based on great [Request][request] library.

## Features

* Persists session (cookies and headers) between subsequent requests
* Allows to easily serialize/deserialize session (cookies and headers) to/from JSON
* Accepts all [Request options][request-options]
* Allows to modify request options and response through hooks

## Installation

```sh
$ npm install --save http-session
```

## API Reference
<a name="HttpSession"></a>
## HttpSession
Represents a HTTP session.

**Kind**: global class  

* [HttpSession](#HttpSession)
    * [new HttpSession(options)](#new_HttpSession_new)
    * _instance_
        * [.request(url/options, options)](#HttpSession+request) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.get(url, options)](#HttpSession+get) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.post(url, options)](#HttpSession+post) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.put(url, options)](#HttpSession+put) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.del(url, options)](#HttpSession+del) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.patch(url, options)](#HttpSession+patch) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.head(url, options)](#HttpSession+head) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
        * [.setHeader(name, value)](#HttpSession+setHeader)
        * [.unsetHeader(name)](#HttpSession+unsetHeader)
        * [.beforeRequest(callback)](#HttpSession+beforeRequest)
        * [.afterRequest(callback)](#HttpSession+afterRequest)
        * [.serialize()](#HttpSession+serialize) ⇒ <code>object</code>
        * [.deserialize(state)](#HttpSession+deserialize)
    * _static_
        * [.extend](#HttpSession.extend) ⇒ <code>function</code>
    * _inner_
        * [~beforeRequestCallback](#HttpSession..beforeRequestCallback) : <code>function</code>
        * [~afterRequestCallback](#HttpSession..afterRequestCallback) : <code>function</code>

<a name="new_HttpSession_new"></a>
### new HttpSession(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.defaults | <code>object</code> | [Request defaults](https://github.com/request/request#requestdefaultsoptions) |

<a name="HttpSession+request"></a>
### httpSession.request(url/options, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Performs HTTP request.
You can pass URL or URL + options or only options.
Default HTTP method is GET.

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  
**Returns**: <code>Promise.&lt;http.IncomingMessage&gt;</code> - [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)  

| Param | Type | Description |
| --- | --- | --- |
| url/options | <code>string</code> &#124; <code>object</code> | URL or [Request options](https://github.com/request/request#requestoptions-callback) |
| options | <code>object</code> | [Request options](https://github.com/request/request#requestoptions-callback) |

<a name="HttpSession+get"></a>
### httpSession.get(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with GET method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+post"></a>
### httpSession.post(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with POST method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+put"></a>
### httpSession.put(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with PUT method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+del"></a>
### httpSession.del(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with DELETE method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+patch"></a>
### httpSession.patch(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with PATCH method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+head"></a>
### httpSession.head(url, options) ⇒ <code>Promise.&lt;http.IncomingMessage&gt;</code>
Same as [request](#HttpSession+request) with HEAD method

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL |
| options | <code>object</code> | [Request][request] options |

<a name="HttpSession+setHeader"></a>
### httpSession.setHeader(name, value)
Sets custom header that will be sent on each request.
Headers set through this method will also be serialized by [serialize](#HttpSession+serialize) method.

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |
| value | <code>any</code> | header value |

<a name="HttpSession+unsetHeader"></a>
### httpSession.unsetHeader(name)
Unsets custom header

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |

<a name="HttpSession+beforeRequest"></a>
### httpSession.beforeRequest(callback)
Sets up beforeRequest hook

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[beforeRequestCallback](#HttpSession..beforeRequestCallback)</code> | callback function |

<a name="HttpSession+afterRequest"></a>
### httpSession.afterRequest(callback)
Sets up afterRequest hook

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[afterRequestCallback](#HttpSession..afterRequestCallback)</code> | callback function |

<a name="HttpSession+serialize"></a>
### httpSession.serialize() ⇒ <code>object</code>
Serializes session state to JSON.
It serializes cookies and custom headers.

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  
**Returns**: <code>object</code> - JSON representation of session state  
<a name="HttpSession+deserialize"></a>
### httpSession.deserialize(state)
Deserializes session state from JSON

**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | session state |

<a name="HttpSession.extend"></a>
### HttpSession.extend ⇒ <code>function</code>
Extends HttpSession with custom instance and static methods/properties and returns new class constructor.
For details see [class-extend](https://github.com/SBoudrias/class-extend) library.

**Kind**: static property of <code>[HttpSession](#HttpSession)</code>  
**Returns**: <code>function</code> - extended class constructor  

| Param | Type | Description |
| --- | --- | --- |
| protoProps | <code>object</code> | instance methods/properties |
| staticProps | <code>object</code> | static methods/properties |

**Example**  
```js
var MyCrawler = HttpSession.extend({
  constructor: function () {
    // if you are overriding contructor remember to call super
    MyCrawler.__super__.constructor.apply(this, arguments)
    // additional initialization code here...
  },
  login: function (login, password) {
    return this.post({
      url: 'http://example.com/login',
      body: { login: login, password: password },
         json: true
    }).then(function (response) {
      this.setHeader('Authorization', response.body.accessToken)
    })
  }
}, {
  hello: function () { console.log('hello!') }
})

var myCrawler = new MyCrawler()
myCrawler.login({ login: 'login', password: '*****' }).then(...)
MyCrawler.hello()
```
<a name="HttpSession..beforeRequestCallback"></a>
### HttpSession~beforeRequestCallback : <code>function</code>
beforeRequest callback function is called before each request.
It receives options that will be passed to request.
You can modify options object.
You can return promise.

**Kind**: inner typedef of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options that will be passed to request |

<a name="HttpSession..afterRequestCallback"></a>
### HttpSession~afterRequestCallback : <code>function</code>
afterRequest callback function is called after each request.
It receives http response from a request.
You can modify HttpSession.request(...) result by returning custom data from this callback.
You can return promise.

**Kind**: inner typedef of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>http.IncomingMessage</code> | HTTP response |
| options | <code>object</code> | request options |


[request]: https://github.com/request/request
[request-options]: https://github.com/request/request#requestoptions-callback
