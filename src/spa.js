/*global $ */
global.$ = require('jquery');
require('jquery-inview');
const config = require('./config.js');
var shell = require("./shell.js");

//Entry point
$(function() {
 shell.initModule($('#spa'),config.DATA_SOURCE.PRODUCTION);
});
