/*
 * spa.model.js
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
const Pubsub = require('pubsub-js');
const config = require('./config.js');
const utils = require('./utils.js');

var data_source;

/**
 * It gets article data and keeps them.
 * When it gets newer articles, all local data are removed.
 * When it gets older articles, loaded data will be added to local.
 * @type {Object}
 */
var article = (function() {
    var loadingFlag = false;
    /**
     * TODO: Save in local cache storage.
     */
    var articles = [];

    var getArticles = function() {
        return articles;
    };
    var setArticles = function(arg_articles) {
        articles = arg_articles;
    };

    /**
     * It gets article data from data source.
     * It returns data via pubsub events.
     * @param {number} limit
     * @param {number} time
     * @param {boolean} newer
     */
    var get_article = function(limit, time, newer) {
        var query = utils.generateGetArticlesQuery(limit, time, newer);
        setLoadingFlag(true);

        if (data_source == config.DATA_SOURCE.PRODUCTION) {
            $.ajax({
                url: query,
                type: 'GET',
                dataType: 'json',
                timeout: 10000,
                error: function() {
                    setLoadingFlag(false);
                    Pubsub.publish('spa-article-update', { err: "Failed", updated_articles: null, newer: newer });
                },
                success: function(data) {
                    //stop progress bar
                    setLoadingFlag(false);
                    if (data.count == 0) {
                        Pubsub.publish('spa-article-update', { err: "No articles", updated_articles: null, newer: newer });
                    }
                    else {
                        setArticles(getArticles().concat(data.items));
                        Pubsub.publish('spa-article-update', { err: null, updated_articles: data, newer: newer });
                    }
                }
            });
        }
        else {
            let fake = [{ "publicationDay": "2019-05-25", "title": "故・ホイットニー・ヒューストンをホログラムで現世に再現！　コンサート・ツアー開催へ　…米国", "publicationDate": 1558781298000, "sitetitle": "【2ch】コピペ情報局", "url": "http://news.2chblog.jp/archives/51954277.html", "description": "", "thumbnail": "", "hash": "6a065bd04b1d6b035ed5f0037bd5c529" },
                { "publicationDay": "2019-05-25", "title": "ｶﾞﾘｶﾞﾘ 運転手「ガードレール壊しちゃった」小3「おっ、やべえ110番だな！（歓喜）」", "publicationDate": 1558781123000, "sitetitle": "キニ速", "url": "http://blog.livedoor.jp/kinisoku/archives/5060135.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/577d28b9c8ca60feab602c2dae3c4aba.png", "hash": "577d28b9c8ca60feab602c2dae3c4aba" },
                { "publicationDay": "2019-05-25", "title": "チョコミント嫌いなやつって絶対否定から入るよな", "publicationDate": 1558780749000, "sitetitle": "ハムスター速報", "url": "http://hamusoku.com/archives/10049595.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/86a04245bbd592c28548ee4876ab2f10.png", "hash": "86a04245bbd592c28548ee4876ab2f10" },
                { "publicationDay": "2019-05-25", "title": "【画像】女子、突然自分にブチギレ", "publicationDate": 1558780594000, "sitetitle": "VIPPER速報", "url": "http://vippers.jp/archives/9319709.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/4e5d8efee7b9058408c340160271ccc6.png", "hash": "4e5d8efee7b9058408c340160271ccc6" },
                { "publicationDay": "2019-05-25", "title": "【画像】女子、突然自分にブチギレ", "publicationDate": 1558780594010, "sitetitle": "VIPPER速報", "url": "http://vippers.jp/archives/9319709.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/4e5d8efee7b9058408c340160271ccc6.png", "hash": "4e5d8efee7b9058408c340160271ccc6" },
                { "publicationDay": "2019-05-25", "title": "【画像】女子、突然自分にブチギレ", "publicationDate": 1558780594020, "sitetitle": "VIPPER速報", "url": "http://vippers.jp/archives/9319709.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/4e5d8efee7b9058408c340160271ccc6.png", "hash": "4e5d8efee7b9058408c340160271ccc6" },
                { "publicationDay": "2019-05-25", "title": "【画像】女子、突然自分にブチギレ", "publicationDate": 1558780594030, "sitetitle": "VIPPER速報", "url": "http://vippers.jp/archives/9319709.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/4e5d8efee7b9058408c340160271ccc6.png", "hash": "4e5d8efee7b9058408c340160271ccc6" },
                { "publicationDay": "2019-05-25", "title": "【画像】女子、突然自分にブチギレ", "publicationDate": 1558780594040, "sitetitle": "VIPPER速報", "url": "http://vippers.jp/archives/9319709.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/4e5d8efee7b9058408c340160271ccc6.png", "hash": "4e5d8efee7b9058408c340160271ccc6" },
                { "publicationDay": "2019-05-25", "title": "【何言ってだコイツ】NGT早川支配人「被害届を本人の意思に反して会社が取り下げることはできない（ｷﾘｯ」←(；ﾟДﾟ)", "publicationDate": 1558780233000, "sitetitle": "VIPワイドガイド", "url": "http://news4wide.livedoor.biz/archives/2230986.html", "description": "", "thumbnail": "https://s3-ap-northeast-1.amazonaws.com/antenna-rss-entry-thumbnail/dfb3dfb945ecab294c910fc79dd3269f.png", "hash": "dfb3dfb945ecab294c910fc79dd3269f" }
            ];

            let items = [];
            if (newer) {
                for (let i = 0; i < fake.length; i++) {
                    if (fake[i].publicationDate > time) {
                        items.push(fake[i]);
                    }
                    if (items.length >= limit) {
                        break;
                    }
                }
            }
            else {
                for (let i = 0; i < fake.length; i++) {
                    if (fake[i].publicationDate < time) {
                        items.push(fake[i]);
                    }
                    if (items.length >= limit) {
                        break;
                    }
                }
            }

            let data = {
                "items": items,
                "count": items.length
            };

            setTimeout(function() {
                setLoadingFlag(false);
                setArticles(getArticles().concat(data.items));
                Pubsub.publish('spa-article-update', { err: null, updated_articles: data, newer: newer });
            }, 200);

        }

        return;
    };

    var setLoadingFlag = function(arg_loadingFlag) {
        loadingFlag = arg_loadingFlag;
    };

    /**
     * When you call get_article, check this status not to call many times.
     * @return {boolean} This object is loading data from data source or not.
     */
    var isLoading = function() {
        return loadingFlag;
    };

    /**
     * Clear all articles
     */
    var clearArticles = function() {
        setArticles([]);
    }

    /**
     * Returns the oldest article of articles.
     * If no articles, it returns -1;
     * TODO:DB objet should have this function.
     * @returns {number}
     */
    var getTheOldestPubDate = function() {
        if (!getArticles()) {
            return -1;
        }
        if (getArticles().length <= 0) {
            return -1;
        }

        let temp = getArticles()[0].publicationDate;
        for (let i = 0; i < articles.length; i++) {
            if (temp > articles[i].publicationDate) {
                temp = articles[i].publicationDate;
            }
        }
        return temp;
    };

    return {
        get_article: get_article,
        clearArticles: clearArticles,
        getArticles: getArticles,
        isLoading: isLoading,
        getTheOldestPubDate: getTheOldestPubDate
    };
}());

var initModule = function(arg_data_source) {
    // initialize anonymous person
    data_source = arg_data_source;
    article.clearArticles();
};

module.exports.initModule = initModule;
module.exports.article = article;
