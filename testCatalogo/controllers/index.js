'use strict';

var mongo = require('../models/mongo');
var pageMenu = require('../models/index');
var rest = require('rest');
var url = require('url');
var page = {}, D = require('d.js');


var headerPromise = function() {
    var deferred = new D();
    mongo.getHeader(function(header){
        page.header = header;
        console.log("header ok");
        deferred.resolve();
    });
    return deferred.promise;
}
var breadcrumbsPromise = function(menu) {
    var deferred = new D();
    mongo.getBreadcrumbs(menu, function(breadcrumbs){
        page.breadcrumbs = breadcrumbs;
        console.log("breadcrumbs ok");
        deferred.resolve();
    });
    return deferred.promise;
}
var productsPromise = function(menu) {
    var deferred = new D();
    mongo.getListProducts(menu, function(products){
        var url = "http://www.americanas.com.br/productinfo/?itens="+(products.join(","));
        console.log(url);
        rest(url).done(function(products) {
            products = JSON.parse(products.entity);
            page.products = products.products;
            deferred.resolve();
        });
    });
    return deferred.promise;
}

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', model);
    });
    app.get('/produto/:id/*', function (req, res) {
        pageMenu.getFullProduct(req.params.id, function(html) {
            var json = JSON.parse(html);
            if(json.menu == undefined) {
                res.render('errors/404');

                return false;
            }
            if(json.products != undefined && json.products.length > 0) {
                var products = json.products;
                pageMenu.getProduct(products, function(data) {
                    json.products = JSON.parse(data).products;
                    res.render('produto', json);
                });
            } else {
                res.render('produto', json);
            }

        });
    });    
    var line_subline = function (req, res, err) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        pageMenu.getLine(req.params.id, function(html){
            var json = JSON.parse(html);
            if(json.menu == undefined) {
                res.render('errors/404');

                return false;
            }
            if(req.url.indexOf(json.menu.link) == -1) {
                res.redirect(json.menu.link);
            }
            if(json.products != undefined && json.products.length > 0) {
                var products = json.products.join(",");
                pageMenu.getProduct(products, function(data) {
                    json.products = JSON.parse(data).products;
                    res.render('linha', json);
                });
            } else {
                res.render('linha', json);
            }
        }, query);
    }
    app.get('/sublinha/:id/*', line_subline);
    // app.get('/linha/:id/*', line_subline);    


    app.get('/linha/:id/*', function(req, res) {
        D.all(headerPromise(), breadcrumbsPromise(req.params.id), productsPromise(req.params.id)).then(function() {
            console.log("promises end");
            res.render('linha', page);
            db.close();
        });
    });
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
    process.on('uncaughtException', function(err) {
        console.log('Threw Exception: ', err);
    });
};
