'use strict';

var App = (function(_app){
	_app.Fx = _app.Fx || {};
	
	var lgAmbient;
	var lgSpot;
	var lgBack;
	var editedLight;
	
	var api = {
		init : function() {
			lgAmbient = new THREE.AmbientLight(0x404040, 0.2);
			lgSpot = new THREE.DirectionalLight(0xffffff, 1);
			lgBack = new THREE.DirectionalLight(0x88aaff, 0.8);
			lgSpot.position.x = 20;
			lgSpot.position.y = 50;
			lgSpot.position.z = 20;
			lgBack.position.x = -50;
			lgBack.position.y = 0;
			lgBack.position.z = -20;
			Renderer.addToScene(lgAmbient);
			Renderer.addToScene(lgSpot);
			Renderer.addToScene(lgBack);
			
			// editedLight = lgAmbient;
			// editedLight = lgSpot;
			editedLight = lgBack;
			
			// Input.Keyboard.evt.listen('ON_KEY_DOWN_37', api, api.onPressLeft);
			// Input.Keyboard.evt.listen('ON_KEY_DOWN_39', api, api.onPressRight);
			// Input.Keyboard.evt.listen('ON_KEY_DOWN_40', api, api.onPressDown);
			// Input.Keyboard.evt.listen('ON_KEY_DOWN_38', api, api.onPressUp);
		}, 
		
		start : function() {
			
		}, 
		
		onPressLeft() {
			editedLight.position.x -= 10;
			console.log('editedLight.position.x', editedLight.position.x);
		}, 
		
		onPressRight() {
			editedLight.position.x += 10;
			console.log('editedLight.position.x', editedLight.position.x);
		}, 
		
		onPressDown() {
			editedLight.intensity -= 0.1;
			console.log('editedLight.intensity', editedLight.intensity);
		}, 
		
		onPressUp() {
			editedLight.intensity += 0.1;
			console.log('editedLight.intensity', editedLight.intensity);
		}, 
	};
	
	_app.Fx.Lights = api;
	return _app;
})(App || {});