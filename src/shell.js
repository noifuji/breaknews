/* global $, cards */
//var ons = require('../../node_modules/onsenui/css/onsenui.css');
//var ons_com = require('../../node_modules/onsenui/css/onsen-css-components.min.css');
var model = require("./model.js");
var cards = require("./cards.js");
const PullToRefresh = require('pulltorefreshjs');

//VARIABLES
var initModule, setJqueryMap, jqueryMap,
    stateMap = {
        $container: null
    };

var main_html = String() +
    '<div class="toolbar toolbar--material">' +
    '<div class="toolbar__center toolbar--material__center">' +
    'Break News' +
    '</div>' +
    '</div>' +
    '<div class="sp-view container">' +
     '<div id="error"></div>' +
     '<div class="progress-bar progress-bar--material"></div>' +
     '<div id="article_container">' +
      '<div id="article-list"></div>' +
      '<div id="progress-spinner"></div>' +
     '</div>' +
    '</div>' +
    '<div class="sp-view fav hide">Favorites</div>' +
    '<div class="sp-view settings hide">Settings</div>'
    //TODO:Activate Tabbar.
    /* +
    '<div class="tabbar tabbar--material">' +
    '<label class="tabbar__item tabbar--material__item">' +
    '<input type="radio" name="tabbar-material-c" checked="checked">' +
    '<button class="tabbar__button tabbar--material__button">' +
    '<i class="tabbar__icon tabbar--material__icon zmdi zmdi-view-headline"></i>' +
    '<div class="tabbar__label tabbar--material__label">News</div>' +
    '</button>' +
    '</label>' +
    '<label class="tabbar__item tabbar--material__item">' +
    '<input type="radio" name="tabbar-material-c">' +
    '<button class="tabbar__button tabbar--material__button">' +
    '<i class="tabbar__icon tabbar--material__icon zmdi zmdi-favorite"></i>' +
    '<div class="tabbar__label tabbar--material__label">Favorites</div>' +
    '</button>' +
    '</label>' +
    '<label class="tabbar__item tabbar--material__item">' +
    '<input type="radio" name="tabbar-material-c">' +
    '<button class="tabbar__button tabbar--material__button">' +
    '<i class="tabbar__icon tabbar--material__icon zmdi zmdi-settings"></i>' +
    '<div class="tabbar__label tabbar--material__label">Settings</div>' +
    '</button>' +
    '</label>' +
    '</div>'*/;

//DOM METHODS
setJqueryMap = function() {
    jqueryMap = {

    };
};

//EVENT HANDLER

//PUBLIC METHODS
initModule = function($container, data_source) {
    $container.html(main_html);
    stateMap.$container = $container;
    setJqueryMap();
    
    $('input[type="radio"]').click(function() {
		var index = $('input[type="radio"]').index(this);
		$('.sp-view').addClass('hide');

		//クリックされたタブと同じ順番のコンテンツを表示します。
		$('.sp-view').eq(index).removeClass('hide');
	});
	
	model.initModule(data_source);
    cards.initModule($container, model.article);
};


module.exports.initModule = initModule;
