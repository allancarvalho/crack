'use strict';
var rest = require('rest');
var NodeCache = require( "node-cache" );
var myCache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );
var pageMenu = {
	getLine: function(id, callback, params) {
		var query = "?pagejson=true&";
		for(var param in params) {
			query += param+"="+params[param];
		}
		var url = 'http://localhost:8080/pageService/home/HomeLinha/menu/'+id+query;
		var json = myCache.get(url);
		if(Object.keys(json).length === 0){
			var request = rest(url);
			request.done(function(response) {
				myCache.set(url, response.entity);
				callback(response.entity);
			});
		} else {
			callback(json[url]);
		}
	},
	getProduct: function(listIds, callback) {
		var url = 'http://localhost:8080/productinfo/?itens='+listIds+'&full=true';
		var json = myCache.get(url);
		if(Object.keys(json).length === 0){
			var request = rest(url);
			request.done(function(response) {
				myCache.set(url, response.entity);
				callback(response.entity);
			});
		} else {
			callback(json[url]);
		}
	},
	getFullProduct: function(idProduct, callback){
		var url = 'http://localhost:8080/produto/'+idProduct+'/?pagejson=true';
		var json = myCache.get(url);
		if(Object.keys(json).length === 0){
			var request = rest(url);
			request.done(function(response) {
				myCache.set(url, response.entity);
				callback(response.entity);
			});
		} else {
			callback(json[url]);
		}
	}
}
module.exports = pageMenu;