'use strict';

var App = (function(_app){
	var mute = true;
	
	var api = {
		init : function() {
			Input.Keyboard.evt.listen('ON_KEY_DOWN_83', api, api.switchState);
		}, 
		
		switchState : function() {
			mute = !mute;
		}, 
		
		play : function(_id) {
			if (mute) {
				return false;
			}
			App.Assets.Sounds.get(_id).play();
		}, 
		
		playOne : function(listId) {
			var index = Math.floor(Math.random() * listId.length);
			api.play(listId[index]);
		}, 
	};
	
	_app.Sound = api;
	return _app;
})(App || {});