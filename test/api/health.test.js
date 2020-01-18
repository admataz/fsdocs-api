'use strict'

const t = require('tap')
const request = require('request')

t.test('API health', t => {
  t.test('GET /health - create new document', t => {
    request('http://localhost:3000/api/health', {
      method: 'GET'
    }, (err, res, body) => {
      t.error(err)
      t.equal(res.statusCode, 200)
      t.same(JSON.parse(res.body), { ok: true })
      t.end()
    })
  })
  t.end()
})
