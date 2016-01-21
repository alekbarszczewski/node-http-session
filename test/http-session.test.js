
var expect = require('expect.js')
var HttpSession = require('./../lib/http-session')
require('./mock')

describe('HttpSession', function () {

  describe('#constructor', function () {

    it('should return HttpSession instance with empty state', function () {
      var hs = new HttpSession()
      expect(hs).to.be.a(HttpSession)
      expect(hs._headers).to.eql({})
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
        method: 'GET',
        url: 'http://example.com',
        json: true
      }).then(function (response) {
        expect(response.body.uri).to.eql('/?key=value')
        expect(response.body.headers['x-custom']).to.eql('1')
      })
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
