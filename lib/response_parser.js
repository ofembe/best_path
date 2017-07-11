'use strict'

/**
 * Module dependencies.
 */
var permutation = require('array-permutation')
    , Log = require('log')
    , log = new Log()

module.exports = {
  /**
    * Brute force traveling salesman solution.
    * @param {Object} googleResult
    * @return {Object} path
    */
    getShortestPath: function (googleResult) {
        try {
            var dropOffs = []
                , path = []
                , resultObject = JSON.parse(googleResult)
                , totalStops = resultObject.rows.length
            for (var i  = 1; i < totalStops; i++) {
                dropOffs.push(i)
            }

            var permutations = permutation(dropOffs)
            , distance = 0
            , time = 0
            , currentPermutation = 0

            for (var perm of permutations) {
                var currentDistance = 0
                var currentTime = 0
                perm.unshift(0)
                for (var j = 0; j < (perm.length - 1); j++) {
                    var details = resultObject.rows[perm[j]].elements[perm[j+1]]
                    currentDistance += details.distance.value
                    currentTime += details.duration.value
                }

                if( currentDistance < distance || distance === 0) {
                    distance = currentDistance
                    path = perm
                    time = currentTime
                }
            }
            return {
                "path": path,
                "total_distance": distance,
                "total_time": time
            }
        } catch (err) {
            log.error(err)
            throw new Error('ERROR_PROCESSING_GOOGLE_RESPONSE')
        }
    }
}
