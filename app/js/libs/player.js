'use strict';

class Player {
	static getType(_id) {
		var type = [
			{
				name : 'Player A', 
				color : 0x9bff9b, 
			}, 
			{
				name : 'Player B', 
				color : 0xff9b9b, 
			}, 
			{
				name : 'Player C', 
				color : 0x9b9bFF, 
			}, 
			{
				name : 'Player D', 
				color : 0xffff9b, 
			}, 
		];
		return type[_id];
	}
	
	constructor(_walker, _id) {
		this.uid = this.generateUid();
		this.walker = _walker;
		var type = Player.getType(_id);
		this.name = type.name;
		this.walker.evt.listen('TAKE_DAMAGE', this, this.onWalkerIsDamaged);
		this.walker.setColor(type.color);
		this.buttonsState = {
			left : 0, 
			right : 0, 
			up : 0, 
			down : 0, 
		}
	}
	
	generateUid() {
		var uid = '';
		for (var i = 0; i < 4; i ++) {
			uid += Math.floor((1 + Math.random()) * 0x10000).toString(16);
		}
		return uid;
	}
	
	onWalkerIsDamaged() {
		this.kill();
	}
	
	kill() {
		// return false:
		this.walker.dispose();
		App.killPlayer(this);
		this.dispose();
	}
	
	onPressDrop() {
		this.walker.dropBomb();
	}
	
	onPressLeft() {
		if (this.updateButton('left', 1)) {
			this.walker.speed[0] -= 1;
		}
	}
	
	onPressRight() {
		if (this.updateButton('right', 1)) {
			this.walker.speed[0] += 1;
		}
	}
	
	onPressDown() {
		if (this.updateButton('down', 1)) {
			this.walker.speed[1] += 1;
		}
	}
	
	onPressUp() {
		if (this.updateButton('up', 1)) {
			this.walker.speed[1] -= 1;
		}
	}
	
	onReleaseLeft() {
		if (this.updateButton('left', 0)) {
			this.walker.speed[0] += 1;
		}
	}
	
	onReleaseRight() {
		if (this.updateButton('right', 0)) {
			this.walker.speed[0] -= 1;
		}
	}
	
	onReleaseDown() {
		if (this.updateButton('down', 0)) {
			this.walker.speed[1] -= 1;
		}
	}
	
	onReleaseUp() {
		if (this.updateButton('up', 0)) {
			this.walker.speed[1] += 1;
		}
	}
	
	updateButton(_btn, _state) {
		if (this.buttonsState[_btn] === _state) {
			return false;
		}
		this.buttonsState[_btn] = _state;
		return true;
	}
	
}