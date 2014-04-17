'use strict';

var productModel = require('../models/index');
var pageMenu = require('../models/index');

var url = require('url');


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
    app.get('/linha/:id/*', line_subline);    
    app.get('/sublinha/:id/*', line_subline);
    

    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
    process.on('uncaughtException', function(err) {
        console.log('Threw Exception: ', err);
    });
};
