'use strict';

var App = (function() {
	var players = [];
	
	var api = {
		map : null, 
		blocSize : 4, 
		
		init : function() {
			document.addEventListener('DOMContentLoaded', onDocumentLoaded);
		}, 
		
		addPlayer : function() {
			var playerWalker = api.createWalker();
			playerWalker.setColor(0x6fd12e);
			var player = new Player(playerWalker);
			players.push(player);
		}, 
		
		createWalker : function() {
			var walker = new Walker();
			api.map.addWalker(walker);
			return walker;
		}, 
	};
	
	function start() {
		Renderer.init(document.getElementById('main'));
		Renderer.play();
		api.map = new Map();
		api.addPlayer();
		api.createWalker();
		api.createWalker();
		api.createWalker();
		Renderer.evt.listen('RENDER', App, onRender);
	}
	
	function onRender() {
		
	}
	
	function onDocumentLoaded() {
		start();
	}
	
	return api;
    
})();