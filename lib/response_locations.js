'use strict'

/**
 * Module dependencies.
 */
var config = require('config')
    , Log = require('log')
    , log = new Log()
module.exports = {
  /**
    * Replaces paths with locations.
    * @param {Object} pathDistance
    * @param {Array} pathLocations
    * @return {Object} path
    */
    appendPath: function (pathDistance, pathLocations) {
        try {
            var pathArray = []
            pathDistance.path.forEach(function (stop) {
                pathArray.push(pathLocations[stop])
            })
            pathDistance.path = pathArray
            return pathDistance
        } catch (err) {
            log.error(err)
            throw new Error('ERROR_PREPARING_RESPONSE_DATA')
        }
    }
}
