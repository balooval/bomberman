'use strict';

var App = (function(_app){
	_app.Assets = _app.Assets || {};
	
	var textureLoader = null;
	var batchs = [];
	var curBatch = null;
	var textLoaded = {};
	
	var api = {
		init : function() {
			textureLoader = new THREE.TextureLoader();
			textLoaded = {};
		}, 
		
		get : function(_id) {
			return textLoaded[_id];
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
		loadNextTexture();
	}
	
	function loadNextTexture() {
		var nextText = curBatch.list.shift();
		textureLoader.load(
			nextText.url, 
			function(t){
				textLoaded[nextText.id] = t;
				textLoaded[nextText.id].wrapS = textLoaded[nextText.id].wrapT = THREE.RepeatWrapping;
				if (curBatch.list.length == 0) {
					curBatch.callback();
					loadNextBatch();
				}else{
					loadNextTexture();
				}
			}, 
			function(xhr) {
				
			},
			function(xhr) {
				console.warn( 'App.Assets.Textures error for loading', nextText.url );
			}
		);
	}
	_app.Assets.Textures = api;
	return _app;
})(App || {});