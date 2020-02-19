/*
 * config.js
 * Model module
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $ */
'use strict';
const config = require('./config.js');

/**
 * It provides all constants of this app.
 * @type {Object}
 */
var generateGetArticlesQuery = function(limit, time, newer) {
            if (limit < 0 || time < 0) {
                return "";
            }
            return config.GET_ARTICLES.API + '?' +
                config.GET_ARTICLES.PARAM_LIMIT + '=' + limit + "&" +
                config.GET_ARTICLES.PARAM_TIME + "=" + time + "&" +
                config.GET_ARTICLES.PARAM_NEWER + "=" + newer;
        };

module.exports.generateGetArticlesQuery = generateGetArticlesQuery;
