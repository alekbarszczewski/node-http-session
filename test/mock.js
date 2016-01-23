
var nock = require('nock')

var mirrorReply = function (uri, requestBody) {
  try {
    requestBody = JSON.parse(requestBody)
  } catch (err) {}
  return {
    method: this.method,
    uri: uri,
    headers: this.req._headers,
    body: requestBody
  }
}

var setHeaders = {
  'Set-Cookie': function (req, res, body) {
    return req.headers['x-set-cookie'] || ''
  },
  'X-Server-Header': function() { return 'server' }
}

var scope = nock('http://example.com')
.persist()
.replyContentLength()

var methods = ['get', 'post', 'put', 'delete', 'patch', 'head']
methods.forEach(function (method) {
  scope[method](/^/)
  .query(true)
  .reply(200, mirrorReply, setHeaders)
})
