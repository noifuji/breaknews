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

/**
 * It provides all constants of this app.
 * @type {Object}
 */
var GET_ARTICLES = {
    API : "https://nvl1ybvc0i.execute-api.ap-northeast-1.amazonaws.com/beta-1/rss-articles",
    PARAM_LIMIT : "limit",
    PARAM_TIME : "time",
    PARAM_NEWER : "newer"
};

var DATA_SOURCE = {
    PRODUCTION : "production",
    FAKE : "fake"
};

module.exports.GET_ARTICLES = GET_ARTICLES;
module.exports.DATA_SOURCE = DATA_SOURCE;
