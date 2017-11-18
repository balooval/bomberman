'use strict';

class Walker extends Entity{
	constructor() {
		super();
		this.setLayer(Renderer.layers.player);
		var startBloc = App.map.getStartBloc();
		console.log('startBloc', startBloc);
		this.setBlocPosition(startBloc[0], startBloc[1]);
		this.dropDelay = 20;
		this.dropLockToFrame = 0;
		this.speed = [0, 0];
		this.speedReducer = 4;
	}
	
	drop() {
		if (this.canDrop() === false) {
			return false;
		}
		this.dropLockToFrame = Renderer.getCurFrame() + this.dropDelay;
		var bomb = new Bomb();
		bomb.setBlocPosition(this.blocPosition[0], this.blocPosition[1]);
		App.map.addBomb(bomb);
		bomb.ignite();
		return true;
	}
	
	canDrop() {
		return this.dropLockToFrame < Renderer.getCurFrame();
	}
	
	move(_dirX, _dirY) {
		var nextBloc;
		nextBloc = this.getNextBloc(_dirX, 0);
		if (this.canGoToBloc(nextBloc) !== false) {
			this.position[0] += _dirX;
		}
		nextBloc = this.getNextBloc(0, _dirY);
		if (this.canGoToBloc(nextBloc) !== false) {
			this.position[1] += _dirY;
		}
		this.updatePosition();
		return true;
	}
	
	getNextBloc(_moveX, _moveY) {
		return this.getBlocFromPosition(
			this.position[0] + _moveX, 
			this.position[1] + _moveY
		);
	}
	
	canGoToBloc(_coord) {
		return App.map.isBlocAccessible(_coord[0], _coord[1]);
	}
	
	onRender(_evt) {
		super.onRender(_evt);
		Debug.set('debug_a', this.speed[0] + ' | ' + this.speed[1]);
		this.move(this.speed[0] / this.speedReducer, this.speed[1] / this.speedReducer);
	}
}