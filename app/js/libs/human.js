'use strict';

class Human extends Player {
	
	constructor(_walker, _name) {
		super(_walker, _name);
		this.keyMap = {
			LEFT : 37, 
			RIGHT : 39, 
			UP : 38, 
			DOWN : 40, 
			DROP : 32, 
		};
		this.bindInputs(this.keyMap);
		
		this.incentiveSafety = new Incentive(this.walker);
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

}