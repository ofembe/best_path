var assert = require("assert")
var responseParser = require('../lib/response_parser')
var directions = require('./data/google_result.json')
var pathDistance = require('./data/path_distance.json')

describe('Google response parser', function () {
    describe('#pairDistances()', function () {

        it('should return pathDistance between all stops', function () {
            var data = responseParser.getShortestPath(JSON.stringify(directions))
            assert.equal(
                JSON.stringify(pathDistance), JSON.stringify(data)
            )
        })

        it('should return error when google response is invalid', function () {
            assert.throws(function () {
                responseParser.getShortestPath('Unqualified input')
            },
                'ERROR_PROCESSING_GOOGLE_RESPONSE'
                )
        })

    })
})
