'use strict'

const t = require('tap')
const request = require('request')

t.test('Documents API', t => {
  t.test('POST /documents - create new document', t => {
    t.test('valid payload', t => {
      request('http://localhost:3000/api/documents', {
        method: 'POST',
        json: true,
        body: {
          title: 'test document',
          body: 'this is some text'
        }
      }, (err, res, body) => {
        t.error(err)
        t.equal(res.statusCode, 201)
        t.end()
      })
    })
    t.end()
  })
  t.end()
})
