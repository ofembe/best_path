'use strict'

/**
 * Module dependencies.
 */
var driver = require("mongo-driver")
module.exports = {
  /**
    * Saves a path in database.
    * @param {Object} db
    * @param {Array} stops
    * @param {String} token
    * @return {Promise}
    */
    savePath: function (db, stops, token) {
        return db.insert("route",
            {stops: stops, completed: false, token: token}
            )
    },

  /**
    * Adds locations to a path in database.
    * @param {Object} db
    * @param {String} token
    * @param {Array} route
    * @return {Promise}
    */
    updateRoute: function (db, token, route) {
        return db.update("route",
            {
                token: token
            },
            {
                "$set": {
                    route: route,
                    completed: true
                }
            })
    },

  /**
    * Gets a path from database.
    * @param {Object} db
    * @param {String} token
    * @return {Promise}
    */
    findPath: function (db, token) {
        return db.findOne("route", {token: token})
    }
}
