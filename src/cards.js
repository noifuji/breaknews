/* global $, pubsub */
const Pubsub = require('pubsub-js');
const PullToRefresh = require('pulltorefreshjs');


//VARIABLES
var initModule, setJqueryMap, jqueryMap,
    article_model, onInview, onArticleUpdated,
    update_article_list, calcDiffFromCurrentTime,
    stateMap = {
        $container: null
    };

//DOM METHODS
setJqueryMap = function() {
    jqueryMap = {
        $progress_bar: stateMap.$container.find('.progress-bar'),
        $article_list: stateMap.$container.find('#article-list'),
        $refresh_history: stateMap.$container.find('.load_old_articles'),
        $progress_spinner: stateMap.$container.find('#progress-spinner')
    };
};

/**
 * Event Handler
 * Listens inview event from $refresh_history dom.
 * Check the oldest article and load older articles than that one.
 * If no articles, it return current time.
 * @param {string} event
 * @param {boolean} isInview
 * @see jquery-inview plugin
 */
onInview = function(event, isInview) {
    if (isInview) {
        //Spinner comes in view.
        console.log("Request old articles.");
        let theOldestDate = article_model.getTheOldestPubDate();
        update_article_list(theOldestDate < 0 ? new Date().getTime() : theOldestDate, false);
    }
    else {
        //Spinner goes out from view.
    }
};

/**
 * Updates views.
 * @param {string}
 * @param {object}
 */
onArticleUpdated = function(e, result) {
    let err = result.err;
    let updated_articles = result.updated_articles;
    let newer = result.newer;
    if (result.err) {
        //stop progress bar
        jqueryMap.$progress_bar.removeClass('progress-bar--indeterminate');
        console.log(err);
        //$('#error').html('<p>An error has occurred</p>');
        //$('#error').html(err);
    }
    else {
        //console.log(updated_articles);
        let $cards = $("<div>");
        for (let i = 0; i < updated_articles.items.length; i++) {

            //article-thumbnail
            let $card;
            if (updated_articles.items[i].thumbnail.substring(0, 4) == "http") {
                //サムネありレイアウト
                $card = $("<a>", {
                    "class": "card card--material card__content card-with-thumbnail",
                    "href": updated_articles.items[i].url,
                    "target": "_blank",
                    "onClick": "gtag('event', 'click', {'event_category': 'outbound', 'event_label': '" + updated_articles.items[i].url + "'});"
                });
                let $thumbnail = $("<div>", { "class": "article-thumbnail" });
                $thumbnail.append($("<img>", { "src": updated_articles.items[i].thumbnail, "class": "article-thumbnail-image", "alt": "" }));
                $card.append($thumbnail);
            }
            else {
                //サムネなしレイアウト
                $card = $("<a>", {
                    "class": "card card--material card__content card-without-thumbnail",
                    "href": updated_articles.items[i].url,
                    "target": "_blank",
                    "onClick": "gtag('event', 'click', {'event_category': 'outbound', 'event_label': '" + updated_articles.items[i].url + "'});"
                });
            }
            let $title = $("<div>", { "class": "article-title" });
            $title.append(updated_articles.items[i].title);
            $card.append($title);
            let $info = $("<div>", { "class": "article-info" });
            $info.append(updated_articles.items[i].sitetitle + " | " + calcDiffFromCurrentTime(updated_articles.items[i].publicationDate)); //TODO:アップデート時間を追加。
            $card.append($info);

            $cards.append($card);
        }
        if (newer) {
            jqueryMap.$article_list.prepend($cards);
        }
        else {
            jqueryMap.$refresh_history.remove();
            jqueryMap.$article_list.append($cards);
            //jqueryMap.$progress_spinner.html('<a class="card card--material card__content load_old_articles">Now Loading</a>');
            jqueryMap.$progress_spinner.html('<div class="load_old_articles"><svg class="progress-circular progress-circular--material progress-circular--indeterminate">' +
                '<circle class="progress-circular__background progress-circular--material__background"/>' +
                '<circle class="progress-circular__primary progress-circular--material__primary progress-circular--indeterminate__primary"/>' +
                '<circle class="progress-circular__secondary progress-circular--material__secondary progress-circular--indeterminate__secondary"/>' +
                '</svg></div>');
            setJqueryMap();
            jqueryMap.$refresh_history.on('inview', onInview);
        }
        jqueryMap.$progress_bar.removeClass('progress-bar--indeterminate');
    }
};

/**
 * Event Handler
 * It removes all cards and reload from a server.
 */
var onPullToRefresh = function() {
    article_model.clearArticles();
    jqueryMap.$article_list.children().remove();
    jqueryMap.$refresh_history.remove();
    update_article_list(new Date().getTime(), false);
};

//PUBLIC METHODS
//initialize
initModule = function($container, article) {
    stateMap.$container = $container;
    setJqueryMap();
    article_model = article;

    Pubsub.subscribe('spa-article-update', onArticleUpdated);
    PullToRefresh.init({ mainElement: '#article_container', onRefresh: onPullToRefresh });

    update_article_list(new Date().getTime(), false);
};

//Gets new articles.
update_article_list = function(latestArticleTime, newer) {
    if (article_model.isLoading()) {
        console.log("request rejected. current status is loading");
        return;
    }
    //start progress bar
    jqueryMap.$progress_bar.addClass('progress-bar--indeterminate');
    //20件取得する。
    article_model.get_article(20, latestArticleTime, newer);
};

calcDiffFromCurrentTime = function(datetime) {
    let current = new Date().getTime();
    let diff = current - datetime;

    if (diff >= 60 * 60 * 1000) {
        return Math.floor(diff / 60 / 60 / 1000) + "hours ago";
    }
    else if (diff < 60 * 60 * 1000 && diff >= 60 * 1000) {
        return Math.floor(diff / 60 / 1000) + "min ago";
    }
    else if (diff < 60 * 1000) {
        return Math.floor(diff / 1000) + "sec ago";
    }
    else {
        return "0";
    }
};

module.exports.initModule = initModule;
