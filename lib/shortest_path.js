'use strict'
var googleRequest = require('../lib/request')
    , Log = require('log')
    , requestParser = require('../lib/request_parser')
    , responseLocations = require('../lib/response_locations')
    , responseParser = require('../lib/response_parser')
    , route = require('../models/route')

var log = new Log()

module.exports = {
  /**
    * Sends path distance request to google.
    * @param {Object} db
    * @param {String} requestString
    * @param {Function} done
    * @return {Promise}
    */
    processPendingPaths: function (db, token, done) {
      var pathData
      route.findPath(db, token)
      .then(function (_pathData) {
          pathData = _pathData
          return requestParser.prepareRequest(pathData.stops)
      }).then(function (httpRequest) {
          return googleRequest.getDirections(httpRequest)
      }).then(function (httpResult) {
          return responseParser.getShortestPath(httpResult.body)
      }).then(function (pathDetails) {
          return responseLocations.appendPath(pathDetails, pathData.stops)
      }).then(function (pathSequence) {
          return route.updateRoute(db, pathData.token, pathSequence)
      }).catch(function (err) {
          log.error(err)
          return
      }).finally(function() {
        done()
      })
    }
}
