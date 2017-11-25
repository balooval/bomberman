'use strict';

var App = (function(_app) {
	var players = [];
	var paused = false;
	
	_app.map = null;
	_app.blocSize = 4;
	_app.evt = null;
	
	var assetWaiting = 0;
		
	_app.init = function() {
		document.addEventListener('DOMContentLoaded', App.onDocumentLoaded);
	}
		
	_app.onDocumentLoaded = function() {
		console.log('Loading assets ...');
		App.evt = new Evt();
		App.Assets.Models.init();
		App.Assets.Textures.init();
		assetWaiting ++;
		App.Assets.Models.loadBatch(App.Ressources.Models, _app.onAssetsLoaded);
		assetWaiting ++;
		App.Assets.Sounds.loadBatch(App.Ressources.Sounds, _app.onAssetsLoaded);
		assetWaiting ++;
		App.Assets.Textures.loadBatch(App.Ressources.Textures, _app.onAssetsLoaded);
	} 
		
	_app.onAssetsLoaded = function() {
		assetWaiting --;
		if (assetWaiting > 0) {
			return false
		}
		console.log('Assets loaded');
		start();
	}
	
	_app.killRandomPlayer = function() {
		App.getPlayer().kill();
	}
	
	_app.killPlayer = function(_player) {
		App.evt.fireEvent('PLAYER_KILLED', _player);
		players.splice(players.indexOf(_player), 1);
		App.map.removeEntity('walkers', _player.walker);
		if (players.length == 0) {
			App.evt.fireEvent('GAME_OVER');
			App.map.clear();
			App.map.loadLevel();
		}
	}
	
	_app.getPlayerList = function() {
		return players;
	}
	
	_app.getPlayer = function(_excludedPlayer = null) {
		var otherPlayers = players.filter(p => p != _excludedPlayer);
		var index = Math.floor(Math.random() * otherPlayers.length);
		return otherPlayers[index];
	}
	
	_app.addHuman = function() {
		var humanWalker = _app.createWalker();
		humanWalker.setColor(0x6fd12e);
		var human = new Human(humanWalker, players.length);
		players.push(human);
		App.evt.fireEvent('PLAYER_ADDED', human);
	}
	
	_app.addBot = function() {
		if (players.length > 3) {
			return false;
		}
		var walker = _app.createWalker();
		walker.setColor(0xaf0000);
		var bot = new Bot(walker, players.length);
		players.push(bot);
		App.evt.fireEvent('PLAYER_ADDED', bot);
	}
		
	_app.createWalker = function() {
		var walker = new Walker();
		_app.map.addWalker(walker);
		return walker;
	}
	
	_app.setPause = function(_state) {
		paused = _state;
		App.evt.fireEvent('GAME_PAUSE_CHANGED', paused);
	}
	
	_app.onKeyPause = function() {
		App.setPause(!paused);
	}
	
	function onBrowserFrame() {
		if (!paused) {
			Renderer.renderNextFrame();
		}
        requestAnimationFrame(onBrowserFrame);
    }
	
	function start() {
		App.UI.init();
		App.Genetic.init();
		Input.Keyboard.evt.listen('ON_KEY_DOWN_68', App, App.Persona.printStored); // "D", debug
		Input.Keyboard.evt.listen('ON_KEY_DOWN_75', App, App.killRandomPlayer);
		Input.Keyboard.evt.listen('ON_KEY_DOWN_66', App, App.addBot);
		Input.Keyboard.evt.listen('ON_KEY_UP_80', App, App.onKeyPause);
		Renderer.init(document.getElementById('main'));
		App.Fx.Lights.init();
		Renderer.play();
		App.map = new Map();
		App.map.loadLevel();
		
		var addBots = true;
		addBots = false;
		if (addBots) {
			App.addBot();
			App.addBot();
			App.addBot();
		}
		requestAnimationFrame(onBrowserFrame);
		// App.setPause(true);
	}
	
	return _app;
    
})(App || {});