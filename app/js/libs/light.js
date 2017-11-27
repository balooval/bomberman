'use strict';

var App = (function(_app){
	_app.Fx = _app.Fx || {};
	
	var lgAmbient;
	var lgMain;
	var lgBack;
	var lgSky;
	var editedLight;
	
	var api = {
		init : function() {
			lgAmbient = new THREE.AmbientLight(0x404040, 0.2);
			lgMain = new THREE.DirectionalLight(0xffffff, 0.6);
			lgBack = new THREE.DirectionalLight(0x88aaff, 0.8);
			lgSky = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9)
			lgMain.position.x = 20;
			lgMain.position.y = 20;
			lgMain.position.z = 20;
			lgBack.position.x = -50;
			lgBack.position.y = 0;
			lgBack.position.z = -20;
			// Renderer.addToScene(lgAmbient);
			Renderer.addToScene(lgMain);
			// Renderer.addToScene(lgBack);
			Renderer.addToScene(lgSky);
			
			// editedLight = lgAmbient;
			editedLight = lgMain;
			// editedLight = lgBack;
			// editedLight = lgSky;
			
			// lgMain.castShadow = true;
			lgMain.shadow.mapSize.width = 512;
			lgMain.shadow.mapSize.height = 512;
			lgMain.shadow.camera.near = 10;
			lgMain.shadow.camera.far = 100;
			lgMain.shadow.camera.left = lgMain.shadow.camera.bottom = -50;
			lgMain.shadow.camera.right = lgMain.shadow.camera.top = 50;
			
			Input.Keyboard.evt.listen('ON_KEY_DOWN_37', api, api.onPressLeft);
			Input.Keyboard.evt.listen('ON_KEY_DOWN_39', api, api.onPressRight);
			Input.Keyboard.evt.listen('ON_KEY_DOWN_40', api, api.onPressDown);
			Input.Keyboard.evt.listen('ON_KEY_DOWN_38', api, api.onPressUp);
		}, 
		
		start : function() {
			
		}, 
		
		onPressLeft() {
			editedLight.position.y -= 10;
			console.log('editedLight.position.y', editedLight.position.y);
		}, 
		
		onPressRight() {
			editedLight.position.y += 10;
			console.log('editedLight.position.y', editedLight.position.y);
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