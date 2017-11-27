'use strict';

var App = (function(_app){
	_app.Ressources = _app.Ressources || {};
	
	var serverPath = 'https://val.openearthview.net/apps/bomberman/app/assets/';
	var modelsPath = serverPath + 'model/';
	var texturesPath = serverPath + 'graphics/';
	var soundPath = serverPath + 'sound/';
	
	_app.Ressources.Models = [
		{
			id : 'bloc-soft', 
			url : modelsPath + 'bloc-2.json', 
		}, 
		{
			id : 'bloc', 
			url : modelsPath + 'bloc-base.json', 
		},
		{
			id : 'rock', 
			url : modelsPath + 'rock.json', 
		},
		{
			id : 'blast', 
			url : modelsPath + 'blast.json', 
		}, 		
		{
			id : 'bomb', 
			url : modelsPath + 'bomb.json', 
		}, 
		{
			id : 'walker', 
			url : modelsPath + 'walker.json', 
		}, 
		/*
		{
			id : 'bloc', 
			url : modelsPath + 'bloc.json', 
		}, 
		*/
	];
	
	_app.Ressources.Textures = [
		{
			id : 'default', 
			url : texturesPath + 'default.png', 
		}, 
		{
			id : 'rock', 
			url : texturesPath + 'rock.png', 
		}, 
		{
			id : 'bloc', 
			url : texturesPath + 'bloc.png', 
		}, 
		{
			id : 'walker', 
			url : texturesPath + 'walker.png', 
		}, 
		{
			id : 'bloc-2', 
			url : texturesPath + 'bloc-2.png', 
		}, 
		{
			id : 'fire', 
			url : texturesPath + 'fire.png', 
			// url : texturesPath + 'flame.png', 
		}, 
		{
			id : 'ground', 
			url : texturesPath + 'ground.png', 
		}, 
		{
			id : 'bonus-bomb', 
			url : texturesPath + 'bonus-bomb.png', 
		}, 
		{
			id : 'brick', 
			url : texturesPath + 'brick.png', 
		}, 
		{
			id : 'cracked', 
			url : texturesPath + 'cracked.png', 
		}, 
		{
			id : 'bonus-speed', 
			url : texturesPath + 'bonus-speed.png', 
		}, 
		{
			id : 'bonus-hand', 
			url : texturesPath + 'bonus-hand.png', 
		}, 
		{
			id : 'bonus-push', 
			url : texturesPath + 'bonus-push.png', 
		}, 
		{
			id : 'bonus-flame', 
			url : texturesPath + 'bonus-flame.png', 
		}, 
	];
	
	_app.Ressources.Sounds = [
		{
			id : 'bomb_1', 
			url : soundPath + 'bomb_1.mp3'
		}, 
		{
			id : 'bomb_2', 
			url : soundPath + 'bomb_2.mp3'
		}, 
		{
			id : 'start', 
			url : soundPath + 'start.ogg'
		}, 
		{
			id : 'bonus', 
			url : soundPath + 'bonus_1.mp3'
		}, 
		{
			id : 'drop', 
			url : soundPath + 'drop.mp3'
		}, 
		{
			id : 'ignite', 
			url : soundPath + 'ignite.mp3'
		}, 
	];
	
	return _app;
})(App || {});