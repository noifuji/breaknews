const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(`<html><body><div id="aaa">AAA<div></body></html>`);
const { document } = dom.window;
const jquery = require('jquery');
global.$ = jquery(dom.window);
global.document = document;
global.window = dom.window;
const assert = require("assert");
const Pubsub = require('pubsub-js');

const config = require("../src/config.js");

/* TODO:This test load first get_article and it calls callback in the next test.*/
/* TODO:Shell's initmodule should have data_source argument.*/

describe('shell module', function() {
    it('initialize spa module', function(done) {
        let shell = require('../src/shell.js');
        Pubsub.subscribe('spa-article-update', function(e, result) {
            Pubsub.clearAllSubscriptions();
            if (result.err == null) {

                assert(true);
            }
            else {
                assert(false);
            }

            done();
        });

        shell.initModule($('<div/>'), config.DATA_SOURCE.FAKE);
    });
});


describe('article object', function() {
    it('gets newer data when newer flag is true', function(done) {
        let model = require('../src/model.js');
        model.initModule(config.DATA_SOURCE.FAKE);
        Pubsub.subscribe('spa-article-update', function(e, result) {
            assert.equal(result.err, null);
            assert.equal(result.updated_articles.count, 2);
            for (let i = 0; i < 2; i++) {
                assert(result.updated_articles.items[0].publicationDate > 1558780594020);
            }
            Pubsub.clearAllSubscriptions();
            done();
        });
        var article = model.article;
        article.get_article(2, 1558780594020, true);
    });

    it('gets older data when newer flag is false', function(done) {
        let model = require('../src/model.js');
        Pubsub.subscribe('spa-article-update', function(e, result) {
            assert.equal(result.err, null);
            assert.equal(result.updated_articles.count, 3);
            for (let i = 0; i < 3; i++) {
                assert(result.updated_articles.items[0].publicationDate < 1558780594025);
            }
            Pubsub.clearAllSubscriptions();
            done();
        });
        model.initModule(config.DATA_SOURCE.FAKE);
        var article = model.article;
        article.get_article(3, 1558780594025, false);
    });

    it('changes loading status to true in getting data', function(done) {
        let model = require('../src/model.js');
        model.initModule(config.DATA_SOURCE.FAKE);
        var article = model.article;

        Pubsub.subscribe('spa-article-update', function(e, result) {
            assert.equal(article.isLoading(), false);
            Pubsub.clearAllSubscriptions();
            done();
        });

        assert.equal(article.isLoading(), false);
        article.get_article(4, 1558780594025, false);
        assert.equal(article.isLoading(), true);
    });

    it('keeps loaded data in articles and it will be removed if user refreshed', function(done) {
        let model = require('../src/model.js');
        model.initModule(config.DATA_SOURCE.FAKE);
        var article = model.article;
        var counter = 0;

        Pubsub.subscribe('spa-article-update', function(e, result) {
            if (counter == 0) {
                assert.equal(result.updated_articles.count, 3);
                assert.equal(article.getArticles().length, 3);
                article.get_article(2, 1558780594025, false);
                counter++;
            }
            else if (counter == 1) {
                assert.equal(result.updated_articles.count, 2);
                assert.equal(article.getArticles().length, 5);
                article.clearArticles();
                article.get_article(2, 1558780594025, true);
                counter++;
            }
            else if (counter == 2) {
                assert.equal(result.updated_articles.count, 2);
                assert.equal(article.getArticles().length, 2);
                Pubsub.clearAllSubscriptions();
                done();
            }
        });

        article.get_article(3, 1558780594025, false);
    });
});
