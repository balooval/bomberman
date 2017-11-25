'use strict';

var App = (function(_app){
	_app.Assets = _app.Assets || {};
	
	var objectLoader = null;
	var batchs = [];
	var curBatch = null;
	var modelsLoaded = {};
	
	var api = {
		
		init : function() {
			objectLoader = new THREE.BufferGeometryLoader();
			modelsLoaded = {};
		}, 
		
		get : function(_id) {
			return modelsLoaded[_id];
		}, 
		
		addToList : function(_list, _id, _url) {
			_list.push({id:_id, url:_url});
		}, 
		
		loadFile : function(_id, _url, _callback) {
			api.loadBatch([{id:_id, url:_url}], _callback);
		}, 
		
		loadBatch : function(_list, _callback) {
			var batch = {
				callback : _callback, 
				list : _list, 
			};
			batchs.push(batch);
			if (curBatch === null) {
				loadNextBatch();
			}
		}, 
	};
	
	function loadNextBatch() {
		if (batchs.length == 0) {
			curBatch = null;
			return false;
		}
		curBatch = batchs.shift();
		loadNextModel();
	}
	
	function loadNextModel() {
		var nextModel = curBatch.list.shift();
		objectLoader.load(
			nextModel.url, 
			function(object){
				modelsLoaded[nextModel.id] = object;
				if (curBatch.list.length == 0) {
					curBatch.callback();
					loadNextBatch();
				}else{
					loadNextModel();
				}
			}, 
			function(xhr) {
				
			},
			function(xhr) {
				console.warn( 'App.Assets.Models error for loading', nextModel.url );
			}
		);
	}
	
	_app.Assets.Models = api;
	return _app;
})(App || {});