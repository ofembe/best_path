'use strict'

/**
 * Module dependencies.
 */
var config = require('config')
  , Log = require('log')
  , log = new Log()

module.exports = {
  /**
    * Prepares google request string from locations.
    * @param {Array} route
    * @return {string} requestUrl
    */
    prepareRequest: function (route) {
        try {
            var stops = route.join('|')
              , params = []
              , requestUrl
            params.push('destinations=' + stops)
            params.push('origins=' + stops)
            requestUrl = config.Google.host + params.join('&')
            return requestUrl
        } catch (err) {
            log.error(err)
            throw new Error('ERROR_PROCESSING_REQUEST_DATA')
        }
    }
}
