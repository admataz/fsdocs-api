'use strict'

const path = require('path')
// const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-cors'), {
    origin: '*'
  })
  fastify.register(require('fastify-sensible'))
  fastify.register(require('./services/health'), { prefix: '/api' })
  fastify.register(require('./services/documents'), {
    prefix: '/api',
    uploadsDir: path.resolve(__dirname, process.env.USER_UPLOADS_DIR)
  })
  next()
}
