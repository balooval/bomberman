'use strict';

var App = (function(_app){
	_app.Assets = _app.Assets || {};
	
	var textureLoader = null;
	var batchs = [];
	var curBatch = null;
	var soundsLoaded = {};
	
	var api = {
		get : function(_id) {
			return soundsLoaded[_id];
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
		loadNextSound();
	}
	
	function loadNextSound() {
		var nextSound = curBatch.list.shift();
		var sound = new Howl({
			src: [nextSound.url]
		});
		sound.once('load', function(){
			soundsLoaded[nextSound.id] = sound;
			if (curBatch.list.length == 0) {
				curBatch.callback();
				loadNextBatch();
			}else{
				loadNextSound();
			}
		});
	}
	
	_app.Assets.Sounds = api;
	return _app;
})(App || {});