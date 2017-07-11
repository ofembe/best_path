'use strict'
var assert = require("assert")
var requestParser = require('../lib/request_parser')
var stops = require('./data/request_path.json')

describe('Google request parser', function () {
    describe('#prepareRequest()', function () {

        it('should return valid google multistop request path', function () {
            var expected = 'http://maps.googleapis.com/maps/api/'
                    + 'distancematrix/json?'
                    + 'destinations=22.372081,114.107877|22.284419,'
                    + '114.159510|22.326442,114.167811&'
                    + 'origins=22.372081,114.107877|22.284419,'
                    + '114.159510|22.326442,114.167811'
            var data = requestParser.prepareRequest(stops)
            assert.equal(expected, data)
        })

        it('should return error when google response is invalid', function () {
            assert.throws(function () {
                requestParser.prepareRequest('Unqualified input')
            },
                'ERROR_PROCESSING_REQUEST_DATA'
                )
        })

    })
})
