'use strict';

class Bonus extends Entity{
	
	constructor() {
		super();
		this.type = this.chooseType();
		this.setLayer(Renderer.layers.items);
		this.setColor(0xffffff);
		this.setTexture(this.type.texture);
		var size = 0.7;
		this.setSize(size, size, size);
	}
	
	chooseType() {
		var rnd = Math.floor(Math.random() * this.getType().length);
		return this.getType()[rnd];
	}
	
	apply(_walker) {
		App.Sound.play('bonus');
		this.type.action(_walker);
		this.dispose();
	}
	
	actionThowBomb(_walker) {
		
	}
	
	actionPushBomb(_walker) {
		_walker.activeBombPushing();
	}
	
	actionAddBomb(_walker) {
		_walker.addBombCapacity(1);
	}
	
	actionBoostSpeed(_walker) {
		_walker.addSpeed();
	}
	
	actionBoostFlame(_walker) {
		_walker.addFlameSize(1);
	}
	
	getType(_index) {
		return [
			{
				name : 'speed', 
				description : 'avancer plus vite', 
				action : this.actionBoostSpeed, 
				texture : 'bonus-speed', 
			}, 
			{
				name : 'bomb', 
				description : 'poser une bombe de plus', 
				action : this.actionAddBomb, 
				texture : 'bonus-bomb', 
			}, 
			{
				name : 'hand', 
				description : 'jeter les bombes', 
				action : this.actionThowBomb, 
				texture : 'bonus-hand', 
			}, 
			{
				name : 'push', 
				description : 'pousser les bombes', 
				action : this.actionPushBomb, 
				texture : 'bonus-push', 
			}, 
			{
				name : 'flame', 
				description : 'plus grandes flammes', 
				action : this.actionBoostFlame, 
				texture : 'bonus-flame', 
			}, 
		];
	}
	
	dispose() {
		App.map.removeEntity('bonus', this);
		super.dispose();
	}
}