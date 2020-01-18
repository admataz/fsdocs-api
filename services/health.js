'use strict'

const health = (app, opts, next) => {
  app.get('/health', (request, reply) => {
    reply.send({ ok: true })
  })

  next()
}

module.exports = health
