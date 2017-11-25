'use strict';

var App = (function(_app){
	
	var stored = [];
	
	var api = {
		createPersona : function() {
			var p = {
				attack : random(0.2, 2), 
				bonus : random(0.2, 2), 
				explore : random(0.2, 2), 
				safe : random(0.2, 2), 
			};
			return p;
		}, 
		
		clearStore : function() {
			stored = [];
		}, 
		
		storePersona : function(_persona, _score) {
			_persona.score = _score;
			stored.push({
				score : _score, 
				persona : _persona, 
			});
			// console.log('storePersona', stored);
		}, 
		
		getBestStored : function() {
			stored = stored.sort((a, b) => a.score > b.score);
			var best = stored.pop();
			if (best == undefined) {
				return api.createPersona();
			}
			return best.persona;
		}, 
		
		printStored : function() {
			console.log('-------------- ' + stored.length + ' Personas');
			stored.forEach(s => {
				console.log('{');
				console.log('score : ' + s.score + ', ');
				console.log('persona : {');
				console.log('attack : ' + s.persona.attack + ', ');
				console.log('bonus : ' + s.persona.bonus + ', ');
				console.log('explore : ' + s.persona.explore + ', ');
				console.log('safe : ' + s.persona.safe + ' ');
				console.log('}');
				console.log('},');
			});
			console.log('/Personas --------------');
		}, 
		
	};
	
	function random(_min, _max) {
		var gap = _max - _min;
		return _min + (Math.random() * gap);
	}
	
	_app.Persona = api;
	return _app;
})(App || {});