'use strict'

/**
 * Dependencies.
 */
var config = require('config')
  , db
  , driver = require("mongo-driver")
  , googleRequest = require('../lib/request')
  , kue = require('kue')
  , Log = require('log')
  , pathResolver = require('../lib/shortest_path')
  , request = require('request')
  , requestParser = require('../lib/request_parser')
  , responseLocations = require('../lib/response_locations')
  , responseParser = require('../lib/response_parser')
  , restify = require('restify')
  , route = require('../models/route')
  , uuidv4 = require('uuid/v4')

var log = new Log()
  , queue = kue.createQueue({
              prefix: config.Redis.routesQueue,
              redis: {
                port: config.Redis.port,
                host: config.Redis.host,
                options: {}
              }
            })
//Mongo db connection
driver.connect(config.Mongo.connection)
    .then(function (_db) {
        db = _db
    }).catch(function (err) {
        log.error(err)
    })
//Worker that processes jobs
queue.process(config.Redis.routesQueue, function(job, done){
    pathResolver.processPendingPaths(db, job.data.token, done)
})

var server = restify.createServer({
        name: 'best_path',
        version: '1.0.0'
    })

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/route/:token', function (req, res, next) {
    route.findPath(db, req.params.token)
    .then(function (pathData) {
        if(!pathData)
            throw new Error('ERROR_NO_PATH_FOUND')
        log.info(pathData)
        if(!pathData.completed)
            res.send({"status": "in progress"})
        res.send(Object.assign({"status": "success"}, pathData.route))
    }).catch(function (err) {
        log.error(err)
        res.send(Object.assign({"status": "failure"}, {"error": err.message}))
    })

    return next()
})

server.post('/route', function (req, res, next) {
    var pathData
    route.savePath(db, req.body, uuidv4())
    .then(function (_pathData) {
        pathData = _pathData[0]
        queue.create(config.Redis.routesQueue, {token: pathData.token})
              .attempts(config.Redis.jobAttempts).save()
        log.info({token: pathData.token})
        res.send({token: pathData.token})
    }).catch(function (err) {
        log.error(err)
        res.send(err)
    })

    return next()
})

server.listen(8888, function () {
   console.log('%s listening at %s', server.name, server.url)
})
