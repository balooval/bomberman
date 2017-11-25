'use strict';

var App = (function(_app){
	
	var stored = [];
	
	var api = {
		init : function() {
			App.evt.listen('GAME_OVER', api, api.onGameOver);
		}, 
		
		onGameOver : function() {
			console.log('onGameOver');
			refreshPersonas();
		}, 
	};
	
	function refreshPersonas() {
		var pool = [
			App.Persona.getBestStored(), 
			App.Persona.getBestStored(), 
			App.Persona.createPersona(), 
			App.Persona.createPersona(), 
		];
		App.Persona.clearStore();
		pool.forEach(p => App.Persona.storePersona(p, Math.random()));
		// App.Persona.printStored();
	}
	
	_app.Genetic = api;
	return _app;
})(App || {});