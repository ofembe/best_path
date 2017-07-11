'use strict'
var assert = require("assert")
var responseLocations = require('../lib/response_locations')
var routeDistance = require('./data/route_distance.json')
var stops = require('./data/request_path.json')
var response = require('./data/gis_response.json')

describe('Gis response parser', function () {
    describe('#appendPath()', function () {

        it('should replace stops with stops with locations', function () {
            var data = responseLocations.appendPath(routeDistance, stops)
            assert.equal(JSON.stringify(response), JSON.stringify(data))
        })

        it('should return error when google response is invalid', function () {
            assert.throws(function () {
                responseLocations.appendPath('Poor routes', 'Poor stops data')
            },
                'ERROR_PREPARING_RESPONSE_DATA'
                )
        })

    })
})
