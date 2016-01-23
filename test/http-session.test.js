
var expect = require('expect.js')
var Promise = require('bluebird').Promise
var HttpSession = require('./../lib/http-session')
require('./mock')

describe('HttpSession', function () {

  describe('#constructor', function () {

    it('should return HttpSession instance with empty state', function () {
      var hs = new HttpSession()
      expect(hs).to.be.a(HttpSession)
      expect(hs._hooks).to.eql({})
      expect(hs._cookieJar._jar.store.idx).to.eql({})
    })

    it('should respect request default options', function () {
      var hs = new HttpSession({
        defaults: {
          qs: { key: 'value' },
          headers: { 'x-custom': 1 }
        }
      })
      return hs.request({
        method: 'POST',
        url: 'http://example.com/1',
        json: true
      }).then(function (response) {
        expect(response.body.uri).to.eql('/1?key=value')
        expect(response.body.headers['x-custom']).to.eql('1')
      })
    })

  })

  describe('#request', function () {

    it('should perform HTTP request and return response', function () {
      var hs = new HttpSession({
        defaults: {
          headers: { 'x-custom-header1': 123 },
          json: true
        }
      })
      return hs.request({
        method: 'POST',
        body: { a: 1 },
        url: 'http://example.com/2',
        qs: { key: 'val' },
        headers: { 'x-custom-header2': 'abc' }
      }).then(function (res) {
        expect(res.body).to.eql({
          method: 'POST',
          uri: '/2?key=val',
          headers: {
            'x-custom-header1': 123,
            'x-custom-header2': 'abc',
            host: 'example.com',
            accept: 'application/json',
            'content-type': 'application/json',
            'content-length': 7
          },
          body: { a: 1 }
        })
      })
    })

    it('should persist cookies', function () {
      var hs = new HttpSession()
      return hs.request({
        method: 'POST',
        url: 'http://example.com/3',
        headers: { 'x-set-cookie': 'cookieKey=cookieVal' }
      }).then(function (res) {
        cookies = this.serialize().cookies.cookies
        expect(cookies).to.have.length(1)
        expect(cookies[0].key).to.equal('cookieKey')
        expect(cookies[0].value).to.equal('cookieVal')
        expect(cookies[0].domain).to.equal('example.com')
        return this.request({
          method: 'POST',
          url: 'http://example.com/4',
          json: true
        })
      }).then(function (res) {
        expect(res.body.headers.cookie).to.equal('cookieKey=cookieVal')
      })
    })

    it('should accept (url) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      return hs.request('http://example.com/5')
      .then(function (res) {
        expect(res.body.method).to.equal('GET')
        expect(res.body.uri).to.equal('/5')
      })
    })

    it('should accept (options) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      return hs.request({ url: 'http://example.com/5' })
      .then(function (res) {
        expect(res.body.method).to.equal('GET')
        expect(res.body.uri).to.equal('/5')
      })
    })

    it('should accept (url, options) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      return hs.request('http://example.com/5', { method: 'POST' })
      .then(function (res) {
        expect(res.body.method).to.equal('POST')
        expect(res.body.uri).to.equal('/5')
      })
    })

  })

  describe('#get/post/put/delete/patch/head', function () {

    it('should work with (url) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      var methods = ['get', 'post', 'put', 'delete', 'patch', 'head']
      promises = methods.map(function (method) {
        return hs[method]('http://example.com/' + method)
        .then(function (res) {
          expect(res.body.method.toLowerCase()).to.equal(method)
          expect(res.body.uri).to.equal('/' + method)
        })
      })
      return Promise.all(promises)
    })

    it('should work with (options) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      var methods = ['get', 'post', 'put', 'delete', 'patch', 'head']
      promises = methods.map(function (method) {
        return hs[method]({ url: 'http://example.com/' + method, method: 'x' })
        .then(function (res) {
          expect(res.body.method.toLowerCase()).to.equal(method)
          expect(res.body.uri).to.equal('/' + method)
        })
      })
      return Promise.all(promises)
    })

    it('should work with (url, options) arguments', function () {
      var hs = new HttpSession({
        defaults: { json: true }
      })
      var methods = ['get', 'post', 'put', 'delete', 'patch', 'head']
      promises = methods.map(function (method) {
        return hs[method]('http://example.com/' + method, {
          qs: { method: method },
          method: 'x'
        })
        .then(function (res) {
          expect(res.body.method.toLowerCase()).to.equal(method)
          expect(res.body.uri).to.equal('/' + method + '?method=' + method)
        })
      })
      return Promise.all(promises)
    })

  })

})

/*
var hs = new HttpSession()

hs.request({
  method: 'GET',
  url: 'http://example.com/abc?a=uu',
  headers: { 'x-set-cookie': 'a=b' },
  body: { a: 'b' },
  json: true
})
.then(function (response) {
  //console.log(response.body)
  console.log(response.headers)
  console.log(this.serialize().cookies)
})
*/
