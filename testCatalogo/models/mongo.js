'use strict';
var rest = require('rest');
var MongoClient = require('mongodb').MongoClient;

var obj = {
	getHeader: function(callback) {
		var header="";
		MongoClient.connect('mongodb://127.0.0.1:27017/americanas', function(err, db) {
			var collection = db.collection('header');
			collection.find().toArray(function(err, results) {
				if(results.length){
					console.log("mongodb called");
					header=results[0].html;
					callback(header);
					db.close();
				} else {
					console.log("service called");
					var url = "http://hml.www.americanas.com.br/pageService/home/HomeLinha/menu/231993/";
					rest(url).done(function(response) {
						var json = JSON.parse(response.entity);
						collection.insert({html: json.header}, function(err, docs){
							callback(json.header);
							db.close();
						});
					});

				}
			});
		});
	},
	getBreadcrumbs: function(menu, callback) {
		var breadcrumbs="";
		MongoClient.connect('mongodb://127.0.0.1:27017/americanas', function(err, db) {
			var collection = db.collection('breadcrumbs');
			collection.find({menuid: menu}).toArray(function(err, results) {
				if(results.length){
					console.log("mongodb called");
					breadcrumbs=results[0].menuobj;
					callback(breadcrumbs);
					db.close();
				} else {
					console.log("service called");
					var url = "http://hml.www.americanas.com.br/pageService/home/HomeLinha/menu/"+menu;
					rest(url).done(function(response) {
						var json = JSON.parse(response.entity);
						collection.insert({menuid: menu, menuobj: json.breadcrumbs}, function(err, docs){
							callback(json.breadcrumbs);
							db.close();
						});
					});

				}
			});
		});
	},
	getListProducts: function(menu, callback) {
		var products="";
		MongoClient.connect('mongodb://127.0.0.1:27017/americanas', function(err, db) {
			var collection = db.collection('products');
			collection.find({menuid: menu}).toArray(function(err, results) {
				if(results.length){
					console.log("mongodb called");
					products=results[0].productsList;
					callback(products);
					db.close();
				} else {
					console.log("service called");
					var url = "http://hml.www.americanas.com.br/pageService/home/HomeLinha/menu/"+menu;
					rest(url).done(function(response) {
						var json = JSON.parse(response.entity);
						collection.insert({menuid: menu, productsList: json.products}, function(err, docs){
							callback(json.products);
							db.close();
						});
					});

				}
			});
		});
	}
}
module.exports = obj;