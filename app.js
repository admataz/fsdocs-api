'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!

  fastify.register(require('fastify-sensible'))
  fastify.register(require('./services/health'), { prefix: '/api' })
  fastify.register(require('./services/documents'), {
    prefix: '/api',
    uploadsDir: path.resolve(__dirname, process.env.USER_UPLOADS_DIR)
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'services'),
  //   options: Object.assign({}, opts)
  // })

  // Make sure to call next when done
  next()
}
