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
		App.Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.DROP, this, this.onPressDrop);
		App.Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.LEFT, this, this.onPressLeft);
		App.Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.RIGHT, this, this.onPressRight);
		App.Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.DOWN, this, this.onPressDown);
		App.Input.Keyboard.evt.listen('ON_KEY_DOWN_' + _keyMap.UP, this, this.onPressUp);
		App.Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.LEFT, this, this.onReleaseLeft);
		App.Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.RIGHT, this, this.onReleaseRight);
		App.Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.DOWN, this, this.onReleaseDown);
		App.Input.Keyboard.evt.listen('ON_KEY_UP_' + _keyMap.UP, this, this.onReleaseUp);
		
		App.Input.Gamepad.evt.listen('AXE_PRESS_1_1', this, this.onPressUp);
		App.Input.Gamepad.evt.listen('AXE_RELEASE_1_1', this, this.onReleaseUp);
		App.Input.Gamepad.evt.listen('AXE_PRESS_1_0', this, this.onPressDown);
		App.Input.Gamepad.evt.listen('AXE_RELEASE_1_0', this, this.onReleaseDown);
		App.Input.Gamepad.evt.listen('AXE_PRESS_0_1', this, this.onPressLeft);
		App.Input.Gamepad.evt.listen('AXE_RELEASE_0_1', this, this.onReleaseLeft);
		App.Input.Gamepad.evt.listen('AXE_PRESS_0_0', this, this.onPressRight);
		App.Input.Gamepad.evt.listen('AXE_RELEASE_0_0', this, this.onReleaseRight);
		App.Input.Gamepad.evt.listen('BUTTON_PRESS_0', this, this.onPressDrop);
	}

}