'use strict';

class Player {
	
	constructor(_walker) {
		this.walker = _walker;
		this.keyMap = {
			LEFT : 37, 
			RIGHT : 39, 
			UP : 38, 
			DOWN : 40, 
			DROP : 32, 
		};
		this.bindInputs(this.keyMap);
	}
	
	setwalker(_walker) {
		this.walker.accel[0] = 0;
		this.walker.accel[1] = 0;
		this.walker = _walker;
	}
	
	bindInputs(_keyMap) {
		Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.DROP, this, this.onPressDrop);
		Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.LEFT, this, this.onPressLeft);
		Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.RIGHT, this, this.onPressRight);
		Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.DOWN, this, this.onPressDown);
		Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.UP, this, this.onPressUp);
		Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.LEFT, this, this.onReleaseLeft);
		Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.RIGHT, this, this.onReleaseRight);
		Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.DOWN, this, this.onReleaseDown);
		Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.UP, this, this.onReleaseUp);
	}
	
	onPressDrop() {
		this.walker.drop();
	}
	
	onPressLeft() {
		this.walker.speed[0] -= 1;
	}
	
	onPressRight() {
		this.walker.speed[0] += 1;
	}
	
	onPressDown() {
		this.walker.speed[1] += 1;
	}
	
	onPressUp() {
		this.walker.speed[1] -= 1;
	}
	
	onReleaseLeft() {
		this.walker.speed[0] += 1;
	}
	
	onReleaseRight() {
		this.walker.speed[0] -= 1;
	}
	
	onReleaseDown() {
		this.walker.speed[1] -= 1;
	}
	
	onReleaseUp() {
		this.walker.speed[1] += 1;
	}
	
}