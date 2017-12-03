'use strict';

var App = (function(_app){
	var api = {
		init : function() {
			App.Input.Keyboard.init();
			App.Input.Gamepad.init();
		}, 
	};
	
	_app.Input = api;
	return _app;
})(App || {});

	
App.Input.Gamepad = (function(){
	var gamepads;
	
	var axes = [];
	var buttons = [];
	
	var api = {
		evt : null, 
		
		init : function() {
			api.evt = new Evt();
			gamepads = navigator.getGamepads();
			console.log('gamepads', gamepads);
			window.addEventListener("gamepadconnected", function(e) {
				console.log('gamepadconnected', e);
				gamepads = navigator.getGamepads();
			});
			window.addEventListener("gamepaddisconnected", function(e) {
				console.log("Gamepad disconnected from index %d: %s",
				e.gamepad.index, e.gamepad.id);
			});
			initInputs(navigator.getGamepads());
			Renderer.evt.listen('RENDER', api, api.onRender);
		}, 
		
		onRender : function() {
			updateAxes(navigator.getGamepads()[0].axes);
			updateButtons(navigator.getGamepads()[0].buttons);
			
		}, 
	};
	
	function updateButtons(_buttons) {
		var buttonState;
		_buttons.forEach((b, i) => {
			if (buttons[i] != b.pressed) {
				buttons[i] = b.pressed;
				buttonState = b.pressed ? 'PRESS' : 'RELEASE';
				api.evt.fireEvent('BUTTON_' + i, b.pressed);
				api.evt.fireEvent('BUTTON_' + buttonState + '_' + i, b.pressed);
			}
		});
	}
	
	function updateAxes(_axes) {
		var axeState;
		var state;
		_axes.forEach((a, i) => {
			state = a > 0.5 ? true : false;
			if (axes[i][0] != state) {
				axes[i][0] = state;
				axeState = state ? 'PRESS' : 'RELEASE';
				api.evt.fireEvent('AXE_' + axeState + '_' + i + '_0', axeState);
			}
			state = a < -0.5 ? true : false;
			if (axes[i][1] != state) {
				axes[i][1] = state;
				axeState = state ? 'PRESS' : 'RELEASE';
				api.evt.fireEvent('AXE_' + axeState + '_' + i + '_1', axeState);
			}
		});
	}
	
	function initInputs(_gamepads) {
		axes = _gamepads[0].axes.map(a => [0, 0]);
		buttons = _gamepads[0].buttons.map(b => false);
	}
	
	return api;
})();

App.Input.Keyboard = (function(){
	var majActiv = false;
	var ctrlActiv = false;
	var keyState = {};
	
	var api ={
		evt : new Evt(), 
		lastKeyDown : -1, 
		lastKeyUp : -1, 
		
		init : function() {
			document.body.addEventListener('keydown', api.onKeyDown);
			document.body.addEventListener('keyup', api.onKeyUp);
		}, 
		
		onKeyDown : function(event) {
			if (document.activeElement.type != undefined) {
				return false;
			}
			var key = event.keyCode || event.which;
			var keychar = String.fromCharCode(key);
			// console.log('onKeyDown : ', key, ' / ', keychar);
			if (api.lastKeyDown != key) {
				api.lastKeyUp = -1;
				api.lastKeyDown = key;
				
				if (keyState[key] && keyState[key] == 1) {
					return true;
				}
				
				keyState[key] = 1;
				api.evt.fireEvent("ON_KEY_DOWN");
				api.evt.fireEvent('ON_KEY_DOWN_' + key);
				// console.log('ON_KEY_DOWN', key);
			}
			if (key == 87) { // w
				
			} else if (key == 16) { // MAJ
				majActiv = true;
			} else if (key == 17) { // CTRL
				ctrlActiv = true;
			} else if (key == 37) { // LEFT
				
			} else if (key == 39) { // RIGHT
				
			} else if (key == 38) { // TOP

			} else if (key == 40) { // BOTTOM

			} else if (key == 32) { // SPACE
			
			} else if (key == 49) { // 1
				
			} else if (key == 50) { // 2
				
			} else if (key == 51) { // 3
				
			} else if (key == 65) { // a
				
			} else if (key == 66) { // b
				
			} else if (key == 67) { // c
				
			} else if (key == 68) { // d
				
			} else if (key == 69) { // e

			} else if (key == 71) { // g
			
			} else if (key == 75) { // k
			
			} else if (key == 76) { // l

			} else if (key == 79) { // o
				
			} else if (key == 80) { // p
				
			} else if (key == 82) { // r
				
			} else if (key == 83) { // s
				
			} else if (key == 90) { // z
				
			} else if (key == 107) { // +
				
			} else if (key == 109) { // -
				
			} else if (key == 88) { // x
				
			}
		}, 
				
		onKeyUp : function(evt) {
			var key = evt.keyCode || evt.which;
			var keychar = String.fromCharCode(key);
			if (api.lastKeyUp != key) {
				api.lastKeyDown = -1;
				api.lastKeyUp = key;
				keyState[key] = 0;
				api.evt.fireEvent("ON_KEY_UP");
				api.evt.fireEvent('ON_KEY_UP_' + key);
			}
			if (key == 17) { // CTRL
				ctrlActiv = false;
			} else if (key == 16) { // MAJ
				majActiv = false;
			}
		}, 
	};
	
	return api;
})();