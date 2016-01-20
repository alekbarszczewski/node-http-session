
# http-session

Simple HTTP client that perists session between subsequent requests.  
Based on [Request][request].

## Features

* Persists session (cookies and headers) between subsequent requests
* Allows to easily serialize/deserialize session (cookies and headers) to/from JSON
* Accepts all [Request][request] options
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
    * [new HttpSession(defaults)](#new_HttpSession_new)
    * [.request(options)](#HttpSession+request) ⇒ <code>Promise.&lt;httpResponse&gt;</code>
    * [.setHeader(name, value)](#HttpSession+setHeader)
    * [.unsetHeader(name)](#HttpSession+unsetHeader)
    * [.beforeRequest(callback)](#HttpSession+beforeRequest)
    * [.afterRequest(callback)](#HttpSession+afterRequest)
    * [.serialize()](#HttpSession+serialize) ⇒ <code>object</code>
    * [.deserialize(state)](#HttpSession+deserialize)

<a name="new_HttpSession_new"></a>
### new HttpSession(defaults)

| Param | Type | Description |
| --- | --- | --- |
| defaults | <code>object</code> | request.js default options. |

<a name="HttpSession+request"></a>
### httpSession.request(options) ⇒ <code>Promise.&lt;httpResponse&gt;</code>
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>string</code> &#124; <code>object</code> | [Request][request] options |

<a name="HttpSession+setHeader"></a>
### httpSession.setHeader(name, value)
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |
| value | <code>any</code> | header value |

<a name="HttpSession+unsetHeader"></a>
### httpSession.unsetHeader(name)
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | header name |

<a name="HttpSession+beforeRequest"></a>
### httpSession.beforeRequest(callback)
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | callback function |

<a name="HttpSession+afterRequest"></a>
### httpSession.afterRequest(callback)
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | callback function |

<a name="HttpSession+serialize"></a>
### httpSession.serialize() ⇒ <code>object</code>
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  
**Returns**: <code>object</code> - JSON representation of session state  
<a name="HttpSession+deserialize"></a>
### httpSession.deserialize(state)
**Kind**: instance method of <code>[HttpSession](#HttpSession)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | session state |


[request]: https://github.com/request/request
