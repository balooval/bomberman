'use strict';

var App = (function(_app){
	
	var api = {
		
		init : function() {
			App.evt.listen('PLAYER_ADDED', api, api.onPlayerAdded);
			App.evt.listen('PLAYER_KILLED', api, api.onPlayerKilled);
			App.evt.listen('GAME_OVER', api, api.onGameOver);
			App.evt.listen('GAME_PAUSE_CHANGED', api, api.onPauseChanged);
			App.UI.Modal.init();
		}, 
		
		onGameOver : function() {
			document.querySelectorAll('.container-player').forEach(e => e.remove());
		}, 
		
		onPauseChanged : function(_state) {
			if (_state) {
				App.UI.Modal.setHtml('<div id="modal-pause" class="box">PAUSE</div>');
			} else {
				App.UI.Modal.clear();
			}
		}, 
		
		onPlayerAdded : function(_player) {
			// console.log('onPlayerAdded', _player);
			api.gebi('container-ui').innerHTML += '<div class="container-player" id="player-' + _player.uid + '">' + _player.name + '</div>'
		}, 
		
		onPlayerKilled : function(_player) {
			api.gebi('player-' + _player.uid).classList.add('dead');
		}, 
		
		gebi : function(_id) {
			return document.getElementById(_id);
		}, 
	};
	
	
	_app.UI = api;
	return _app;
})(App || {});