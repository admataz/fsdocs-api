'use strict'
const path = require('path')
const FSDocs = require('fsdocs')

// we only support these types
const mimeTypes = {
  '.txt': 'text/plain', 
  '.json': 'application/json',
  '.md': 'text/plain',
  '.csv': 'text/csv',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif'
}

module.exports = (app, opts, next) => {
  app.decorate('fsdocs', new FSDocs(opts.uploadsDir))

  const getDocuments = async (request, reply) => {
    const documentPath = request.params['*'] || ''
    const pathInfo = path.parse(documentPath)
    try {
      const body = await app.fsdocs.readFile(documentPath)
      const bodyParsed = (pathInfo.ext === '.json') ? JSON.parse(body) : body
      const mt = mimeTypes[pathInfo.ext] || 'application/json'
      reply.type(mt).status(200).send(bodyParsed)
    } catch (error) {
      if (error.message === 'ERR_FILE_NOT_EXISTS') {
        throw app.httpErrors.notFound()
      }
      throw (error)
    }
  }

  app.route({
    url: '/documents',
    method: 'POST',
    // TODO: schema
    handler: async (request, reply) => {
      const {
        ext = '.txt',
        body = '',
        name = 'uploaded-file',
        dir = './'
      } = request.body

      const newFilePath = await app.fsdocs.createFile(
        dir,
        name,
        ext,
        body
      )
      const pathInfo = path.parse(newFilePath)

      reply
        .status(201)
        .send(pathInfo)
    }
  })

  app.route({
    url: '/documents/*',
    method: 'PUT',
    handler: async (request, reply) => {
      const documentPath = request.params['*']
      const pathInfo = path.parse(documentPath)

      const { body = '' } = request.body

      try {
        await app.fsdocs.updateFile(documentPath, body)
        reply.status(200).send(pathInfo)
      } catch (error) {
        if (error.message === 'ERR_FILE_NOT_EXISTS') {
          throw app.httpErrors.notFound()
        }
        throw (error)
      }
    }
  })

  app.route({
    url: '/documents/*',
    method: 'DELETE',
    handler: async (request, reply) => {
      const documentPath = request.params['*']
      const pathInfo = path.parse(documentPath)

      try {
        await app.fsdocs.deleteFile(documentPath)
        reply.status(200).send(pathInfo)
      } catch (error) {
        if (error.message === 'ERR_FILE_NOT_EXISTS') {
          throw app.httpErrors.notFound()
        }
        throw (error)
      }
    }
  })

  app.route({
    url: '/documents/*',
    method: 'GET',
    handler: getDocuments
  })

  app.route({
    url: '/documents',
    method: 'GET',
    handler: getDocuments
  })

  next()
}
