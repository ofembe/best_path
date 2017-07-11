'use strict'

/**
 * Module dependencies.
 */
var request = require('request')
    , Log = require('log')
    , log = new Log()
module.exports = {
  /**
    * Sends path distance request to google.
    * @param {String} requestString
    * @return {Promise}
    */
    getDirections: function (requestString) {
        return new Promise(function (fulfill, reject) {
            request(requestString, function (err, res, body) {
                if (err || res.statusCode !== 200) {
                    log.error(err)
                    reject(new Error('ERROR_CALLING_GOOGLE_API'))
                }
                    fulfill(res)
            })
        })
    }
}
